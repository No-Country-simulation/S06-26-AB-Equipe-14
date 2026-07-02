from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.models.antena import Antena
from app.models.assinantes import Assinante
from app.models.tensor_concentracao import TensorConcentracao
from app.models.tensor_fluxo_vias import TensorFluxoVias
from app.models.tensor_od import TensorOD
from app.models.tensor_tempo_deslocamento import TensorTempoDeslocamento
from app.models.trajetos_comuns import TrajetosComuns

from app.database import get_db
from app.schemas import DadosRequest, DadosResponse
from app.services.visent_service import VisentService
from app.services.cohere_service import CohereService

router = APIRouter(prefix="/api/dados")


cohere_service = CohereService()

@router.post("", response_model=DadosResponse)
def consultar_dados(request: DadosRequest, db: Session = Depends(get_db)):
    visent_service = VisentService(db)
    
   
    filtros_dict = request.filtros.model_dump() if request.filtros else None
    documentos = visent_service.get_contexto_para_ia(
        consulta=request.consulta,
        filtros=filtros_dict
    )
    
    
    resultado = cohere_service.consultar(
        consulta=request.consulta,
        documentos=documentos,
        idioma=request.idioma or "pt"
    )
    
    return DadosResponse(
        resposta_ia=resultado["resposta_ia"],
        dados=resultado["dados"],
        fontes=resultado["fontes"]
    )


def _antena_to_dict(a: Antena) -> dict:
    """Converte a tabela para dicionário"""
    return {
        "ecgi": a.ecgi,
        "municipio": a.municipio,
        "cluster": a.cluster,
        "lat": a.lat,
        "lon": a.lon,
        "tecnologia": a.tecnologia,
        "nome": a.nome
    }

def _assinantes_to_dict(a: Assinante) -> dict:
    """Converte a tabela para dicionário"""
    return {
        "assinante_hash": a.assinante_hash,
        "home_cluster": a.home_cluster,
        "home_municipio": a.home_municipio,
        "income_cluster":  a.income_cluster,
        "age_group": a.age_group,
        "mobility_pattern": a.mobility_pattern,
        "flag_flagship": a.flag_flagship
    }

def _tensor_concentracao_to_dict(t: TensorConcentracao) -> dict:
    return {
        "ecgi": t.ecgi,
        "cluster": t.cluster,
        "municipio": t.municipio,
        "dia": t.dia.isoformat() if t.dia else None,
        "periodo": t.periodo,
        "n_usuarios": t.n_usuarios,
        "n_sessoes": t.n_sessoes,
        "download_bytes": t.download_bytes,
        "upload_bytes": t.upload_bytes,
        "dur_media_s": t.dur_media_s,
        "drop_pct_medio": t.drop_pct_medio,
        "congestionamento_medio": t.congestionamento_medio,
        "chamadas_total": t.chamadas_total,
        "mensagens_total": t.mensagens_total,
        "lat": t.lat,
        "lon": t.lon,
    }

def _tensorfluxovias_to_dict(t: TensorFluxoVias) -> dict:
    return {
        "ecgi_origem": t.ecgi_origem,
        "lat_origem": t.lat_origem,
        "lon_origem": t.lon_origem,
        "cluster_origem": t.cluster_origem,
        "municipio_origem": t.municipio_origem,
        "ecgi_destino": t.ecgi_destino,
        "lat_destino": t.lat_destino,
        "lon_destino": t.lon_destino,
        "cluster_destino": t.cluster_destino,
        "municipio_destino": t.municipio_destino,
        "n_usuarios": t.n_usuarios,
        "n_transicoes": t.n_transicoes,
        "dist_km": t.dist_km,
        "periodo_predominante": t.periodo_predominante,
        "pct_do_cluster_origem": t.pct_do_cluster_origem,
    }

def _tensorod_to_dict(t: TensorOD) -> dict:
    return {
        "cluster_origem": t.cluster_origem,
        "municipio_origem": t.municipio_origem,
        "lat_origem": t.lat_origem,
        "lon_origem": t.lon_origem,
        "cluster_destino": t.cluster_destino,
        "municipio_destino": t.municipio_destino,
        "lat_destino": t.lat_destino,
        "lon_destino": t.lon_destino,
        "mesmo_cluster": t.mesmo_cluster,
        "n_usuarios": t.n_usuarios,
        "n_viagens": t.n_viagens,
        "dist_media_km": t.dist_media_km,
        "periodo_predominante": t.periodo_predominante,
    }

def _tensortempodeslocamento_to_dict(t: TensorTempoDeslocamento) -> dict:
    return {
        "cluster_origem": t.cluster_origem,
        "cluster_destino": t.cluster_destino,
        "mesmo_cluster": t.mesmo_cluster,
        "n_observacoes": t.n_observacoes,
        "dist_media_km": t.dist_media_km,
        "dist_p25_km": t.dist_p25_km,
        "dist_p75_km": t.dist_p75_km,
        "periodo_predominante": t.periodo_predominante,
    }

def _trajetoscomuns_to_dict(t: TrajetosComuns) -> dict:
    return {
        "cluster_origem": t.cluster_origem,
        "municipio_origem": t.municipio_origem,
        "lat_origem": t.lat_origem,
        "lon_origem": t.lon_origem,
        "cluster_destino": t.cluster_destino,
        "municipio_destino": t.municipio_destino,
        "lat_destino": t.lat_destino,
        "lon_destino": t.lon_destino,
        "mesmo_cluster": t.mesmo_cluster,
        "n_usuarios": t.n_usuarios,
        "n_viagens": t.n_viagens,
        "dist_media_km": t.dist_media_km,
        "periodo_predominante": t.periodo_predominante,
    }

@router.get("/antenas")
def listar_antenas(db: Session = Depends(get_db)):
    antenas = db.query(Antena).all()
    return [_antena_to_dict(a) for a in antenas]

@router.get("/assinantes")
def listar_assinantes(db: Session = Depends(get_db)):
    assinantes = db.query(Assinante).all()
    return [_assinantes_to_dict(a) for a in assinantes]

@router.get("/tensor_concentracao")
def listar_tensor_concentracao(db: Session = Depends(get_db)):
    tensorconc = db.query(TensorConcentracao).all()
    return [_tensor_concentracao_to_dict(t) for t in tensorconc]

@router.get("/tensor_fluxovias")
def listar_tensor_fluxo_vias(db: Session = Depends(get_db)):
    tensorflux = db.query(TensorFluxoVias).all()
    return [_tensorfluxovias_to_dict(t) for t in tensorflux]

@router.get("/tensorod")
def listar_tensorod(db: Session = Depends(get_db)):
    tensorod = db.query(TensorOD).all()
    return [_tensorod_to_dict(t) for t in tensorod]

@router.get("/tensor_tempodeslocamento")
def listar_tensor_tempo_deslocamento(db: Session = Depends(get_db)):
    tensortempodes = db.query(TensorTempoDeslocamento).all()
    return [_tensortempodeslocamento_to_dict(t) for t in tensortempodes]

@router.get("/trajetoscomuns")
def listar_trajetoscomuns(db: Session = Depends(get_db)):
    trajetoscomuns = db.query(TrajetosComuns).all()
    return [_trajetoscomuns_to_dict(t) for t in trajetoscomuns]