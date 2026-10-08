import { authApi, LoginCredentials, RegisterPayload } from "@/lib/api/auth.api";

export * from "@/lib/api/auth.api";

export const authService = {
  async login(payload: LoginCredentials) {
    const res = await authApi.login(payload);
    return res;
  },

  async register(payload: RegisterPayload) {
    const res = await authApi.register(payload);
    return res;
  },

  getCurrentUser() {
    return authApi.getCurrentUser();
  },

  async logout() {
    return authApi.logout();
  },

  async getMe() {
    return authApi.getMe();
  },

  async verifyEmail(email: string, otp: string) {
    return authApi.verifyEmail({ email, otp });
  },

  async resendVerification(email: string) {
    return authApi.resendVerification({ email });
  },
};

export default authService;
