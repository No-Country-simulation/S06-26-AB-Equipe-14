'use client';

import { useState } from 'react';
import {
  BsShuffle,
  BsGlobe2,
  BsLink45Deg,
  BsCpu,
  BsBarChartSteps,
  BsDatabaseCheck,
  BsTelephone,
  BsPeople,
  BsGeoAlt,
  BsArrowRight,
  BsFileBarGraph,
} from 'react-icons/bs';
import { dadosApi } from '@/services/dadosService';

interface Source {
  id: string;
  name: string;
  category: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
  description: string;
}

const SOURCES: Source[] = [
  {
    id: 'ine',
    name: 'INE Angola',
    category: 'Demografia, Emprego & Censo',
    url: 'https://www.ine.gov.ao/',
    icon: <BsPeople size={22} />,
    color: 'text-cyan-400',
    glow: 'shadow-cyan-500/10',
    description: 'Instituto Nacional de Estatística de Angola. Fornece dados demográficos oficiais, censos populacionais e taxas de emprego/alfabetização.',
  },
  {
    id: 'inacom',
    name: 'INACOM',
    category: 'Telecomunicações & Cobertura Móvel',
    url: 'https://www.inacom.gov.ao/',
    icon: <BsTelephone size={22} />,
    color: 'text-blue-400',
    glow: 'shadow-blue-500/10',
    description: 'Instituto Angolano das Comunicações. Autoridade reguladora de telecomunicações, responsável pelas métricas de penetração e cobertura móvel.',
  },
  {
    id: 'opencellid',
    name: 'OpenCelliD',
    category: 'Bancos de Dados de Torres',
    url: 'https://opencellid.org/',
    icon: <BsCpu size={22} />,
    color: 'text-purple-400',
    glow: 'shadow-purple-500/10',
    description: 'A maior base de dados aberta de torres de celular do mundo. Útil para mapear e estimar a mobilidade urbana e o sinal de rede 3G/4G/5G.',
  },
  {
    id: 'openstreetmap',
    name: 'OpenStreetMap',
    category: 'Dados Geoespaciais & Mapas',
    url: 'https://www.openstreetmap.org/',
    icon: <BsGeoAlt size={22} />,
    color: 'text-emerald-400',
    glow: 'shadow-emerald-500/10',
    description: 'Dados de mapeamento colaborativo global. Inclui limites administrativos de Angola, províncias, distritos urbanos e malha rodoviária nacional.',
  },
  {
    id: 'worldbank',
    name: 'Banco Mundial',
    category: 'Indicadores Socioeconómicos',
    url: 'https://data.worldbank.org/country/angola',
    icon: <BsGlobe2 size={22} />,
    color: 'text-amber-400',
    glow: 'shadow-amber-500/10',
    description: 'Dados globais de desenvolvimento. Inclui PIB per capita de Angola, taxas de acesso a eletricidade, população urbana e índice de capital humano.',
  },
];

export default function SourcesContent() {
  const [selected, setSelected] = useState<string[]>(['ine', 'inacom']);
  const [crossing, setCrossing] = useState(false);
  const [crossedData, setCrossedData] = useState<any[] | null>(null);

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCrossData = async () => {
    if (selected.length === 0) return;
    setCrossing(true);
    try {
      const queryStr = selected.join(',');
      const res = await dadosApi.cruzamento(queryStr);
      setCrossedData(res);
    } catch (err) {
      console.error('Erro ao cruzar fontes:', err);
    } finally {
      setCrossing(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-purple-900/20 border border-purple-500/20 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BsShuffle size={120} className="text-purple-400 animate-pulse" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-purple-500 animate-ping" />
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-purple-400">Cruzamento de Fontes</h2>
          </div>
          <h3 className="text-3xl font-extrabold text-white leading-tight">
            Indicadores Combinados de Angola
          </h3>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Selecione as fontes oficiais e internacionais abaixo para cruzar métricas demográficas, cobertura móvel de telecomunicações, malhas geoespaciais e indicadores de desenvolvimento socioeconómico de Angola.
          </p>
        </div>
      </div>

      {/* Grid de Seleção de Fontes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SOURCES.map((source) => {
          const isSelected = selected.includes(source.id);
          return (
            <div
              key={source.id}
              onClick={() => toggleSelect(source.id)}
              className={`relative overflow-hidden cursor-pointer border rounded-2xl p-5 backdrop-blur-md transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900/90 border-purple-500/50 shadow-lg shadow-purple-500/5'
                  : 'bg-slate-900/30 border-white/5 hover:border-white/10 hover:bg-slate-900/50'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl bg-white/5 ${source.color} ${source.glow}`}>
                    {source.icon}
                  </div>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-slate-500'
                  }`}>
                    {isSelected ? 'Selecionado' : 'Disponível'}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-lg">{source.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{source.category}</p>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{source.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] text-slate-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                >
                  <BsLink45Deg size={14} /> Aceder à URL Direta
                </a>
                <span className="text-[10px] font-mono text-purple-400">Angola</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ação de Cruzamento */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleCrossData}
          disabled={selected.length === 0 || crossing}
          className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl flex items-center gap-3 transition-all duration-300 active:scale-95 shadow-lg shadow-purple-500/20 disabled:opacity-40 disabled:pointer-events-none"
        >
          {crossing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
              Cruzando Fontes de Angola...
            </>
          ) : (
            <>
              <BsShuffle size={18} />
              Cruzar Fontes Mapeadas
            </>
          )}
        </button>
      </div>

      {/* Resultados do Cruzamento com Gráficos */}
      {crossedData && crossedData.length > 0 && (
        <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
          <div className="flex items-center gap-3">
            <BsDatabaseCheck className="text-purple-400" size={20} />
            <h4 className="text-white font-bold">Resumo Analítico do Cruzamento de Fontes</h4>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visualização em Gráficos (Barras e Circular) */}
            <div className="space-y-4">
              <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <BsFileBarGraph /> Gráficos de Indicadores & Telecomunicações
              </h5>
              
              <div className="space-y-4">
                {/* Gráfico de Barras: Inclusão Digital */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Inclusão Digital vs. População Ativa (INE + INACOM)</span>
                    <span className="text-cyan-400 font-mono font-bold">64.5%</span>
                  </div>
                  <div className="relative w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: '64.5%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0%</span>
                    <span>Meta Nacional: 75%</span>
                    <span>100%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Correlaciona a estimativa populacional de 37 milhões (INE) com os 16.5 milhões de assinantes móveis ativos (INACOM).
                  </p>
                </div>

                {/* Gráfico de Barras: Torres de Sinal */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Torres de Sinal por Cobertura (OpenCelliD + OSM)</span>
                    <span className="text-purple-400 font-mono font-bold">78.2%</span>
                  </div>
                  <div className="relative w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: '78.2%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0%</span>
                    <span>12.450 ERBs / 18 Províncias</span>
                    <span>100%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Mapeia a densidade de ERBs ativas nas principais províncias e eixos rodoviários federais integrados no OpenStreetMap.
                  </p>
                </div>

                {/* Gráfico Circular / Donut Customizado: Acesso a Infraestruturas */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="text-xs font-medium text-slate-300">Acesso a Infraestruturas Básicas</div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      O acesso a energia constitui um fator crítico para a expansão de cobertura e inclusão digital nas regiões semi-urbanas e rurais (Banco Mundial).
                    </div>
                  </div>
                  {/* Gráfico Donut em SVG */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-slate-950"
                        fill="transparent"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-amber-400 transition-all duration-1000"
                        fill="transparent"
                        strokeDasharray={201}
                        strokeDashoffset={201 - (201 * 46.8) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-bold font-mono text-amber-400">46.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalhes de Cada Fonte Integrada */}
            <div className="space-y-4">
              <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <BsBarChartSteps /> Metadados das APIs
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/15 text-slate-400">
                      <th className="py-2">Fonte</th>
                      <th className="py-2">URL da Fonte</th>
                      <th className="py-2">Métricas Cruzadas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crossedData.map((item, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 font-semibold text-white">{item.fonte}</td>
                        <td className="py-3">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                          >
                            {item.url} <BsArrowRight size={10} />
                          </a>
                        </td>
                        <td className="py-3">
                          <div className="text-[11px] text-slate-300 font-mono space-y-0.5">
                            {Object.entries(item.indicadores || {}).map(([key, val]) => (
                              <div key={key}>
                                <span className="text-slate-500">{key.replace(/_/g, ' ')}:</span> {String(val)}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}