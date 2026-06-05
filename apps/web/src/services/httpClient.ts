import axios, { AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

/** Error thrown for any non-2xx API response. Carries the HTTP status and a message. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Pre-configured axios instance.
 * - withCredentials: sends/receives the httpOnly auth cookie.
 * - timeout: fails fast instead of hanging on an unreachable API.
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15_000,
});

/** Maps the NestJS error body ({ message: string | string[] }) to an ApiError. */
function toApiError(error: AxiosError<{ message?: string | string[] }>): ApiError {
  const status = error.response?.status ?? 0;
  const raw = error.response?.data?.message;
  const message = Array.isArray(raw) ? raw.join(', ') : (raw ?? error.message);
  return new ApiError(status, message);
}

// Normalise every rejection into an ApiError so callers handle a single type.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => Promise.reject(toApiError(error)),
);

export const httpClient = {
  async get<T>(path: string, params?: object): Promise<T> {
    const { data } = await axiosInstance.get<T>(path, { params });
    return data;
  },
  async post<T>(path: string, body?: unknown): Promise<T> {
    const { data } = await axiosInstance.post<T>(path, body);
    return data;
  },
  async patch<T>(path: string, body?: unknown): Promise<T> {
    const { data } = await axiosInstance.patch<T>(path, body);
    return data;
  },
  async delete<T>(path: string): Promise<T> {
    const { data } = await axiosInstance.delete<T>(path);
    return data;
  },
};
