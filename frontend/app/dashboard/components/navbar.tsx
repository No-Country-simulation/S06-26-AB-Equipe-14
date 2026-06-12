import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 md:left-64 right-0 z-30 border-b border-slate-800/60 bg-slate-950/95 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-end gap-4 px-6 sm:px-10 lg:px-14">
        <div className="flex items-center gap-3">
          <button className="rounded-full bg-slate-800/90 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700">
            Novo relatório
          </button>
          <div className="flex items-center gap-3 rounded-full border border-slate-800/70 bg-slate-900/90 px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-200 font-semibold">
              U
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Usuário</p>
              <p className="text-xs text-slate-500">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;