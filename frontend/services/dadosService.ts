// services/dadosService.ts
// Consome os endpoints de domínio (/api/dados/*) do backend (dataset Visent Coreview)
// e deriva as agregações usadas pelos gráficos estatísticos da Dashboard.
// Cada fetch tem fallback gracioso: se o endpoint ainda não existir / a base estiver
// vazia, devolve [] em vez de rebentar a UI.

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

/* ------------------------------------------------------------------ */
/* Tipos espelhando os _to_dict do backend (app/routers/dados.py)      */
/* ------------------------------------------------------------------ */

export interface Antena {
  ecgi: string;
  municipio: string;
  cluster: string;
  lat: number;
  lon: number;
  tecnologia: string;
  nome: string;
}

export interface Assinante {
  assinante_hash: string;
  home_cluster: string;
  home_municipio: string;
  income_cluster: string;
  age_group: string;
  mobility_pattern: string;
  flag_flagship: boolean;
}

export interface TensorConcentracao {
  ecgi: string;
  cluster: string;
  municipio: string;
  dia: string | null;
  periodo: string;
  n_usuarios: number;
  n_sessoes: number;
  download_bytes: number;
  upload_bytes: number;
  dur_media_s: number;
  drop_pct_medio: number;
  congestionamento_medio: number;
  chamadas_total: number;
  mensagens_total: number;
  lat: number;
  lon: number;
}

export interface TensorFluxoVias {
  ecgi_origem: string;
  municipio_origem: string;
  cluster_origem: string;
  ecgi_destino: string;
  municipio_destino: string;
  cluster_destino: string;
  n_usuarios: number;
  n_transicoes: number;
  dist_km: number;
  periodo_predominante: string;
  pct_do_cluster_origem: number;
}

export interface TensorOD {
  cluster_origem: string;
  municipio_origem: string;
  cluster_destino: string;
  municipio_destino: string;
  mesmo_cluster: boolean;
  n_usuarios: number;
  n_viagens: number;
  dist_media_km: number;
  periodo_predominante: string;
}

/* ------------------------------------------------------------------ */
/* Fetch genérico com fallback                                         */
/* ------------------------------------------------------------------ */

// Timeout generoso: alguns endpoints devolvem a tabela inteira (ex.: assinantes
// pode chegar a dezenas de MB). Evita que um pedido fique pendurado para sempre,
// sem cortar os que demoram legitimamente. Ver mensagem ao backend sobre
// endpoints agregados para eliminar estes payloads gigantes.
const FETCH_TIMEOUT_MS = 120_000;

async function fetchList<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_BASE}/dados/${path}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    // Endpoint indisponível, base vazia ou timeout → não quebra a UI.
    return [];
  }
}

export const dadosApi = {
  antenas: () => fetchList<Antena>("antenas"),
  assinantes: () => fetchList<Assinante>("assinantes"),
  concentracao: () => fetchList<TensorConcentracao>("tensor_concentracao"),
  fluxoVias: () => fetchList<TensorFluxoVias>("tensor_fluxovias"),
  od: () => fetchList<TensorOD>("tensorod"),
};

/* ------------------------------------------------------------------ */
/* Agregações para os gráficos                                         */
/* ------------------------------------------------------------------ */

export interface CategoryDatum {
  label: string;
  value: number;
}

export interface SeriesDatum {
  label: string;
  [serie: string]: string | number;
}

const PERIODO_ORDER = ["madrugada", "manha", "manhã", "tarde", "noite"];

function countBy<T>(items: T[], key: (item: T) => string | null | undefined): CategoryDatum[] {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = key(it);
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return Array.from(map, ([label, value]) => ({ label, value })).sort(
    (a, b) => b.value - a.value
  );
}

function sumBy<T>(
  items: T[],
  key: (item: T) => string | null | undefined,
  value: (item: T) => number
): CategoryDatum[] {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = key(it);
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + (value(it) ?? 0));
  }
  return Array.from(map, ([label, value]) => ({ label, value })).sort(
    (a, b) => b.value - a.value
  );
}

function orderPeriodo(data: CategoryDatum[]): CategoryDatum[] {
  return [...data].sort((a, b) => {
    const ia = PERIODO_ORDER.indexOf(a.label.toLowerCase());
    const ib = PERIODO_ORDER.indexOf(b.label.toLowerCase());
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
}

/* --------- Mobilidade / Telecom --------- */

/** Nº de antenas por tecnologia (2G/3G/4G/5G…). */
export function antenasPorTecnologia(antenas: Antena[]): CategoryDatum[] {
  return countBy(antenas, (a) => a.tecnologia);
}

/** Utilizadores únicos somados por município (top N). */
export function concentracaoPorMunicipio(
  conc: TensorConcentracao[],
  topN = 8
): CategoryDatum[] {
  return sumBy(conc, (c) => c.municipio, (c) => c.n_usuarios).slice(0, topN);
}

/** Distribuição de utilizadores por período do dia. */
export function concentracaoPorPeriodo(conc: TensorConcentracao[]): CategoryDatum[] {
  return orderPeriodo(sumBy(conc, (c) => c.periodo, (c) => c.n_usuarios));
}

/** Top fluxos origem→destino por nº de transições. */
export function topFluxos(fluxos: TensorFluxoVias[], topN = 7): CategoryDatum[] {
  return [...fluxos]
    .sort((a, b) => b.n_transicoes - a.n_transicoes)
    .slice(0, topN)
    .map((f) => ({
      label: `${f.municipio_origem ?? f.cluster_origem} → ${
        f.municipio_destino ?? f.cluster_destino
      }`,
      value: f.n_transicoes,
    }));
}

/* --------- Assinantes (demografia) --------- */

export function assinantesPorAgeGroup(assinantes: Assinante[]): CategoryDatum[] {
  return countBy(assinantes, (a) => a.age_group);
}

export function assinantesPorIncome(assinantes: Assinante[]): CategoryDatum[] {
  return countBy(assinantes, (a) => a.income_cluster);
}

export function assinantesPorMobilidade(assinantes: Assinante[]): CategoryDatum[] {
  return countBy(assinantes, (a) => a.mobility_pattern);
}

export default dadosApi;
