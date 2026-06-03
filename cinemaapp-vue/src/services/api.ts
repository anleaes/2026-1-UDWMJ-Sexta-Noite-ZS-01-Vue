const API_URL = import.meta.env.VITE_API_URL || 'http://10.0.2.2:8000'

type RequestOptions = RequestInit & {
  body?: BodyInit | null
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Erro na requisição')
  }

  if (response.status === 204) {
    return null as T
  }

  return response.json()
}

export const api = {
  get<T>(path: string) {
    return request<T>(path, {
      method: 'GET',
    })
  },

  post<T>(path: string, data: unknown) {
    return request<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  patch<T>(path: string, data: unknown) {
    return request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  delete<T>(path: string) {
    return request<T>(path, {
      method: 'DELETE',
    })
  },

  async login(email: string, senha: string) {
    const body = new URLSearchParams()
    body.append('email', email)
    body.append('senha', senha)

    const response = await fetch(`${API_URL}/usuarios/login/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    if (!response.ok) {
      throw new Error('E-mail ou senha inválidos')
    }

    return response.json()
  },

  async logout() {
    await fetch(`${API_URL}/usuarios/logout/`, {
      method: 'GET',
      credentials: 'include',
    })
  },
}