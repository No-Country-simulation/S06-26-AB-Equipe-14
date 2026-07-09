// src/services/userService.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

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
  // POST /api/users/login
  login: (data: LoginRequest): Promise<LoginResponse> =>
    fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse<LoginResponse>),

  // POST /api/users
  create: (data: UserRequest): Promise<UserResponse> =>
    fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse<UserResponse>),

  findAll: (): Promise<UserResponse[]> =>
    fetch(`${API_BASE}/users`, { headers: getHeaders() }).then(handleResponse<UserResponse[]>),

  findById: (id: number): Promise<UserResponse> =>
    fetch(`${API_BASE}/users/${id}`, { headers: getHeaders() }).then(handleResponse<UserResponse>),

  update: (id: number, data: Partial<UserRequest>): Promise<UserResponse> =>
    fetch(`${API_BASE}/users/${id}`, {
      method: "PUT",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(handleResponse<UserResponse>),

  deactivate: (id: number): Promise<void> =>
    fetch(`${API_BASE}/users/${id}/deactivate`, {
      method: "PATCH",
      headers: getHeaders(),
    }).then(
      (res) => { if (!res.ok) throw new Error(`Erro HTTP ${res.status}`); }
    ),

  delete: (id: number): Promise<void> =>
    fetch(`${API_BASE}/users/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(
      (res) => { if (!res.ok) throw new Error(`Erro HTTP ${res.status}`); }
    ),
};

export default userService;