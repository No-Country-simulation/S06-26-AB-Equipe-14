'use client';

import { BsRobot, BsSend, BsStars, BsLightningCharge, BsQuestionCircle } from 'react-icons/bs';

export default function AIQueryContent() {
  const suggestions = [
    "Quais regiões tiveram maior aumento na taxa de emprego?",
    "Resuma os projetos ativos em Angola.",
    "Qual a relação entre mentoria e retenção em cursos?",
    "Compare o impacto do Q1 entre as províncias."
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-500">
      {/* Header Centralizado */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 ring-1 ring-cyan-500/30 mb-2">
          <BsRobot size={40} />
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Busca Inteligente</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Utilize inteligência artificial para extrair insights dos dados públicos e métricas sociais de forma instantânea.
        </p>
      </div>

      {/* Chat / Input Container */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-slate-900/80 border border-white/10 p-2 rounded-[2rem] backdrop-blur-2xl shadow-2xl shadow-black/40">
          <div className="flex items-center gap-4 px-4 py-2">
            <BsStars className="text-cyan-400 text-xl shrink-0" />
            <input 
              type="text" 
              placeholder="Pergunte qualquer coisa sobre os indicadores..." 
              className="w-full bg-transparent border-none text-white text-lg outline-none placeholder:text-slate-500 py-4"
            />
            <button 
              aria-label="Enviar pergunta"
              className="p-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20"
            >
              <BsSend size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Sugestões */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-slate-400 px-2">
          <BsLightningCharge className="text-amber-400" />
          <span className="text-sm font-bold uppercase tracking-widest">Sugestões de Consulta</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((text, i) => (
            <button 
              key={i}
              className="text-left p-5 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 hover:bg-slate-800/60 transition-all group"
            >
              <p className="text-slate-300 group-hover:text-white transition-colors flex items-start gap-3">
                <BsQuestionCircle className="mt-1 text-cyan-500/50 group-hover:text-cyan-400 shrink-0" />
                {text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
          <BsLightningCharge />
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          A IA analisa automaticamente tabelas de indicadores, localizações geográficas e relatórios de progresso para fornecer respostas fundamentadas em evidências.
        </p>
      </div>
    </div>
  );
}