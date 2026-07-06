import {
  dadosApi,
  antenasPorTecnologia,
  concentracaoPorMunicipio,
  concentracaoPorPeriodo,
  topFluxos,
  assinantesPorAgeGroup,
  assinantesPorIncome,
  assinantesPorMobilidade,
  type CategoryDatum,
} from "./dadosService";

export interface ReportMetric {
  label: string;
  value: string;
}

export interface ReportSection {
  title: string;
  columns: [string, string];
  rows: Array<[string, string | number]>;
}

export type ReportStatus = "Disponível" | "Sem dados";

export interface AnalyticalReport {
  id: string;
  name: string;
  description: string;
  recordCount: number;
  status: ReportStatus;
  metrics: ReportMetric[];
  sections: ReportSection[];
  generatedAt: string;
}

export interface ReportsOverview {
  kpis: {
    totalAntenas: number;
    totalAssinantes: number;
    totalMobilidade: number;
  };
  reports: AnalyticalReport[];
}

const nf = new Intl.NumberFormat("pt-PT");
const fmt = (n: number) => nf.format(n);

function status(n: number): ReportStatus {
  return n > 0 ? "Disponível" : "Sem dados";
}

function catToRows(data: CategoryDatum[], topN = 12): Array<[string, string]> {
  return data.slice(0, topN).map((d) => [d.label, fmt(d.value)]);
}

function dictToCategory(dict: Record<string, number>): CategoryDatum[] {
  return Object.entries(dict)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function dictLen(dict: Record<string, number>): number {
  return Object.keys(dict).length;
}

export async function getReportsOverview(): Promise<ReportsOverview> {
  const [antenas, assinantes, conc, fluxos, od] = await Promise.all([
    dadosApi.antenasStats(),
    dadosApi.assinantesStats(),
    dadosApi.concStats(),
    dadosApi.fluxoViasStats(),
    dadosApi.odStats(),
  ]);

  const now = new Date().toISOString();

  const reports: AnalyticalReport[] = [
    {
      id: "rede-antenas",
      name: "Relatório de Rede & Antenas",
      description: "Cobertura e tecnologia das estações base (ERBs).",
      recordCount: antenas?.total ?? 0,
      status: status(antenas?.total ?? 0),
      generatedAt: now,
      metrics: [
        { label: "Antenas / ERBs", value: fmt(antenas?.total ?? 0) },
        { label: "Municípios cobertos", value: fmt(antenas ? dictLen(antenas.por_municipio) : 0) },
        { label: "Tecnologias", value: fmt(antenasPorTecnologia(antenas).length) },
      ],
      sections: [
        { title: "Antenas por tecnologia", columns: ["Tecnologia", "Nº"], rows: catToRows(antenasPorTecnologia(antenas)) },
        { title: "Antenas por município (top)", columns: ["Município", "Nº"], rows: catToRows(antenas ? dictToCategory(antenas.por_municipio) : []) },
      ],
    },
    {
      id: "demografia-assinantes",
      name: "Relatório Demográfico de Assinantes",
      description: "Distribuição de assinantes por idade, rendimento e mobilidade.",
      recordCount: assinantes?.total ?? 0,
      status: status(assinantes?.total ?? 0),
      generatedAt: now,
      metrics: [
        { label: "Assinantes", value: fmt(assinantes?.total ?? 0) },
        { label: "Faixas etárias", value: fmt(assinantesPorAgeGroup(assinantes).length) },
        { label: "Padrões de mobilidade", value: fmt(assinantesPorMobilidade(assinantes).length) },
      ],
      sections: [
        { title: "Por faixa etária", columns: ["Faixa etária", "Nº"], rows: catToRows(assinantesPorAgeGroup(assinantes)) },
        { title: "Por cluster de rendimento", columns: ["Rendimento", "Nº"], rows: catToRows(assinantesPorIncome(assinantes)) },
        { title: "Por padrão de mobilidade", columns: ["Padrão", "Nº"], rows: catToRows(assinantesPorMobilidade(assinantes)) },
      ],
    },
    {
      id: "concentracao-rede",
      name: "Relatório de Concentração de Rede",
      description: "Utilização da rede por município e período do dia.",
      recordCount: conc?.total_usuarios ?? 0,
      status: status(conc ? dictLen(conc.por_municipio) : 0),
      generatedAt: now,
      metrics: [
        { label: "Utilizadores únicos", value: fmt(conc?.total_usuarios ?? 0) },
        { label: "Municípios", value: fmt(conc ? dictLen(conc.por_municipio) : 0) },
        { label: "Períodos", value: fmt(concentracaoPorPeriodo(conc).length) },
      ],
      sections: [
        { title: "Utilizadores por município (top)", columns: ["Município", "Utilizadores"], rows: catToRows(concentracaoPorMunicipio(conc, 12)) },
        { title: "Utilizadores por período", columns: ["Período", "Utilizadores"], rows: catToRows(concentracaoPorPeriodo(conc)) },
      ],
    },
    {
      id: "mobilidade-od",
      name: "Relatório de Mobilidade (Origem-Destino)",
      description: "Principais fluxos e viagens entre zonas.",
      recordCount: (fluxos?.top_fluxos.length ?? 0) + (od?.total_viagens ?? 0),
      status: status((fluxos?.top_fluxos.length ?? 0) + (od?.total_viagens ?? 0)),
      generatedAt: now,
      metrics: [
        { label: "Fluxos em vias", value: fmt(fluxos?.top_fluxos.length ?? 0) },
        { label: "Registos OD", value: fmt(od?.total_viagens ?? 0) },
        { label: "Viagens (total)", value: fmt(od?.total_viagens ?? 0) },
      ],
      sections: [
        { title: "Top fluxos (por transições)", columns: ["Fluxo", "Transições"], rows: catToRows(topFluxos(fluxos)) },
        { title: "Viagens por cluster de origem (top)", columns: ["Origem", "Viagens"], rows: catToRows(od ? dictToCategory(od.por_cluster_origem) : []) },
      ],
    },
  ];

  return {
    kpis: {
      totalAntenas: antenas?.total ?? 0,
      totalAssinantes: assinantes?.total ?? 0,
      totalMobilidade: (conc?.total_usuarios ?? 0) + (fluxos?.total_usuarios ?? 0) + (od?.total_viagens ?? 0),
    },
    reports,
  };
}

export default { getReportsOverview };
