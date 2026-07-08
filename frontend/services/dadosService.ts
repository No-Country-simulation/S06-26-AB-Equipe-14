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

async function fetchStats(path: string): Promise<any> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}/dados/${path}`, {
      headers,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      if (res.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/";
        }
      }
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    return null;
  }
}

export const dadosApi = {
  antenas: () => fetchStats("antenas"),
  assinantes: () => fetchStats("assinantes"),
  concentracao: () => fetchStats("tensor_concentracao"),
  fluxoVias: () => fetchStats("tensor_fluxovias"),
  od: () => fetchStats("tensorod"),
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
export function antenasPorTecnologia(antenas: any): CategoryDatum[] {
  if (!antenas || !antenas.por_tecnologia) return [];
  return Object.entries(antenas.por_tecnologia).map(([label, value]) => ({
    label,
    value: Number(value),
  })).sort((a, b) => b.value - a.value);
}

/** Utilizadores únicos somados por município (top N). */
export function concentracaoPorMunicipio(
  conc: any,
  topN = 8
): CategoryDatum[] {
  if (!conc || !conc.por_municipio) return [];
  return Object.entries(conc.por_municipio).map(([label, value]) => ({
    label,
    value: Number(value),
  })).sort((a, b) => b.value - a.value).slice(0, topN);
}

/** Distribuição de utilizadores por período do dia. */
export function concentracaoPorPeriodo(conc: any): CategoryDatum[] {
  if (!conc || !conc.por_periodo) return [];
  const mapped = Object.entries(conc.por_periodo).map(([label, value]) => ({
    label,
    value: Number(value),
  }));
  return orderPeriodo(mapped);
}

/** Top fluxos origem→destino por nº de transições. */
export function topFluxos(fluxos: any, topN = 7): CategoryDatum[] {
  if (!fluxos || !fluxos.por_cluster_origem) return [];
  return Object.entries(fluxos.por_cluster_origem).map(([label, value]) => ({
    label: `Origem: ${label}`,
    value: Number(value),
  })).sort((a, b) => b.value - a.value).slice(0, topN);
}

/* --------- Assinantes (demografia) --------- */

export function assinantesPorAgeGroup(assinantes: any): CategoryDatum[] {
  if (!assinantes || !assinantes.por_idade) return [];
  return Object.entries(assinantes.por_idade).map(([label, value]) => ({
    label,
    value: Number(value),
  })).sort((a, b) => b.value - a.value);
}

export function assinantesPorIncome(assinantes: any): CategoryDatum[] {
  if (!assinantes || !assinantes.por_renda) return [];
  return Object.entries(assinantes.por_renda).map(([label, value]) => ({
    label,
    value: Number(value),
  })).sort((a, b) => b.value - a.value);
}

export function assinantesPorMobilidade(assinantes: any): CategoryDatum[] {
  if (!assinantes || !assinantes.por_mobilidade) return [];
  return Object.entries(assinantes.por_mobilidade).map(([label, value]) => ({
    label,
    value: Number(value),
  })).sort((a, b) => b.value - a.value);
}

export default dadosApi;
