import apiClient from "./api";

export interface LoginCredentials {
  email: string;
  password?: string;
  role: "STUDENT" | "HR" | "ADMIN";
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  role: "STUDENT" | "HR";
  companyName?: string;
  collegeName?: string;
  phone?: string;
}

export const authService = {
  async login(payload: LoginCredentials) {
    try {
      const response = await apiClient.post("/auth/login", payload);
      return response.data;
    } catch {
      // Graceful fallback mock session for standalone frontend development
      const mockUser = {
        id: `user-${Date.now()}`,
        name: payload.role === "STUDENT" ? "Aarav Sharma" : payload.role === "HR" ? "Sneha Roy (HR Lead)" : "System Administrator",
        email: payload.email,
        role: payload.role,
        token: "mock-jwt-token-wegrow-2025"
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(mockUser));
        localStorage.setItem("auth_token", mockUser.token);
      }
      return { success: true, user: mockUser };
    }
  },

  async register(payload: RegisterPayload) {
    try {
      const response = await apiClient.post("/auth/register", payload);
      return response.data;
    } catch {
      const mockUser = {
        id: `user-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        token: "mock-jwt-token-wegrow-2025"
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(mockUser));
        localStorage.setItem("auth_token", mockUser.token);
      }
      return { success: true, user: mockUser };
    }
  },

  getCurrentUser() {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("auth_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
    }
  }
};
