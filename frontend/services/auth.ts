const API_URL = 'http://localhost:8080/api/auth';

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

export async function registerUser(data: RegisterData): Promise<UserResponse> {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Erro ao registrar usuário');
  }

  return response.json();
}