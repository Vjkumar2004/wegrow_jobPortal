"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/auth.service";
import { BackendUserRole } from "@/types/api";
import { PageLoader } from "./PageLoader";
import { getStoredAccessToken, ACCESS_TOKEN_KEY } from "@/lib/api/client";
import axios from "axios";

export interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: BackendUserRole[];
  loginRoute?: string;
}

export type AuthState = "INITIALIZING" | "AUTHENTICATED" | "UNAUTHENTICATED";

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  allowedRoles,
  loginRoute,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthState>("INITIALIZING");
  const isCheckingRef = useRef(false);

  const resolveLoginRoute = useCallback(
    (role?: string) => {
      if (loginRoute) return loginRoute;
      if (role === "HR" || pathname.startsWith("/hr")) return "/hr/login";
      if (role === "ADMIN" || pathname.startsWith("/admin")) return "/admin/login";
      return "/student/login";
    },
    [loginRoute, pathname]
  );

  const evaluateAuth = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    const token = getStoredAccessToken();
    const localUser = authService.getCurrentUser();

    // 1. If no token at all, reject immediately
    if (!token) {
      setAuthState("UNAUTHENTICATED");
      isCheckingRef.current = false;
      router.replace(resolveLoginRoute(localUser?.role));
      return;
    }

    // 2. Role pre-check from local state (prevents role mismatch flashes)
    if (localUser && allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(localUser.role)) {
        console.warn(`[AuthGuard] User role ${localUser.role} is not in allowedRoles:`, allowedRoles);
        setAuthState("UNAUTHENTICATED");
        isCheckingRef.current = false;
        router.replace(resolveLoginRoute(localUser.role));
        return;
      }
      // Optimistically activate session to avoid blocking legitimate users on slow networks
      setAuthState("AUTHENTICATED");
    }

    // 3. Verify session validity with backend /api/v1/auth/me
    try {
      const meRes = await authService.getMe();
      const user = meRes.data?.user;

      if (!user) {
        throw new Error("No user in response");
      }

      // Check role authorization against verified server role
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          console.warn(`[AuthGuard] Verified user role ${user.role} not in allowedRoles:`, allowedRoles);
          setAuthState("UNAUTHENTICATED");
          isCheckingRef.current = false;
          router.replace(resolveLoginRoute(user.role));
          return;
        }
      }

      setAuthState("AUTHENTICATED");
    } catch (err: unknown) {
      console.warn("[AuthGuard] Auth verification error:", err);

      const status = axios.isAxiosError(err) ? err.response?.status : null;

      // ONLY log out if the server explicitly confirmed an authentication or suspension rejection (401 / 403)
      if (status === 401 || status === 403) {
        authService.logout();
        setAuthState("UNAUTHENTICATED");
        router.replace(resolveLoginRoute(localUser?.role));
      } else {
        // Network failure, timeout, 500, or temporary server hiccup:
        // DO NOT log the user out if they have a valid local token and allowed role!
        if (localUser && (!allowedRoles || allowedRoles.includes(localUser.role))) {
          console.info("[AuthGuard] Retaining active session despite transient network/server error.");
          setAuthState("AUTHENTICATED");
        } else {
          setAuthState("AUTHENTICATED");
        }
      }
    } finally {
      isCheckingRef.current = false;
    }
  }, [allowedRoles, router, resolveLoginRoute]);

  useEffect(() => {
    // Initial evaluation on mount
    evaluateAuth();

    // Re-verify immediately if page is restored from browser back/forward cache (bfcache)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        evaluateAuth();
      }
    };

    // Cross-tab synchronization: if user logs out in another tab, update state immediately
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ACCESS_TOKEN_KEY && !event.newValue) {
        setAuthState("UNAUTHENTICATED");
        router.replace(resolveLoginRoute());
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("storage", handleStorageChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run on mount only — never re-run and disrupt user on internal route navigation!

  if (authState === "INITIALIZING") {
    return (
      <PageLoader
        label="WeGrow Skill Campus"
        subLabel="Verifying secure authentication..."
        fullScreen={true}
      />
    );
  }

  if (authState === "UNAUTHENTICATED") {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
