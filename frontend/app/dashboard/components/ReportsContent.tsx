'use client';

import { 
  BsFileBarGraph, 
  BsDownload, 
  BsFilter, 
  BsSearch, 
  BsFileEarmarkPdf, 
  BsFileEarmarkSpreadsheet, 
  BsCheck2Circle, 
  BsClockHistory,
  BsPlusLg,
  BsTrash
} from 'react-icons/bs';

export default function ReportsContent() {
  const reports = [
    { id: 1, title: 'Impacto Regional - Q1 2024', date: '12/05/2024', size: '2.4 MB', type: 'PDF', status: 'Concluído' },
    { id: 2, title: 'Crescimento de Mentoria', date: '10/05/2024', size: '1.1 MB', type: 'XLSX', status: 'Concluído' },
    { id: 3, title: 'Taxa de Empregabilidade Mensal', date: '05/05/2024', size: '0.8 MB', type: 'PDF', status: 'Processando' },
    { id: 4, title: 'Relatório de Saúde Mental', date: '02/05/2024', size: '4.2 MB', type: 'PDF', status: 'Concluído' },
  ];

  const stats = [
    { label: 'Total Gerado', value: '128', icon: <BsFileBarGraph />, color: 'text-blue-400' },
    { label: 'Concluídos', value: '124', icon: <BsCheck2Circle />, color: 'text-emerald-400' },
    { label: 'Em Fila', value: '4', icon: <BsClockHistory />, color: 'text-amber-400' },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Centro de Relatórios</h1>
          <p className="text-slate-400 mt-1">Gere e analise dados detalhados sobre as iniciativas sociais.</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-95">
          <BsPlusLg strokeWidth={1} /> Novo Relatório
        </button>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl backdrop-blur-md flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative group">
          <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por nome do relatório..." 
            className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <button className="px-6 py-3.5 flex items-center justify-center gap-2 bg-slate-900/60 border border-white/10 rounded-2xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all font-semibold text-sm">
          <BsFilter size={18} /> Filtros Avançados
        </button>
      </div>

      {/* Tabela de Relatórios */}
      <div className="bg-slate-900/50 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Documento</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden sm:table-cell">Data de Emissão</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tamanho/Tipo</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reports.map((report) => (
                <tr key={report.id} className="group hover:bg-white/[0.02] transition-colors cursor-default">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${report.type === 'PDF' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {report.type === 'PDF' ? <BsFileEarmarkPdf size={20} /> : <BsFileEarmarkSpreadsheet size={20} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{report.title}</span>
                        <span className="text-[10px] text-slate-500 font-medium sm:hidden">{report.date}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400 font-medium hidden sm:table-cell">{report.date}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-300 font-bold">{report.size}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-tighter font-black">{report.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                      report.status === 'Concluído' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${report.status === 'Concluído' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      {report.status}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button aria-label="Baixar relatório" className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all">
                        <BsDownload size={18} />
                      </button>
                      <button aria-label="Eliminar relatório" className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all">
                        <BsTrash size={18} />
                      </button>
                    </div>
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