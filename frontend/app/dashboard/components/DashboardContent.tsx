'use client';

import { BsPeople, BsCheckCircle, BsGraphUp, BsMap } from 'react-icons/bs';

export default function DashboardContent() {
  const stats = [
    { label: 'Total de Registos', value: '1,284', icon: <BsPeople />, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'Projetos Ativos', value: '42', icon: <BsCheckCircle />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Taxa de Emprego', value: '68%', icon: <BsGraphUp />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Regiões Cobertas', value: '12', icon: <BsMap />, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Bem-vindo ao Painel</h1>
        <p className="text-slate-400 mt-2">Visão geral dos indicadores e métricas sociais.</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl backdrop-blur-xl hover:border-white/20 transition-all shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} text-xl`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Atualizado</span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholders para Gráficos/Visualizações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 border border-white/10 p-8 rounded-3xl backdrop-blur-xl h-[400px] flex flex-col shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Concentração Populacional</h2>
            <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
          </div>
          <div className="flex-1 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center group hover:border-slate-700 transition-colors">
             <p className="text-slate-500 text-sm font-medium group-hover:text-slate-400">
               [ Placeholder: Gráfico de Séries Temporais ]
             </p>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/10 p-8 rounded-3xl backdrop-blur-xl h-[400px] flex flex-col shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Análise de Impacto Regional</h2>
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          </div>
          <div className="flex-1 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center group hover:border-slate-700 transition-colors">
             <p className="text-slate-500 text-sm font-medium group-hover:text-slate-400">
               [ Placeholder: Mapa de Calor Regional ]
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}