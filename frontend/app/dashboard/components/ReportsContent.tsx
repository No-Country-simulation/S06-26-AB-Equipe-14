'use client';

import { BsFileBarGraph, BsDownload, BsFilter, BsSearch, BsArrowRightShort } from 'react-icons/bs';

export default function ReportsContent() {
  const reports = [
    { id: 1, title: 'Impacto Regional - Q1 2024', date: '12/05/2024', type: 'PDF', status: 'Concluído' },
    { id: 2, title: 'Crescimento de Mentoria', date: '10/05/2024', type: 'XLSX', status: 'Concluído' },
    { id: 3, title: 'Taxa de Empregabilidade Mensal', date: '05/05/2024', type: 'PDF', status: 'Processando' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Centro de Relatórios</h1>
          <p className="text-slate-400 mt-2">Gere e analise dados detalhados sobre as iniciativas sociais.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20">
            <BsFileBarGraph /> Novo Relatório
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar por nome do relatório..." 
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-slate-900/50 border border-white/10 rounded-2xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
          <BsFilter size={18} /> Filtros Avançados
        </button>
      </div>

      {/* Tabela de Relatórios */}
      <div className="bg-slate-900/50 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Relatório</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reports.map((report) => (
                <tr key={report.id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <BsFileBarGraph size={18} />
                      </div>
                      <span className="text-sm font-semibold text-white">{report.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400">{report.date}</td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-white/5">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${report.status === 'Concluído' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      <span className="text-sm text-slate-300">{report.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      aria-label="Baixar relatório"
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"
                    >
                      <BsDownload size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}