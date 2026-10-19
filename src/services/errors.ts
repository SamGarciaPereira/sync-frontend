import { isAxiosError } from "axios";

interface ApiErrorBody {
  message?: string;
  action?: string;
}

/** Turns an API error ({ message, action }) into a sentence for the user. */
export function getApiErrorMessage(
  err: unknown,
  fallback = "Não foi possível falar com o servidor. Verifique se a API está rodando.",
): string {
  if (isAxiosError<ApiErrorBody>(err)) {
    const data = err.response?.data;
    if (data?.message) {
      return data.action ? `${data.message} ${data.action}` : data.message;
    }
  }
  return fallback;
}
