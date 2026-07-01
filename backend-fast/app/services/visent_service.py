"""
VisentService — Motor de cruzamento de dados Vísent CDRView.

Consulta o PostgreSQL e agrega os dados das tabelas Vísent para fornecer
contexto estruturado ao agente Cohere (RAG).
"""

from __future__ import annotations

import re
from typing import Optional

from sqlalchemy import func, case, desc
from sqlalchemy.orm import Session

from app.models.antena import Antena
from app.models.assinantes import Assinante
from app.models.tensor_concentracao import TensorConcentracao
from app.models.tensor_fluxo_vias import TensorFluxoVias
from app.models.tensor_od import TensorOD
from app.models.tensor_tempo_deslocamento import TensorTempoDeslocamento
from app.models.trajetos_comuns import TrajetosComuns



# Palavras-chave para identificar quais tabelas são relevantes à consulta

_KEYWORD_MAP: dict[str, list[str]] = {
    "concentracao": [
        "concentração", "concentracao", "densidade", "pessoas", "usuários",
        "usuarios", "calor", "heatmap", "população", "populacao", "sessões",
        "sessoes", "download", "upload", "congestion", "congestionamento",
        "chamadas", "mensagens", "tráfego", "trafego",
    ],
    "cobertura": [
        "cobertura", "rede", "antena", "antenas", "tecnologia", "3g", "4g",
        "5g", "erb", "sinal", "infraestrutura", "conectividade",
    ],
    "fluxo": [
        "fluxo", "via", "vias", "corredor", "corredores", "trânsito",
        "transito", "transição", "transicao", "deslocamento", "trajeto",
        "trajetos", "mobilidade", "rota", "rotas",
    ],
    "od": [
        "origem", "destino", "od", "viagem", "viagens", "pendular",
        "migração", "migracao",
    ],
    "assinantes": [
        "assinante", "assinantes", "demográfico", "demografico", "renda",
        "income", "idade", "age", "faixa", "etária", "etaria", "perfil",
        "flagship",
    ],
    "tempo": [
        "tempo", "deslocamento", "distância", "distancia", "p25", "p75",
        "percentil", "mediana",
    ],
}


class VisentService:
    """Serviço de agregação e cruzamento de dados Vísent CDRView."""

    def __init__(self, db: Session):
        self.db = db

    
    # Métodos de agregação por região / cluster

    def get_resumo_regiao(self, cluster: str) -> dict:
        """
        Agrega concentração, cobertura, fluxo e deslocamento
        para um cluster (região) específico.
        """
        conc = self._agregar_concentracao(cluster)
        antenas = self._antenas_por_cluster(cluster)
        fluxo_entrada = self._fluxo_para_cluster(cluster)
        fluxo_saida = self._fluxo_de_cluster(cluster)
        assinantes = self._perfil_assinantes_cluster(cluster)

        return {
            "cluster": cluster,
            "concentracao": conc,
            "antenas": antenas,
            "fluxo_entrada": fluxo_entrada,
            "fluxo_saida": fluxo_saida,
            "perfil_assinantes": assinantes,
        }

    def get_mapa_regioes(self) -> list[dict]:
        """
        Retorna todas as regiões com coordenadas, concentração agregada
        e indicadores de cobertura de rede.
        """
        rows = (
            self.db.query(
                TensorConcentracao.cluster,
                TensorConcentracao.municipio,
                func.avg(TensorConcentracao.lat).label("lat"),
                func.avg(TensorConcentracao.lon).label("lon"),
                func.sum(TensorConcentracao.n_usuarios).label("total_usuarios"),
                func.sum(TensorConcentracao.n_sessoes).label("total_sessoes"),
                func.avg(TensorConcentracao.congestionamento_medio).label("congestionamento_avg"),
                func.avg(TensorConcentracao.drop_pct_medio).label("drop_avg"),
                func.sum(TensorConcentracao.download_bytes).label("download_total"),
                func.sum(TensorConcentracao.upload_bytes).label("upload_total"),
            )
            .group_by(TensorConcentracao.cluster, TensorConcentracao.municipio)
            .all()
        )

        regioes = []
        for r in rows:
            # Avaliar qualidade da cobertura com base nos indicadores
            qualidade = self._avaliar_qualidade_rede(
                congestionamento=r.congestionamento_avg,
                drop_pct=r.drop_avg,
            )
            regioes.append({
                "regiao": r.cluster,
                "lat": round(r.lat, 6) if r.lat else None,
                "lng": round(r.lon, 6) if r.lon else None,
                "concentracao": int(r.total_usuarios) if r.total_usuarios else 0,
                "cobertura_rede": qualidade,
                "indicadores": {
                    "total_sessoes": int(r.total_sessoes) if r.total_sessoes else 0,
                    "congestionamento_medio": round(r.congestionamento_avg, 4) if r.congestionamento_avg else None,
                    "drop_medio": round(r.drop_avg, 4) if r.drop_avg else None,
                    "download_total_gb": round(r.download_total / 1e9, 2) if r.download_total else 0,
                    "upload_total_gb": round(r.upload_total / 1e9, 2) if r.upload_total else 0,
                    "municipio": r.municipio,
                },
            })

        return sorted(regioes, key=lambda x: x["concentracao"], reverse=True)

    def get_dados_por_indicador(
        self, indicador: str, regiao: Optional[str] = None
    ) -> list[dict]:
        """Filtra dados por tipo de indicador."""
        indicador_lower = indicador.lower()

        if indicador_lower in ("concentracao", "concentração", "densidade"):
            return self._dados_concentracao(regiao)
        elif indicador_lower in ("cobertura", "rede", "antenas"):
            return self._dados_cobertura(regiao)
        elif indicador_lower in ("fluxo", "mobilidade"):
            return self._dados_fluxo(regiao)
        elif indicador_lower in ("od", "origem-destino"):
            return self._dados_od(regiao)
        elif indicador_lower in ("assinantes", "demografico", "demográfico"):
            return self._dados_assinantes(regiao)
        else:
            
            return self._dados_concentracao(regiao)

    
  
    

    def get_contexto_para_ia(
        self, consulta: str, filtros: Optional[dict] = None
    ) -> list[dict]:
        """
        Analisa a consulta, identifica tabelas relevantes e monta
        documentos estruturados para RAG do Cohere.

        Retorna uma lista de dicts com keys 'title' e 'text'.
        """
        documentos: list[dict] = []
        consulta_lower = consulta.lower()
        regiao = filtros.get("regiao") if filtros else None

       
        dominios_relevantes = self._identificar_dominios(consulta_lower)

        
        if not dominios_relevantes:
            dominios_relevantes = {"concentracao", "cobertura"}

       
        if "concentracao" in dominios_relevantes:
            documentos.extend(self._doc_concentracao(regiao))

        if "cobertura" in dominios_relevantes:
            documentos.extend(self._doc_cobertura(regiao))

        if "fluxo" in dominios_relevantes or "od" in dominios_relevantes:
            documentos.extend(self._doc_fluxo(regiao))

        if "assinantes" in dominios_relevantes:
            documentos.extend(self._doc_assinantes(regiao))

        if "tempo" in dominios_relevantes:
            documentos.extend(self._doc_tempo_deslocamento(regiao))

        
        documentos.append(self._doc_resumo_geral())

        return documentos


    # Cruzamento multi-fonte

    def cruzar_dados(
        self, fontes: list[str], regiao: Optional[str] = None
    ) -> list[dict]:
        """
        Preparado para cruzar múltiplas fontes de dados.
        Atualmente suporta apenas 'visent'. No futuro, pode receber
        'datasus', 'oms', 'base_regional', etc.
        """
        resultados: list[dict] = []

        for fonte in fontes:
            if fonte == "visent":
                regioes = self.get_mapa_regioes()
                if regiao:
                    regioes = [r for r in regioes if r["regiao"] == regiao]
                resultados.extend(regioes)
            # Futuras fontes:
            # elif fonte == "datasus":
            #     resultados.extend(self._buscar_datasus(regiao))
            # elif fonte == "oms":
            #     resultados.extend(self._buscar_oms(regiao))

        return resultados

    # Métodos privados de agregação

    def _agregar_concentracao(self, cluster: str) -> dict:
        row = (
            self.db.query(
                func.sum(TensorConcentracao.n_usuarios).label("total_usuarios"),
                func.sum(TensorConcentracao.n_sessoes).label("total_sessoes"),
                func.avg(TensorConcentracao.congestionamento_medio).label("congest_avg"),
                func.avg(TensorConcentracao.drop_pct_medio).label("drop_avg"),
                func.sum(TensorConcentracao.download_bytes).label("download_total"),
                func.sum(TensorConcentracao.upload_bytes).label("upload_total"),
                func.sum(TensorConcentracao.chamadas_total).label("chamadas_total"),
                func.sum(TensorConcentracao.mensagens_total).label("msgs_total"),
            )
            .filter(TensorConcentracao.cluster == cluster)
            .first()
        )
        if not row or row.total_usuarios is None:
            return {}
        return {
            "total_usuarios": int(row.total_usuarios),
            "total_sessoes": int(row.total_sessoes),
            "congestionamento_medio": round(row.congest_avg, 4),
            "drop_medio": round(row.drop_avg, 4),
            "download_gb": round(row.download_total / 1e9, 2),
            "upload_gb": round(row.upload_total / 1e9, 2),
            "chamadas_total": int(row.chamadas_total),
            "mensagens_total": int(row.msgs_total),
        }

    def _antenas_por_cluster(self, cluster: str) -> list[dict]:
        antenas = (
            self.db.query(Antena)
            .filter(Antena.cluster == cluster)
            .all()
        )
        return [
            {
                "ecgi": a.ecgi,
                "lat": a.lat,
                "lon": a.lon,
                "tecnologia": a.tecnologia or "Desconhecida",
            }
            for a in antenas
        ]

    def _fluxo_para_cluster(self, cluster: str) -> list[dict]:
        rows = (
            self.db.query(TensorOD)
            .filter(TensorOD.cluster_destino == cluster)
            .order_by(desc(TensorOD.n_usuarios))
            .limit(10)
            .all()
        )
        return [
            {
                "origem": r.cluster_origem,
                "n_usuarios": r.n_usuarios,
                "n_viagens": r.n_viagens,
                "dist_media_km": r.dist_media_km,
            }
            for r in rows
        ]

    def _fluxo_de_cluster(self, cluster: str) -> list[dict]:
        rows = (
            self.db.query(TensorOD)
            .filter(TensorOD.cluster_origem == cluster)
            .order_by(desc(TensorOD.n_usuarios))
            .limit(10)
            .all()
        )
        return [
            {
                "destino": r.cluster_destino,
                "n_usuarios": r.n_usuarios,
                "n_viagens": r.n_viagens,
                "dist_media_km": r.dist_media_km,
            }
            for r in rows
        ]

    def _perfil_assinantes_cluster(self, cluster: str) -> dict:
        total = (
            self.db.query(func.count(Assinante.assinante_hash))
            .filter(Assinante.home_cluster == cluster)
            .scalar()
        ) or 0

        by_income = (
            self.db.query(
                Assinante.income_cluster,
                func.count(Assinante.assinante_hash).label("count"),
            )
            .filter(Assinante.home_cluster == cluster)
            .group_by(Assinante.income_cluster)
            .all()
        )

        by_age = (
            self.db.query(
                Assinante.age_group,
                func.count(Assinante.assinante_hash).label("count"),
            )
            .filter(Assinante.home_cluster == cluster)
            .group_by(Assinante.age_group)
            .all()
        )

        return {
            "total_assinantes": total,
            "por_renda": {r.income_cluster: r.count for r in by_income},
            "por_idade": {r.age_group: r.count for r in by_age},
        }

  
    # Métodos para dados por indicador

    def _dados_concentracao(self, regiao: Optional[str]) -> list[dict]:
        q = self.db.query(
            TensorConcentracao.cluster,
            TensorConcentracao.municipio,
            TensorConcentracao.periodo,
            func.sum(TensorConcentracao.n_usuarios).label("total_usuarios"),
            func.avg(TensorConcentracao.congestionamento_medio).label("congest"),
        ).group_by(
            TensorConcentracao.cluster,
            TensorConcentracao.municipio,
            TensorConcentracao.periodo,
        )
        if regiao:
            q = q.filter(TensorConcentracao.cluster == regiao)
        rows = q.all()
        return [
            {
                "regiao": r.cluster,
                "municipio": r.municipio,
                "periodo": r.periodo,
                "total_usuarios": int(r.total_usuarios) if r.total_usuarios else 0,
                "congestionamento": round(r.congest, 4) if r.congest else None,
                "fonte": "Vísent CDRView",
            }
            for r in rows
        ]

    def _dados_cobertura(self, regiao: Optional[str]) -> list[dict]:
        q = self.db.query(Antena)
        if regiao:
            q = q.filter(Antena.cluster == regiao)
        antenas = q.all()
        return [
            {
                "regiao": a.cluster,
                "ecgi": a.ecgi,
                "lat": a.lat,
                "lon": a.lon,
                "tecnologia": a.tecnologia or "N/D",
                "fonte": "Anatel / Vísent CDRView",
            }
            for a in antenas
        ]

    def _dados_fluxo(self, regiao: Optional[str]) -> list[dict]:
        q = self.db.query(TensorFluxoVias).order_by(desc(TensorFluxoVias.n_usuarios)).limit(20)
        if regiao:
            q = q.filter(
                (TensorFluxoVias.cluster_origem == regiao)
                | (TensorFluxoVias.cluster_destino == regiao)
            )
        rows = q.all()
        return [
            {
                "origem": r.cluster_origem,
                "destino": r.cluster_destino,
                "n_usuarios": r.n_usuarios,
                "dist_km": r.dist_km,
                "periodo": r.periodo_predominante,
                "fonte": "Vísent CDRView",
            }
            for r in rows
        ]

    def _dados_od(self, regiao: Optional[str]) -> list[dict]:
        q = self.db.query(TensorOD).order_by(desc(TensorOD.n_usuarios)).limit(20)
        if regiao:
            q = q.filter(
                (TensorOD.cluster_origem == regiao)
                | (TensorOD.cluster_destino == regiao)
            )
        rows = q.all()
        return [
            {
                "origem": r.cluster_origem,
                "destino": r.cluster_destino,
                "n_usuarios": r.n_usuarios,
                "n_viagens": r.n_viagens,
                "dist_media_km": r.dist_media_km,
                "fonte": "Vísent CDRView",
            }
            for r in rows
        ]

    def _dados_assinantes(self, regiao: Optional[str]) -> list[dict]:
        q = self.db.query(
            Assinante.home_cluster,
            Assinante.income_cluster,
            Assinante.age_group,
            func.count(Assinante.assinante_hash).label("count"),
        ).group_by(
            Assinante.home_cluster,
            Assinante.income_cluster,
            Assinante.age_group,
        )
        if regiao:
            q = q.filter(Assinante.home_cluster == regiao)
        rows = q.all()
        return [
            {
                "regiao": r.home_cluster,
                "renda": r.income_cluster,
                "faixa_etaria": r.age_group,
                "total": r.count,
                "fonte": "Vísent CDRView",
            }
            for r in rows
        ]


    # Documentos para RAG

    def _doc_concentracao(self, regiao: Optional[str]) -> list[dict]:
        dados = self._dados_concentracao(regiao)
        if not dados:
            return []

        # Agrupar por cluster para resumir
        clusters: dict[str, dict] = {}
        for d in dados:
            cl = d["regiao"]
            if cl not in clusters:
                clusters[cl] = {"total": 0, "periodos": {}, "municipio": d.get("municipio", "")}
            clusters[cl]["total"] += d["total_usuarios"]
            clusters[cl]["periodos"][d["periodo"]] = d["total_usuarios"]

        docs = []
        for cl, info in sorted(clusters.items(), key=lambda x: x[1]["total"], reverse=True):
            periodos_str = ", ".join(
                f"{p}: {v} usuários" for p, v in info["periodos"].items()
            )
            docs.append({
                "title": f"Concentração de pessoas — {cl} ({info['municipio']})",
                "text": (
                    f"O cluster {cl} no município de {info['municipio']} "
                    f"tem um total acumulado de {info['total']:,} usuários. "
                    f"Distribuição por período: {periodos_str}. "
                    f"Fonte: Dataset Vísent CDRView — tensor_concentracao."
                ),
            })
        return docs[:10]  

    def _doc_cobertura(self, regiao: Optional[str]) -> list[dict]:
        q = self.db.query(
            Antena.cluster,
            Antena.municipio,
            func.count(Antena.ecgi).label("n_antenas"),
        ).group_by(Antena.cluster, Antena.municipio)
        if regiao:
            q = q.filter(Antena.cluster == regiao)
        rows = q.all()

        # Cruzar com congestionamento médio
        congest_map: dict[str, float] = {}
        congest_rows = (
            self.db.query(
                TensorConcentracao.cluster,
                func.avg(TensorConcentracao.congestionamento_medio).label("cong"),
                func.avg(TensorConcentracao.drop_pct_medio).label("drop"),
            )
            .group_by(TensorConcentracao.cluster)
            .all()
        )
        for cr in congest_rows:
            congest_map[cr.cluster] = {
                "congestionamento": round(cr.cong, 4) if cr.cong else None,
                "drop": round(cr.drop, 4) if cr.drop else None,
            }

        docs = []
        for r in rows:
            cong_info = congest_map.get(r.cluster, {})
            qualidade = self._avaliar_qualidade_rede(
                cong_info.get("congestionamento"),
                cong_info.get("drop"),
            )
            docs.append({
                "title": f"Cobertura de rede — {r.cluster} ({r.municipio})",
                "text": (
                    f"O cluster {r.cluster} em {r.municipio} possui {r.n_antenas} antenas ERB (Anatel). "
                    f"Congestionamento médio: {cong_info.get('congestionamento', 'N/D')}, "
                    f"taxa de drop: {cong_info.get('drop', 'N/D')}. "
                    f"Qualidade da rede avaliada como: {qualidade}. "
                    f"Fonte: Dataset Vísent CDRView + dados Anatel."
                ),
            })
        return docs

    def _doc_fluxo(self, regiao: Optional[str]) -> list[dict]:
        # Top fluxos OD
        q = (
            self.db.query(TensorOD)
            .order_by(desc(TensorOD.n_usuarios))
            .limit(10)
        )
        if regiao:
            q = q.filter(
                (TensorOD.cluster_origem == regiao)
                | (TensorOD.cluster_destino == regiao)
            )
        rows = q.all()

        docs = []
        for r in rows:
            docs.append({
                "title": f"Fluxo de pessoas — {r.cluster_origem} → {r.cluster_destino}",
                "text": (
                    f"De {r.cluster_origem} ({r.municipio_origem}) para {r.cluster_destino} "
                    f"({r.municipio_destino}): {r.n_usuarios:,} usuários fizeram {r.n_viagens:,} viagens. "
                    f"Distância média: {r.dist_media_km} km. "
                    f"Período predominante: {r.periodo_predominante}. "
                    f"{'Mesmo cluster.' if r.mesmo_cluster else 'Clusters diferentes.'} "
                    f"Fonte: Dataset Vísent CDRView — tensor_od."
                ),
            })
        return docs

    def _doc_assinantes(self, regiao: Optional[str]) -> list[dict]:
        q = self.db.query(
            Assinante.home_cluster,
            func.count(Assinante.assinante_hash).label("total"),
        ).group_by(Assinante.home_cluster)
        if regiao:
            q = q.filter(Assinante.home_cluster == regiao)
        clusters = q.order_by(desc("total")).limit(10).all()

        docs = []
        for c in clusters:
            # Buscar perfil detalhado
            by_income = dict(
                self.db.query(Assinante.income_cluster, func.count())
                .filter(Assinante.home_cluster == c.home_cluster)
                .group_by(Assinante.income_cluster)
                .all()
            )
            by_age = dict(
                self.db.query(Assinante.age_group, func.count())
                .filter(Assinante.home_cluster == c.home_cluster)
                .group_by(Assinante.age_group)
                .all()
            )
            income_str = ", ".join(f"{k}: {v}" for k, v in sorted(by_income.items()))
            age_str = ", ".join(f"{k}: {v}" for k, v in sorted(by_age.items()))

            docs.append({
                "title": f"Perfil demográfico — {c.home_cluster}",
                "text": (
                    f"O cluster {c.home_cluster} tem {c.total:,} assinantes. "
                    f"Distribuição por faixa de renda: {income_str}. "
                    f"Distribuição por faixa etária: {age_str}. "
                    f"Fonte: Dataset Vísent CDRView — assinantes."
                ),
            })
        return docs

    def _doc_tempo_deslocamento(self, regiao: Optional[str]) -> list[dict]:
        q = (
            self.db.query(TensorTempoDeslocamento)
            .order_by(desc(TensorTempoDeslocamento.n_observacoes))
            .limit(10)
        )
        if regiao:
            q = q.filter(
                (TensorTempoDeslocamento.cluster_origem == regiao)
                | (TensorTempoDeslocamento.cluster_destino == regiao)
            )
        rows = q.all()
        docs = []
        for r in rows:
            docs.append({
                "title": f"Tempo de deslocamento — {r.cluster_origem} → {r.cluster_destino}",
                "text": (
                    f"Deslocamento de {r.cluster_origem} para {r.cluster_destino}: "
                    f"distância média {r.dist_media_km} km (P25: {r.dist_p25_km}, P75: {r.dist_p75_km}). "
                    f"Observações: {r.n_observacoes}. Período predominante: {r.periodo_predominante}. "
                    f"Fonte: Dataset Vísent CDRView — tensor_tempo_deslocamento."
                ),
            })
        return docs

    def _doc_resumo_geral(self) -> dict:
        """Documento de contexto geral sobre o dataset."""
        total_antenas = self.db.query(func.count(Antena.ecgi)).scalar() or 0
        total_assinantes = self.db.query(func.count(Assinante.assinante_hash)).scalar() or 0
        n_clusters = (
            self.db.query(func.count(func.distinct(TensorConcentracao.cluster))).scalar() or 0
        )
        n_municipios = (
            self.db.query(func.count(func.distinct(TensorConcentracao.municipio))).scalar() or 0
        )

        return {
            "title": "Resumo geral do Dataset Vísent CDRView",
            "text": (
                f"O dataset Vísent CDRView cobre a Região Metropolitana de Florianópolis. "
                f"Contém dados de {total_antenas} antenas ERB (Anatel), "
                f"{total_assinantes:,} assinantes, {n_clusters} clusters/bairros "
                f"em {n_municipios} municípios. "
                f"Dados incluem: concentração de pessoas por antena e período, "
                f"fluxo de mobilidade entre clusters, pares origem-destino, "
                f"perfil demográfico e tempo de deslocamento. "
                f"Período dos dados: março de 2026, 15 dias. "
                f"Fonte principal: Vísent CDRView com coordenadas reais de antenas Anatel."
            ),
        }

    # Helpers


    def _identificar_dominios(self, consulta_lower: str) -> set[str]:
        """Identifica quais domínios de dados são relevantes à consulta."""
        relevantes = set()
        for dominio, keywords in _KEYWORD_MAP.items():
            for kw in keywords:
                if kw in consulta_lower:
                    relevantes.add(dominio)
                    break
        return relevantes

    @staticmethod
    def _avaliar_qualidade_rede(
        congestionamento: float | None, drop_pct: float | None
    ) -> str:
        """Avalia qualidade da rede com base em congestionamento e drop."""
        if congestionamento is None or drop_pct is None:
            return "Sem dados"
        
        score = (congestionamento + drop_pct) / 2
        if score < 0.1:
            return "Excelente"
        elif score < 0.25:
            return "Boa"
        elif score < 0.4:
            return "Regular"
        else:
            return "Precária"
