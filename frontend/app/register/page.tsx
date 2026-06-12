'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  organisation: string;
  country: string;
  role: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  organisation?: string;
  country?: string;
  general?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organisation: '',
    country: '',
    role: 'VIEWER',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.organisation.trim()) {
      newErrors.organisation = 'Organização é obrigatória';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'País é obrigatório';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({}); 

    try {
      // URL do backend Java. Ajuste o endpoint conforme definido na sua Controller (@PostMapping)
      // Comumente o Spring Boot roda na porta 8080
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          organisation: formData.organisation,
          country: formData.country,
          active: true
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Erro ao criar conta';x
        try {
          const errorData = await response.json();
          // Tenta capturar a mensagem de erro vinda do backend (ex: erro de validação ou email duplicado)
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // Caso o backend não retorne JSON em caso de erro
          if (response.status === 409) errorMessage = 'Este email já está cadastrado.';
          if (response.status === 400) errorMessage = 'Dados inválidos. Verifique os campos.';
        }
        throw new Error(errorMessage);
      }

      setSuccess(true);
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push('/login-user');
      }, 2000);
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      console.error('Erro detalhado no cadastro:', {
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
      
      let message = 'Erro ao criar conta. Tente novamente.';
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      if (errorMsg === 'Failed to fetch' || errorMsg.includes('fetch')) {
        message = 'Conexão recusada. Verifique se o servidor HTTPS está ativo e se o certificado é confiável.';
      } else {
        message = errorMsg;
      }

      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="bg-slate-900/90 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl shadow-cyan-500/10 p-10 max-w-md w-full text-center">
          <div className="mb-4 text-cyan-400">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Conta criada com sucesso!
          </h2>
          <p className="text-slate-400 mb-4">
            Você será redirecionado para a página de login em breve...
          </p>
          <Link href="/login-user" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
            Clique aqui se não for redirecionado automaticamente
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4 py-12">
      <div className="bg-slate-900/90 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl shadow-cyan-500/10 p-10 max-w-4xl w-full">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Novo Cadastro</p>
          <h1 className="text-3xl font-semibold text-white mt-4">
          Cadastro
        </h1>
          <p className="text-slate-400 mt-3 text-sm">
          Crie sua conta para começar
        </p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
            <p className="text-rose-200 text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Nome Completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-2xl border bg-slate-950/80 text-slate-100 outline-none transition focus:ring-2 focus:ring-cyan-400/20 ${
                errors.name ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
              }`}
              placeholder="João Silva"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-rose-400 text-xs mt-1 ml-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-2xl border bg-slate-950/80 text-slate-100 outline-none transition focus:ring-2 focus:ring-cyan-400/20 ${
                errors.email ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
              }`}
              placeholder="seu.email@example.com"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-rose-400 text-xs mt-1 ml-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="organisation" className="block text-sm font-medium text-slate-300 mb-2">
              Organização
            </label>
            <input
              id="organisation"
              name="organisation"
              type="text"
              value={formData.organisation}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-2xl border bg-slate-950/80 text-slate-100 outline-none transition focus:ring-2 focus:ring-cyan-400/20 ${
                errors.organisation ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
              }`}
              placeholder="Empresa/Ong"
              disabled={loading}
            />
            {errors.organisation && (
              <p className="text-rose-400 text-xs mt-1 ml-1">{errors.organisation}</p>
            )}
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-slate-300 mb-2">
              País
            </label>
            <input
              id="country"
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-2xl border bg-slate-950/80 text-slate-100 outline-none transition focus:ring-2 focus:ring-cyan-400/20 ${
                errors.country ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
              }`}
              placeholder="Ex: Brasil"
              disabled={loading}
            />
            {errors.country && (
              <p className="text-rose-400 text-xs mt-1 ml-1">{errors.country}</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">
              Tipo de Usuário
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl border border-slate-700 bg-slate-950/80 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 appearance-none"
              disabled={loading}
            >
              <option value="VIEWER" className="bg-slate-900">Visualizador (Viewer)</option>
              <option value="ANALYST" className="bg-slate-900">Analista (Analyst)</option>
              <option value="ADMIN" className="bg-slate-900">Administrador (Admin)</option>
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-2xl border bg-slate-950/80 text-slate-100 outline-none transition focus:ring-2 focus:ring-cyan-400/20 ${
                errors.password ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
              }`}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-rose-400 text-xs mt-1 ml-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-2xl border bg-slate-950/80 text-slate-100 outline-none transition focus:ring-2 focus:ring-cyan-400/20 ${
                errors.confirmPassword ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
              }`}
              placeholder="Confirme sua senha"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="text-rose-400 text-xs mt-1 ml-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 text-slate-950 font-bold py-4 rounded-2xl transition-all duration-200 ease-in-out transform hover:scale-[1.01] active:scale-95 disabled:scale-100 shadow-lg shadow-cyan-500/20 mt-4"
          >
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Já tem uma conta?{' '}
          <Link
            href="/login-user"
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
