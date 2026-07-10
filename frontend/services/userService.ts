// src/services/userService.ts

// Remova o '/api' do final se o seu backend responde diretamente na raiz para algumas rotas
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://s06-26-ab-equipe-14.onrender.com";

export interface UserRequest {
  email: string;
  name: string;
  password: string;
  role?: string;
  organisation?: string;
  country?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  organisation?: string;
  country?: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
    const message = await res.text();
    throw new Error(message || `Erro HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function getHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { ...extra };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const userService = {
  // Se o login funcionar em /users/login, mantemos assim. 
  // Se o login também falhar com 404, mude para `${API_BASE}/auth/login`
  login: (data: LoginRequest): Promise<LoginResponse> =>
    fetch(`${API_BASE}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse<LoginResponse>),

  // ✨ CORRIGIDO: Removido o '/api' desta rota específica para casar com o endpoint do seu backend
  create: (data: UserRequest): Promise<UserResponse> =>
    fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse<UserResponse>),

  // Rotas administrativas (Geralmente protegidas sob o prefixo /api)
  findAll: (): Promise<UserResponse[]> =>
    fetch(`${API_BASE}/api/users`, { headers: getHeaders() }).then(handleResponse<UserResponse[]>),

  findById: (id: number): Promise<UserResponse> =>
    fetch(`${API_BASE}/api/users/${id}`, { headers: getHeaders() }).then(handleResponse<UserResponse>),

  update: (id: number, data: Partial<UserRequest>): Promise<UserResponse> =>
    fetch(`${API_BASE}/api/users/${id}`, {
      method: "PUT",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(handleResponse<UserResponse>),

  deactivate: (id: number): Promise<void> =>
    fetch(`${API_BASE}/api/users/${id}/deactivate`, {
      method: "PATCH",
      headers: getHeaders(),
    }).then(async (res) => { 
      if (!res.ok) throw new Error(await res.text() || `Erro HTTP ${res.status}`); 
    }),

  delete: (id: number): Promise<void> =>
    fetch(`${API_BASE}/api/users/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(async (res) => { 
      if (!res.ok) throw new Error(await res.text() || `Erro HTTP ${res.status}`); 
    }),
};

export default userService;