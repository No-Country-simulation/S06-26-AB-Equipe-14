'use client';

import { BsMap, BsSearch, BsLayers, BsGeoAlt, BsFilter } from 'react-icons/bs';

export default function MapContent() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Mapa de Iniciativas</h1>
          <p className="text-slate-400 mt-2">Visualize a distribuição geográfica de projetos e indicadores sociais.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Pesquisar região..." 
              className="bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-500/50 transition-all w-64"
            />
          </div>
          <button 
            aria-label="Filtrar resultados"
            className="p-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <BsFilter size={20} />
          </button>
        </div>
      </div>

      {/* Container do Mapa */}
      <div className="relative bg-slate-900/50 border border-white/10 rounded-3xl backdrop-blur-xl h-[600px] overflow-hidden shadow-xl shadow-black/20 group">
        <div className="absolute inset-0 border-2 border-dashed border-slate-800 m-8 rounded-2xl flex flex-col items-center justify-center transition-colors group-hover:border-slate-700">
           <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-400 mb-4">
             <BsMap size={40} />
           </div>
           <h3 className="text-xl font-semibold text-white">Visualização Geográfica</h3>
           <p className="text-slate-500 text-sm mt-2 max-w-xs text-center">
             Integrando API de Mapas... Aqui será renderizado o mapa interativo com os clusters de dados.
           </p>
        </div>

        {/* Controles de Mapa Overlay */}
        <div className="absolute top-6 right-6 flex flex-col gap-2">
          <button 
            aria-label="Alternar camadas"
            className="p-3 bg-slate-950/80 border border-white/10 rounded-2xl text-white hover:bg-slate-900 transition-all shadow-lg backdrop-blur-md"
          >
            <BsLayers />
          </button>
          <button 
            aria-label="Minha localização"
            className="p-3 bg-slate-950/80 border border-white/10 rounded-2xl text-white hover:bg-slate-900 transition-all shadow-lg backdrop-blur-md"
          >
            <BsGeoAlt />
          </button>
        </div>

        {/* Legenda Overlay */}
        <div className="absolute bottom-6 left-6 p-4 bg-slate-950/80 border border-white/10 rounded-2xl backdrop-blur-md shadow-lg">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Legenda</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
              <span>Projetos Ativos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}