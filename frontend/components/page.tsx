'use client';

import { useState } from 'react';
import Link from 'next/link';
import { registerUser } from '@/services/auth';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await registerUser({ name, email, password });
      setMessage(`Sucesso! Usuário ${user.name} criado com ID ${user.id}`);
    } catch (error: any) {
      setMessage(`Erro: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Criar nova conta</h2>
          <p className="mt-2 text-slate-400 text-sm">Entre com seus dados para acessar o MVP</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 ml-1">Nome</label>
            <input type="text" placeholder="Seu nome completo" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 ml-1">E-mail</label>
            <input type="email" placeholder="email@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 ml-1">Senha</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-2xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>
          
          <button type="submit" className="w-full bg-cyan-500 text-slate-950 font-bold py-3 rounded-2xl hover:bg-cyan-400 transition-all active:scale-95 mt-4 shadow-lg shadow-cyan-500/20">
            Cadastrar
          </button>
          
          {message && <p className={`mt-4 text-center text-sm font-medium ${message.includes('Erro') ? 'text-red-400' : 'text-cyan-400'}`}>{message}</p>}
        </form>

        <div className="text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-white transition-colors">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}