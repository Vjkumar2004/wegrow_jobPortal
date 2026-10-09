import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { API_BASE_URL, LIVE_API_URL, LOCAL_API_URL } from "./api/client";

export function getCompanyLogoProxyUrl(companyId: string): string {
  return `${API_BASE_URL}/media/company-logo/${companyId}`;
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  const cleanBase = (API_BASE_URL || "http://localhost:5000/api/v1").replace(/\/+$/, "");
  if (url.startsWith("/api/v1/")) {
    return `${cleanBase}${url.slice("/api/v1".length)}`;
  }
  if (url.startsWith("/api/")) {
    return `${cleanBase}${url.slice("/api".length)}`;
  }
  return `${cleanBase}/${url.replace(/^\/+/, "")}`;
}

export function getAvatarUrl(studentId?: string): string {
  if (!studentId) return "";
  return `${API_BASE_URL}/media/avatar/${studentId}`;
}

export function getHRAvatarUrl(hrIdOrUserId?: string): string {
  if (!hrIdOrUserId) return "";
  return `${API_BASE_URL}/media/hr-avatar/${hrIdOrUserId}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatSalary(min?: number, max?: number, currency = "₹"): string {
  if (!min && !max) return "Not disclosed";
  if (min && !max) return `${currency}${min.toLocaleString()} / year`;
  if (!min && max) return `Up to ${currency}${max.toLocaleString()} / year`;
  return `${currency}${min?.toLocaleString()} - ${currency}${max?.toLocaleString()} / year`;
}

/**
 * Resolves the company logo image URL.
 * Checks for direct logoUrl/logo first, and falls back to backend media proxy endpoint if companyId is available.
 */
export function getCompanyLogoUrl(
  company?: { id?: string; logo?: string; logoUrl?: string | null } | null,
  fallbackCompanyId?: string
): string {
  if (!company && !fallbackCompanyId) return "";
  const id = company?.id || fallbackCompanyId;
  const logo = company?.logoUrl || company?.logo;

  if (logo && typeof logo === "string" && logo.trim().length > 0) {
    if (logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("/")) {
      return logo;
    }
  }

  if (id) {
    return getCompanyLogoProxyUrl(id);
  }

  return "";
}

/**
 * Extracts first and last name initials (e.g., "Vijayakumar M" -> "VM", "John Doe" -> "JD").
 * If single name (e.g. "Alex"), takes first 2 characters. Fallbacks to "ST".
 */
export function getNameInitials(name?: string): string {
  if (!name || typeof name !== "string") return "ST";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ST";
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

