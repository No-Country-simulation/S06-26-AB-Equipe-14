'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

interface MapRegionDTO {
  id: number
  code: string
  name: string
  centroidLat: number | null
  centroidLng: number | null
  concentration: number | null
  networkCoverageScore: number | null
  peopleCount: number | null
}

const apiPath = '/api/map'

export default function Dashboard() {
  const [regions, setRegions] = useState<MapRegionDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadRegions() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(apiPath, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Falha ao carregar dados: ${response.status} ${response.statusText}`)
        }

        const data: MapRegionDTO[] = await response.json()
        setRegions(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Erro desconhecido ao buscar dados do backend.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadRegions()
    return () => controller.abort()
  }, [])

  const stats = useMemo(() => {
    const validConcentrations = regions
      .map((region) => region.concentration)
      .filter((value): value is number => typeof value === 'number')
    const validCoverage = regions
      .map((region) => region.networkCoverageScore)
      .filter((value): value is number => typeof value === 'number')
    const population = regions
      .map((region) => region.peopleCount)
      .filter((value): value is number => typeof value === 'number')

    const average = (values: number[]) =>
      values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0

    return {
      totalRegions: regions.length,
      averageConcentration: average(validConcentrations),
      averageCoverage: average(validCoverage),
      totalPopulation: population.reduce((sum, value) => sum + value, 0),
      topRegions: [...regions]
        .sort((a, b) => (b.networkCoverageScore ?? 0) - (a.networkCoverageScore ?? 0))
        .slice(0, 4),
    }
  }, [regions])

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10 lg:px-14">
      <section className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <p className="inline-flex rounded-full bg-cyan-400/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Dashboard de dados</p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Visualize indicadores por região e conecte os dados do Spring Boot à interface.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                O painel consome o endpoint <span className="font-semibold text-cyan-200">/map</span> e apresenta as regiões, cobertura de rede e valores de concentração para suporte a decisões.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:w-[380px]">
              <Link href="/map" className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
                Ver Mapa
              </Link>
              <Link href="/reports" className="inline-flex items-center justify-center rounded-full border border-slate-600/80 bg-slate-900/90 px-5 py-3 text-sm text-slate-100 transition hover:border-cyan-300 hover:text-white">
                Relatórios
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Regiões" value={stats.totalRegions.toString()} />
              <SummaryCard label="Concentração média" value={stats.averageConcentration ? stats.averageConcentration.toFixed(2) : '–'} suffix="%" />
              <SummaryCard label="Cobertura média" value={stats.averageCoverage ? stats.averageCoverage.toFixed(2) : '–'} suffix="%" />
              <SummaryCard label="População total" value={stats.totalPopulation.toLocaleString('pt-BR')} />
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Regiões carregadas</h2>
                  <p className="mt-1 text-sm text-slate-400">Lista de regiões recebidas pela API Spring Boot.</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${loading ? 'bg-amber-500/15 text-amber-200' : error ? 'bg-red-500/15 text-red-200' : 'bg-emerald-500/15 text-emerald-200'}`}>
                  {loading ? 'Carregando...' : error ? 'Erro' : 'Atualizado'}
                </span>
              </div>

              {error ? (
                <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-100">
                  {error}
                </div>
              ) : null}

              <div className="mt-6 space-y-4">
                {loading ? (
                  <div className="rounded-3xl border border-slate-700/50 bg-slate-950/80 p-6 text-slate-400">Buscando dados do backend...</div>
                ) : regions.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-700/60 bg-slate-950/80 p-6 text-slate-400">Nenhuma região encontrada no endpoint.</div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {regions.map((region) => (
                      <div key={region.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                        <h3 className="text-lg font-semibold text-white">{region.name}</h3>
                        <p className="text-sm text-slate-400">Código: {region.code ?? '—'}</p>
                        <div className="mt-4 grid gap-2 text-sm text-slate-300">
                          <StatLine label="Concentração" value={region.concentration} suffix="%" />
                          <StatLine label="Cobertura de rede" value={region.networkCoverageScore} suffix="%" />
                          <StatLine label="População" value={region.peopleCount} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <h2 className="text-xl font-semibold text-white">Melhores regiões</h2>
              <p className="mt-2 text-sm text-slate-400">Regiões com maior pontuação de cobertura de rede.</p>
              <div className="mt-6 space-y-3">
                {stats.topRegions.map((region) => (
                  <div key={region.id} className="rounded-3xl bg-slate-950/90 p-4 text-slate-100">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{region.name}</p>
                        <p className="text-xs text-slate-500">{region.code || 'Sem código'}</p>
                      </div>
                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                        {region.networkCoverageScore?.toFixed(1) ?? '–'}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
              <h2 className="text-xl font-semibold text-white">Próximos passos</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>1. Aperfeiçoar o mapa com marcadores e filtros reais.</li>
                <li>2. Incluir gráficos de tendência de indicadores.</li>
                <li>3. Integrar a interface de AI Query com o endpoint `/dice`.</li>
              </ul>
            </div>
          </aside>
        </section>
      </section>
    </main>
  )
}

function SummaryCard({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}{suffix ? suffix : ''}</p>
    </div>
  )
}

function StatLine({ label, value, suffix }: { label: string; value: number | null | undefined; suffix?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-slate-700/50 pt-3 text-sm text-slate-300">
      <span>{label}</span>
      <span className="font-semibold text-slate-100">{value != null ? `${value}${suffix ?? ''}` : '–'}</span>
    </div>
  )
}
