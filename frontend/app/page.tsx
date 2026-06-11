export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-10 lg:px-12">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="inline-flex rounded-full bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-200">
              Bit App</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Visualize dados com mapas, indicadores e insights para projetos sociais.
            </h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Acessar Dashboard
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-slate-500/70 bg-slate-900/80 px-6 py-3 text-sm text-slate-100 transition hover:border-cyan-300 hover:text-white"
            >
              Explorar o MVP
            </a>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">O que você pode fazer aqui</h2>
            <p className="mt-4 max-w-xl text-slate-300 leading-7">
              A nossa página principal agora destaca o objetivo do projeto: conectar dados públicos sobre emprego, saúde mental, mentoria e treinamento com uma interface visual clara.
            </p>
            <ul className="mt-8 grid gap-4 text-slate-200 sm:grid-cols-2">
              <li className="rounded-3xl bg-slate-900/80 p-4">
                <strong className="block text-lg font-semibold text-white">Mapa interativo</strong>
                <span className="text-sm text-slate-400">Visualize regiões, antenas e iniciativas no mapa.</span>
              </li>
              <li className="rounded-3xl bg-slate-900/80 p-4">
                <strong className="block text-lg font-semibold text-white">Indicadores</strong>
                <span className="text-sm text-slate-400">Compare métricas de emprego e saúde mental por região.</span>
              </li>
              <li className="rounded-3xl bg-slate-900/80 p-4">
                <strong className="block text-lg font-semibold text-white">Relatórios rápidos</strong>
                <span className="text-sm text-slate-400">Acesse insights práticos para tomar decisões estratégicas.</span>
              </li>
              <li className="rounded-3xl bg-slate-900/80 p-4">
                <strong className="block text-lg font-semibold text-white">Conexão com dados reais</strong>
                <span className="text-sm text-slate-400">Estrutura pensada para integrar datasets públicos e serviços sociais.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900/70 to-slate-950/90 p-8 shadow-xl shadow-cyan-500/20 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Visent + Bit App</p>
                <h2 className="mt-4 text-3xl font-semibold text-white">Dashboard de dados</h2>
              </div>
              <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                MVP</span>
            </div>
            <div className="mt-8 space-y-6 text-slate-200">
              <div className="rounded-3xl bg-slate-900/80 p-6">
                <p className="text-sm text-cyan-200">Mapa</p>
                <p className="mt-2 text-lg font-semibold">Navegue por regiões e encontre áreas com iniciativas de impacto.</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-6">
                <p className="text-sm text-cyan-200">AI Query</p>
                <p className="mt-2 text-lg font-semibold">Pergunte sobre dados e receba respostas rápidas para apoiar decisões.</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-6">
                <p className="text-sm text-cyan-200">Relatórios</p>
                <p className="mt-2 text-lg font-semibold">Gere resumos de progresso e compare indicadores essenciais.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-center text-sm text-slate-400 shadow-xl shadow-slate-950/20">
          <p>Pronto para começar? Use o botão “Acessar Dashboard” para explorar o MVP do Bit App.</p>
        </footer>
      </main>
    </div>
  );
}
