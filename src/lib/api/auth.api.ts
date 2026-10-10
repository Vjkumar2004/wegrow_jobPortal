import apiClient, {
  setAuthTokens,
  clearAuthTokens,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  AUTH_USER_KEY,
  API_BASE_URL,
} from "@/lib/api/client";
import {
  ApiResponse,
  LoginResponseData,
  RegisterResponseData,
  BackendUser,
  BackendAuthTokens,
} from "@/types/api";

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: "STUDENT" | "HR" | "ADMIN";
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  role: "STUDENT" | "HR";
  companyName?: string;
  collegeName?: string;
  phone?: string;
  companyWebsite?: string;
  companyIndustry?: string;
  companyLocation?: string;
  designation?: string;
  companyLogo?: string;
  companySize?: string;
  about?: string;
  tagline?: string;
  culture?: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export const authApi = {
  /**
   * Register user (STUDENT or HR)
   * Backend sets status to PENDING_VERIFICATION and sends OTP email
   */
  async register(payload: RegisterPayload): Promise<ApiResponse<RegisterResponseData>> {
    const body = {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      role: payload.role,
      ...(payload.companyName ? { companyName: payload.companyName.trim() } : {}),
      ...(payload.phone ? { phone: payload.phone.trim() } : {}),
      ...(payload.collegeName ? { collegeName: payload.collegeName.trim() } : {}),
      ...(payload.companyWebsite ? { companyWebsite: payload.companyWebsite.trim() } : {}),
      ...(payload.companyIndustry ? { companyIndustry: payload.companyIndustry.trim() } : {}),
      ...(payload.companyLocation ? { companyLocation: payload.companyLocation.trim() } : {}),
      ...(payload.designation ? { designation: payload.designation.trim() } : {}),
      ...(payload.companyLogo ? { companyLogo: payload.companyLogo } : {}),
      ...(payload.companySize ? { companySize: payload.companySize } : {}),
      ...(payload.about ? { about: payload.about } : {}),
      ...(payload.tagline ? { tagline: payload.tagline } : {}),
      ...(payload.culture ? { culture: payload.culture } : {}),
    };
    const response = await apiClient.post<ApiResponse<RegisterResponseData>>("/auth/register", body);
    return response.data;
  },

  /**
   * Verify email via 6-digit OTP
   */
  async verifyEmail(payload: VerifyEmailPayload): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>("/auth/verify-email", {
      email: payload.email.trim().toLowerCase(),
      otp: payload.otp.trim(),
    });
    return response.data;
  },

  /**
   * Resend 6-digit OTP with 60s cooldown
   */
  async resendVerification(payload: ResendVerificationPayload): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>("/auth/resend-verification", {
      email: payload.email.trim().toLowerCase(),
    });
    return response.data;
  },

  /**
   * Login user with email & password
   */
  async login(payload: LoginCredentials): Promise<ApiResponse<LoginResponseData>> {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>("/auth/login", {
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      ...(payload.role ? { role: payload.role } : {}),
    });

    const data = response.data?.data;
    if (data?.tokens?.accessToken) {
      setAuthTokens(data.tokens.accessToken, data.tokens.refreshToken);
      if (typeof window !== "undefined") {
        const student = data.user?.studentProfile;
        const hr = data.user?.hrProfile;
        const avatarUrl =
          data.user?.avatarUrl ||
          data.user?.avatar ||
          student?.avatarUrl ||
          student?.avatar ||
          student?.photoUrl ||
          hr?.avatarUrl ||
          hr?.avatar ||
          (data.user?.role === "HR" && data.user?.id ? `${API_BASE_URL}/media/hr-avatar/${data.user.id}` : null) ||
          (data.user?.role === "STUDENT" && (student?.id || data.user?.id) ? `${API_BASE_URL}/media/avatar/${student?.id || data.user.id}` : null);

        const userWithRole = {
          ...data.user,
          avatarUrl: avatarUrl || data.user?.avatarUrl,
          avatar: avatarUrl || data.user?.avatar,
          token: data.tokens.accessToken,
        };
        if (userWithRole.hrProfile?.company?.id) {
          userWithRole.hrProfile.company.logoUrl = `${API_BASE_URL}/media/company-logo/${userWithRole.hrProfile.company.id}`;
        }
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userWithRole));
        if (avatarUrl && data.user?.id) {
          if (data.user.role === "STUDENT") {
            localStorage.setItem(`wegrow_student_avatar_${data.user.id}`, avatarUrl);
            localStorage.setItem("wegrow_student_avatar", avatarUrl);
          } else {
            localStorage.setItem(`wegrow_hr_avatar_${data.user.id}`, avatarUrl);
            localStorage.setItem("wegrow_hr_avatar", avatarUrl);
          }
          window.dispatchEvent(new CustomEvent("avatarUpdated", { detail: { avatarUrl } }));
        }
      }
    }

    return response.data;
  },

  /**
   * Single-flight token rotation
   */
  async refresh(refreshToken: string): Promise<ApiResponse<{ tokens: BackendAuthTokens }>> {
    const response = await apiClient.post<ApiResponse<{ tokens: BackendAuthTokens }>>("/auth/refresh", {
      refreshToken,
    });
    const tokens = response.data?.data?.tokens;
    if (tokens?.accessToken) {
      setAuthTokens(tokens.accessToken, tokens.refreshToken);
    }
    return response.data;
  },

  /**
   * Logout user and clear local session
   */
  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<ApiResponse<null>>("/auth/logout");
      clearAuthTokens();
      return response.data;
    } catch {
      clearAuthTokens();
      return { success: true, message: "Logged out locally", data: null };
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getMe(): Promise<ApiResponse<{ user: BackendUser }>> {
    const response = await apiClient.get<ApiResponse<{ user: BackendUser }>>("/auth/me");
    const user = response.data?.data?.user;
    if (user) {
      if (user.hrProfile?.company?.id) {
        user.hrProfile.company.logoUrl = `${API_BASE_URL}/media/company-logo/${user.hrProfile.company.id}`;
      }
      const student = user.studentProfile;
      const hr = user.hrProfile;
      const avatarUrl =
        user.avatarUrl ||
        user.avatar ||
        student?.avatarUrl ||
        student?.avatar ||
        student?.photoUrl ||
        hr?.avatarUrl ||
        hr?.avatar ||
        (user.role === "HR" && user.id ? `${API_BASE_URL}/media/hr-avatar/${user.id}` : null) ||
        (user.role === "STUDENT" && (student?.id || user.id) ? `${API_BASE_URL}/media/avatar/${student?.id || user.id}` : null);

      if (avatarUrl && typeof window !== "undefined") {
        if (user.id) {
          if (user.role === "STUDENT") {
            localStorage.setItem(`wegrow_student_avatar_${user.id}`, avatarUrl);
            localStorage.setItem("wegrow_student_avatar", avatarUrl);
          } else {
            localStorage.setItem(`wegrow_hr_avatar_${user.id}`, avatarUrl);
            localStorage.setItem("wegrow_hr_avatar", avatarUrl);
          }
        }
        const userStr = localStorage.getItem(AUTH_USER_KEY);
        if (userStr) {
          try {
            const parsed = JSON.parse(userStr);
            parsed.avatarUrl = avatarUrl;
            parsed.avatar = avatarUrl;
            if (user.hrProfile) parsed.hrProfile = user.hrProfile;
            if (user.studentProfile) parsed.studentProfile = user.studentProfile;
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(parsed));
          } catch {}
        }
        window.dispatchEvent(new CustomEvent("avatarUpdated", { detail: { avatarUrl } }));
      }
    }
    return response.data;
  },

  /**
   * Helper to inspect currently stored local user
   */
  getCurrentUser(): (BackendUser & { token?: string }) | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr);
      if (user?.hrProfile?.company?.id) {
        user.hrProfile.company.logoUrl = `${API_BASE_URL}/media/company-logo/${user.hrProfile.company.id}`;
      }
      return user;
    } catch {
      return null;
    }
  },
};

export default authApi;
