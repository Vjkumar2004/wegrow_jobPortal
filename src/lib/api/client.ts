import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

// Primary API URL configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api/v1";

// Storage keys
export const ACCESS_TOKEN_KEY = "auth_token";
export const REFRESH_TOKEN_KEY = "auth_refresh_token";
export const AUTH_USER_KEY = "auth_user";

// Custom error structure
export interface ApiErrorResponse {
  success: boolean;
  message: string;
  error?: {
    code?: string;
    details?: unknown;
  };
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Single-flight refresh token queue state
let isRefreshing = false;
let isLoggedOut = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Helper to get token from storage or cookies
export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const local = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (local) return local;
  const session = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  if (session) return session;
  const cookieMatch = document.cookie.match(new RegExp(`(?:^|; )${ACCESS_TOKEN_KEY}=([^;]*)`));
  if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
  const tokenMatch = document.cookie.match(/(?:^|; )token=([^;]*)/);
  if (tokenMatch) return decodeURIComponent(tokenMatch[1]);
  return null;
}

// Multi-tab synchronization via storage event
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event: StorageEvent) => {
    if (event.key === ACCESS_TOKEN_KEY) {
      if (!event.newValue) {
        // Logged out in another tab
        delete apiClient.defaults.headers.common["Authorization"];
      } else {
        // Refreshed in another tab
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${event.newValue}`;
      }
    }
  });
}

// Request interceptor: attach Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = getStoredAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor: handle 401 & single-flight refresh, and handle ACCOUNT_SUSPENDED
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    // Handle Active Session Suspension: 403 ACCOUNT_SUSPENDED
    const errData = error.response?.data as { error?: { code?: string }; message?: string } | undefined;
    const isSuspended =
      error.response?.status === 403 &&
      (errData?.error?.code === "ACCOUNT_SUSPENDED" || errData?.message?.toLowerCase().includes("suspended"));

    if (isSuspended) {
      clearAuthTokens();
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith("/hr")) {
          window.location.href = "/hr/login?error=suspended";
        } else if (currentPath.startsWith("/admin")) {
          window.location.href = "/admin/login?error=suspended";
        } else if (currentPath.startsWith("/student")) {
          window.location.href = "/student/login?error=suspended";
        } else {
          window.location.href = "/student/login?error=suspended";
        }
      }
      return Promise.reject(error);
    }

    // If server responded with 401 and we haven't retried this request yet
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/register")
    ) {
      if (typeof window === "undefined") {
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        clearAuthTokens();
        return Promise.reject(error);
      }

      // If tokens were already refreshed while this request was in flight, retry immediately without another refresh call
      const currentToken = getStoredAccessToken();
      const sentToken = originalRequest.headers?.Authorization?.toString().replace(/^Bearer\s+/, "");
      if (currentToken && sentToken && currentToken !== sentToken) {
        originalRequest._retry = true;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${currentToken}`;
        }
        return apiClient(originalRequest);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest._retry = true;
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post<{
          success: boolean;
          message: string;
          data: { tokens: { accessToken: string; refreshToken: string } };
        }>(`${API_BASE_URL}/auth/refresh`, { refreshToken });

        // If user logged out while refresh was in flight, discard token
        if (isLoggedOut) {
          throw new Error("Session was terminated during token refresh");
        }

        const newTokens = response.data?.data?.tokens;
        if (newTokens?.accessToken) {
          // Synchronize ALL storage locations: localStorage, sessionStorage, cookies & default header
          setAuthTokens(newTokens.accessToken, newTokens.refreshToken);

          processQueue(null, newTokens.accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          }
          return apiClient(originalRequest);
        } else {
          throw new Error("No access token in refresh response");
        }
      } catch (refreshErr: any) {
        processQueue(refreshErr, null);

        // DO NOT log out on temporary network errors, server 5xx, or timeouts!
        // Only log out if refresh endpoint explicitly returned 401 (invalid/expired refresh token) or 403 (suspended)
        const status = axios.isAxiosError(refreshErr) ? refreshErr.response?.status : null;
        if (status === 401 || status === 403) {
          clearAuthTokens();
          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            if (currentPath.startsWith("/student") && !currentPath.includes("/login")) {
              window.location.href = "/student/login";
            } else if (currentPath.startsWith("/hr") && !currentPath.includes("/login")) {
              window.location.href = "/hr/login";
            } else if (currentPath.startsWith("/admin") && !currentPath.includes("/login")) {
              window.location.href = "/admin/login";
            }
          }
        } else {
          console.warn("[apiClient] Token refresh failed due to network or server error; session preserved.", refreshErr);
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export function clearAuthTokens() {
  isLoggedOut = true;
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
    // Clear cookies
    document.cookie = `${ACCESS_TOKEN_KEY}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
    document.cookie = `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
  }
  delete apiClient.defaults.headers.common["Authorization"];
}

export function setAuthTokens(accessToken: string, refreshToken?: string) {
  isLoggedOut = false;
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    // Set cookie with 7 days expiration for route protection / middleware
    const maxAge = 7 * 24 * 60 * 60;
    document.cookie = `${ACCESS_TOKEN_KEY}=${encodeURIComponent(accessToken)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
    document.cookie = `token=${encodeURIComponent(accessToken)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  }
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}

export function getErrorMessage(error: unknown, fallback = "An unexpected error occurred."): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.message) return data.message;
    if (error.response?.status === 404) return "The requested resource was not found.";
    if (error.response?.status === 403) return "You do not have permission to perform this action.";
    if (error.response?.status === 401) return "Session expired. Please log in again.";
    if (error.response?.status === 500) return "Server error. Please try again later.";
    if (error.code === "ECONNABORTED") return "Request timeout. Please check your network.";
    if (!error.response) return "Unable to reach server. Please ensure the backend is running.";
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export default apiClient;
