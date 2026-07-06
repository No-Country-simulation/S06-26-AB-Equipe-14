// services/reportsService.ts
// Constrói relatórios analíticos a partir dos dados reais (/api/dados/*).
// Cada relatório reúne KPIs e secções tabeladas prontas a exportar em PDF.
// Reutiliza as agregações do dadosService; herda o mesmo fallback gracioso
// (base vazia / endpoint indisponível → relatório com estado "Sem dados").

import {
  dadosApi,
  antenasPorTecnologia,
  concentracaoPorMunicipio,
  concentracaoPorPeriodo,
  topFluxos,
  assinantesPorAgeGroup,
  assinantesPorIncome,
  assinantesPorMobilidade,
  type Antena,
  type Assinante,
  type TensorConcentracao,
  type TensorFluxoVias,
  type TensorOD,
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
  generatedAt: string; // ISO
}

export interface ReportsOverview {
  kpis: {
    totalAntenas: number;
    totalAssinantes: number;
    totalMobilidade: number;
  };
  reports: AnalyticalReport[];
}

/* ------------------------------------------------------------------ */
/* Helpers locais                                                      */
/* ------------------------------------------------------------------ */

const nf = new Intl.NumberFormat("pt-PT");
const fmt = (n: number) => nf.format(n);

function status(n: number): ReportStatus {
  return n > 0 ? "Disponível" : "Sem dados";
}

function catToRows(data: CategoryDatum[], topN = 12): Array<[string, string]> {
  return data.slice(0, topN).map((d) => [d.label, fmt(d.value)]);
}

function countBy<T>(items: T[], key: (i: T) => string | null | undefined, topN = 12): CategoryDatum[] {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = key(it);
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return Array.from(map, ([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);
}

function uniqueCount<T>(items: T[], key: (i: T) => string | null | undefined): number {
  const set = new Set<string>();
  for (const it of items) {
    const k = key(it);
    if (k) set.add(k);
  }
  return set.size;
}

function odViagensPorOrigem(od: TensorOD[], topN = 12): CategoryDatum[] {
  const map = new Map<string, number>();
  for (const t of od) {
    const k = t.municipio_origem ?? t.cluster_origem;
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + (t.n_viagens ?? 0));
  }
  return Array.from(map, ([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);
}

/* ------------------------------------------------------------------ */
/* Construção dos relatórios                                           */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Builders — cada relatório é construído a partir da(s) sua(s) fonte(s) */
/* ------------------------------------------------------------------ */

function buildRedeAntenas(antenas: Antena[], now: string): AnalyticalReport {
  return {
    id: "rede-antenas",
    name: "Relatório de Rede & Antenas",
    description: "Cobertura e tecnologia das estações base (ERBs).",
    recordCount: antenas.length,
    status: status(antenas.length),
    generatedAt: now,
    metrics: [
      { label: "Antenas / ERBs", value: fmt(antenas.length) },
      { label: "Municípios cobertos", value: fmt(uniqueCount(antenas, (a) => a.municipio)) },
      { label: "Tecnologias", value: fmt(antenasPorTecnologia(antenas).length) },
    ],
    sections: [
      { title: "Antenas por tecnologia", columns: ["Tecnologia", "Nº"], rows: catToRows(antenasPorTecnologia(antenas)) },
      { title: "Antenas por município (top)", columns: ["Município", "Nº"], rows: catToRows(countBy(antenas, (a) => a.municipio)) },
    ],
  };
}

function buildDemografia(assinantes: Assinante[], now: string): AnalyticalReport {
  return {
    id: "demografia-assinantes",
    name: "Relatório Demográfico de Assinantes",
    description: "Distribuição de assinantes por idade, rendimento e mobilidade.",
    recordCount: assinantes.length,
    status: status(assinantes.length),
    generatedAt: now,
    metrics: [
      { label: "Assinantes", value: fmt(assinantes.length) },
      { label: "Faixas etárias", value: fmt(assinantesPorAgeGroup(assinantes).length) },
      { label: "Padrões de mobilidade", value: fmt(assinantesPorMobilidade(assinantes).length) },
    ],
    sections: [
      { title: "Por faixa etária", columns: ["Faixa etária", "Nº"], rows: catToRows(assinantesPorAgeGroup(assinantes)) },
      { title: "Por cluster de rendimento", columns: ["Rendimento", "Nº"], rows: catToRows(assinantesPorIncome(assinantes)) },
      { title: "Por padrão de mobilidade", columns: ["Padrão", "Nº"], rows: catToRows(assinantesPorMobilidade(assinantes)) },
    ],
  };
}

function buildConcentracao(conc: TensorConcentracao[], now: string): AnalyticalReport {
  return {
    id: "concentracao-rede",
    name: "Relatório de Concentração de Rede",
    description: "Utilização da rede por município e período do dia.",
    recordCount: conc.length,
    status: status(conc.length),
    generatedAt: now,
    metrics: [
      { label: "Registos", value: fmt(conc.length) },
      { label: "Municípios", value: fmt(uniqueCount(conc, (c) => c.municipio)) },
      { label: "Períodos", value: fmt(concentracaoPorPeriodo(conc).length) },
    ],
    sections: [
      { title: "Utilizadores por município (top)", columns: ["Município", "Utilizadores"], rows: catToRows(concentracaoPorMunicipio(conc, 12)) },
      { title: "Utilizadores por período", columns: ["Período", "Utilizadores"], rows: catToRows(concentracaoPorPeriodo(conc)) },
    ],
  };
}

function buildMobilidade(fluxos: TensorFluxoVias[], od: TensorOD[], now: string): AnalyticalReport {
  return {
    id: "mobilidade-od",
    name: "Relatório de Mobilidade (Origem-Destino)",
    description: "Principais fluxos e viagens entre zonas.",
    recordCount: fluxos.length + od.length,
    status: status(fluxos.length + od.length),
    generatedAt: now,
    metrics: [
      { label: "Fluxos em vias", value: fmt(fluxos.length) },
      { label: "Registos OD", value: fmt(od.length) },
      { label: "Viagens (total)", value: fmt(od.reduce((s, t) => s + (t.n_viagens ?? 0), 0)) },
    ],
    sections: [
      { title: "Top fluxos (por transições)", columns: ["Fluxo", "Transições"], rows: catToRows(topFluxos(fluxos, 12)) },
      { title: "Viagens por município de origem (top)", columns: ["Origem", "Viagens"], rows: catToRows(odViagensPorOrigem(od)) },
    ],
  };
}

/** Ordem estável de apresentação (o mais pesado — demografia — por último). */
export const REPORT_ORDER = ["rede-antenas", "concentracao-rede", "mobilidade-od", "demografia-assinantes"];

export interface ReportsHandlers {
  onKpis?: (partial: Partial<ReportsOverview["kpis"]>) => void;
  onReport?: (report: AnalyticalReport) => void;
  onSettled?: () => void;
}

/**
 * Carrega os relatórios de forma progressiva: cada fonte é obtida de forma
 * independente e o respetivo relatório/KPI é emitido assim que fica pronto,
 * evitando que o payload pesado (assinantes) bloqueie a página.
 */
export function loadReports(h: ReportsHandlers): void {
  const now = new Date().toISOString();
  let mobilidadeAcc = 0;

  // Fontes leves primeiro (aparecem depressa).
  const leves = [
    dadosApi.antenas().then((antenas) => {
      h.onKpis?.({ totalAntenas: antenas.length });
      h.onReport?.(buildRedeAntenas(antenas, now));
    }),

    dadosApi.concentracao().then((conc) => {
      mobilidadeAcc += conc.length;
      h.onKpis?.({ totalMobilidade: mobilidadeAcc });
      h.onReport?.(buildConcentracao(conc, now));
    }),

    Promise.all([dadosApi.fluxoVias(), dadosApi.od()]).then(([fluxos, od]) => {
      mobilidadeAcc += fluxos.length + od.length;
      h.onKpis?.({ totalMobilidade: mobilidadeAcc });
      h.onReport?.(buildMobilidade(fluxos, od, now));
    }),
  ];

  // Assinantes (~33 MB) só depois dos leves, para não lhes roubar largura de banda.
  const pesado = Promise.allSettled(leves).then(() =>
    dadosApi.assinantes().then((assinantes) => {
      h.onKpis?.({ totalAssinantes: assinantes.length });
      h.onReport?.(buildDemografia(assinantes, now));
    }),
  );

  Promise.allSettled([...leves, pesado]).then(() => h.onSettled?.());
}

export default { loadReports };
