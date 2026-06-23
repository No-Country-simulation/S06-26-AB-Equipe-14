'use client';

import { useEffect, useState } from 'react';
import {
  BsPeople,
  BsCheckCircle,
  BsPersonPlus,
  BsShieldLock,
  BsExclamationTriangle,
  BsClockHistory,
} from 'react-icons/bs';
import { getDashboardStats, type DashboardStats } from '@/services/dashboardService';

function formatDate(iso?: string): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export default function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getDashboardStats()
      .then((data) => {
        if (!alive) return;
        setStats(data);
        setError(null);
      })
      .catch(() => alive && setError('Não foi possível carregar os dados do servidor.'))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const cards = stats
    ? [
        {
          id: 1,
          label: 'Utilizadores Totais',
          value: stats.totalUsers,
          icon: <BsPeople size={18} />,
          color: 'text-blue-400',
          barColor: 'bg-blue-500',
          glow: 'shadow-blue-500/20',
        },
        {
          id: 2,
          label: 'Utilizadores Ativos',
          value: stats.activeUsers,
          icon: <BsCheckCircle size={18} />,
          color: 'text-emerald-400',
          barColor: 'bg-emerald-500',
          glow: 'shadow-emerald-500/20',
        },
        {
          id: 3,
          label: 'Novos este mês',
          value: stats.newThisMonth,
          icon: <BsPersonPlus size={18} />,
          color: 'text-amber-400',
          barColor: 'bg-amber-500',
          glow: 'shadow-amber-500/20',
        },
        {
          id: 4,
          label: 'Funções (roles)',
          value: stats.byRole.length,
          icon: <BsShieldLock size={18} />,
          color: 'text-purple-400',
          barColor: 'bg-purple-500',
          glow: 'shadow-purple-500/20',
        },
      ]
    : [];

  const maxRole = stats ? Math.max(...stats.byRole.map((r) => r.count), 1) : 1;

  return (
    <div className="px-4 sm:px-8 pb-8 pt-4 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Banner de erro (não bloqueia o resto) */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
          <BsExclamationTriangle className="text-amber-400 shrink-0" />
          <p className="text-sm text-amber-200">{error}</p>
        </div>
      )}

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[92px] bg-slate-900/50 border border-white/10 rounded-xl animate-pulse"
              />
            ))
          : cards.map((stat) => (
              <div
                key={stat.id}
                className={`relative group overflow-hidden bg-slate-900/50 border border-white/20 p-4 rounded-xl backdrop-blur-xl transition-all hover:bg-slate-800/60 hover:border-white/30 shadow-xl ${stat.glow}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg bg-white/5 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <p className="text-slate-400 text-[0.65rem] font-medium tracking-wide uppercase">{stat.label}</p>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">{stat.value}</h3>
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.barColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
              </div>
            ))}
      </div>

      {/* Gráfico (por função) + Atividades recentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Distribuição por função */}
        <div className="md:col-span-2 bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
          <h4 className="text-white font-semibold mb-1">Distribuição por Função</h4>
          <p className="text-xs text-slate-500 mb-5">Utilizadores agrupados por role</p>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 bg-slate-800/60 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : stats && stats.byRole.length > 0 ? (
            <div className="space-y-4">
              {stats.byRole.map((r) => (
                <div key={r.role} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium uppercase tracking-wide">{r.role}</span>
                    <span className="text-slate-500 font-mono">{r.count}</span>
                  </div>
                  <div className="h-2.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                      style={{ width: `${(r.count / maxRole) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic text-sm">Sem dados de utilizadores.</p>
          )}
        </div>

        {/* Atividades recentes (últimos cadastros) */}
        <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-2 mb-5">
            <BsClockHistory className="text-cyan-400" />
            <h4 className="text-white font-semibold">Atividade Recente</h4>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-slate-800/60 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : stats && stats.recentUsers.length > 0 ? (
            <ul className="space-y-3">
              {stats.recentUsers.map((u) => (
                <li key={u.id} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-1 ring-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-xs shrink-0">
                    {u.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-200 truncate">{u.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono shrink-0">{formatDate(u.createdAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 italic text-sm">Sem atividade recente.</p>
          )}
        </div>
      </div>
    </div>
  );
}
