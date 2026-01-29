const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;

if (!API_URL) {
  throw new Error("API_URL não configurada");
}

export const getApiUrl = () => {
  return API_URL;
};

interface FetchOptions extends RequestInit {
  token?: string;
  cache?: "no-store" | "force-cache";
  next?: {
    revalidate?: false | 0 | number;
    tags?: string[];
  };
}

export const apiClient = async <T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "Erro HTTP: ",
    }));
    throw new Error(error.error || "Erro ao processar a resposta da API");
  }

  return response.json();
};
