/**
 * Central API client with error handling and RFC 7807 problem resolution.
 */

const API_BASE_URL = "http://localhost:8080/api";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

function extractErrorMessage(errorData: unknown): string | null {
  if (typeof errorData !== "object" || errorData === null) {
    return null;
  }
  const record = errorData as Record<string, unknown>;
  const candidate = record.detail ?? record.title ?? record.message;
  return typeof candidate === "string" && candidate.trim().length > 0 ? candidate : null;
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorData: unknown = null;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      const errorMessage =
        extractErrorMessage(errorData) ||
        `HTTP Error ${response.status}: ${response.statusText}`;

      throw new ApiError(response.status, errorMessage, errorData);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, "Error de red: no fue posible conectar con el servidor backend en " + API_BASE_URL);
  }
}
