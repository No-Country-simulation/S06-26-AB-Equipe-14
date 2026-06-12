"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginUserPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha e-mail e senha para continuar.");
      return;
    }

    // TODO: conectar com a API de autenticação.
    console.log("Login solicitado", { email, password });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-10 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Acesso do usuário</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Entrar na sua conta</h1>
          <p className="mt-3 text-sm text-slate-400">
            Use seu e-mail e senha para acessar o painel do Bit App.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-300" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="seu@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <p className="rounded-2xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          <p>
            Não tem conta?{" "}
            <Link
              href="/register"
              className="font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
