const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type RequestOptions = RequestInit & {
  body?: BodyInit | null;
};

function getCookie(name: string) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split("=")[1] || "") : "";
}

async function getErrorMessage(response: Response) {
  const text = await response.text();

  if (response.status === 403 && text.includes("CSRF")) {
    return "Verificação CSRF falhou. Adicione http://localhost:5173 em CSRF_TRUSTED_ORIGINS no Django.";
  }

  if (text.includes("<!DOCTYPE html") || text.includes("<html")) {
    return `Erro ${response.status}: o servidor retornou HTML em vez de JSON.`;
  }

  return text || "Erro na requisicao";
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const csrfToken = getCookie("csrftoken");
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.redirected && response.url.includes("/usuarios/login")) {
    throw new Error("Sessao expirada. Faca login novamente.");
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error("O servidor nao retornou JSON para esta rota.");
  }

  return response.json();
}

export const api = {
  get<T>(path: string) {
    return request<T>(path, {
      method: "GET",
    });
  },

  post<T>(path: string, data: unknown) {
    return request<T>(path, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  postForm<T>(path: string, data: FormData) {
    return request<T>(path, {
      method: "POST",
      body: data,
    });
  },

  patch<T>(path: string, data: unknown) {
    return request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  patchForm<T>(path: string, data: FormData) {
    return request<T>(path, {
      method: "PATCH",
      body: data,
    });
  },

  delete<T>(path: string) {
    return request<T>(path, {
      method: "DELETE",
    });
  },

  async login(email: string, senha: string) {
    const body = new URLSearchParams();
    body.append("email", email.trim());
    body.append("senha", senha);

    const response = await fetch(`${API_URL}/usuarios/login/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.detail || "E-mail ou senha invalidos");
    }

    return data;
  },

  async logout() {
    await fetch(`${API_URL}/usuarios/logout/`, {
      method: "GET",
      credentials: "include",
    });
  },
};
