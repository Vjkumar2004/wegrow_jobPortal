import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { API_BASE_URL, LIVE_API_URL } from "./api/client";

/**
 * Returns the effective base URL for public media proxies.
 * In development, if the local backend (localhost:5000) is down or media proxy is remote,
 * routing media requests through the live production backend ensures images always load.
 */
function getMediaBaseUrl(): string {
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return API_BASE_URL || LIVE_API_URL;
  }
  // When running locally, prefer LIVE_API_URL if API_BASE_URL points to localhost:5000
  if (API_BASE_URL && API_BASE_URL.includes("localhost:5000")) {
    return LIVE_API_URL;
  }
  return API_BASE_URL || LIVE_API_URL;
}

export function getCompanyLogoProxyUrl(companyId: string): string {
  return `${getMediaBaseUrl()}/media/company-logo/${companyId}`;
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  const cleanBase = getMediaBaseUrl().replace(/\/+$/, "");
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
  return `${getMediaBaseUrl()}/media/avatar/${studentId}`;
}

export function getHRAvatarUrl(hrIdOrUserId?: string): string {
  if (!hrIdOrUserId) return "";
  return `${getMediaBaseUrl()}/media/hr-avatar/${hrIdOrUserId}`;
}

export function formatDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "Recently";
  try {
    if (dateInput instanceof Date) {
      if (isNaN(dateInput.getTime())) return "Recently";
      return dateInput.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    const str = String(dateInput).trim();
    if (!str || str.toLowerCase() === "invalid date" || str === "null" || str === "undefined") {
      return "Recently";
    }

    // Handle DD/MM/YYYY or DD-MM-YYYY (e.g., "16/10/2026", "17/10/2026", "16-10-2026")
    const ddmmyyyyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(.*)$/);
    if (ddmmyyyyMatch) {
      const day = parseInt(ddmmyyyyMatch[1], 10);
      const month = parseInt(ddmmyyyyMatch[2], 10) - 1; // 0-indexed month
      const year = parseInt(ddmmyyyyMatch[3], 10);
      const parsed = new Date(year, month, day);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    }

    const d = new Date(str);
    if (isNaN(d.getTime())) {
      return "Recently";
    }

    const formatted = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return formatted && formatted !== "Invalid Date" ? formatted : "Recently";
  } catch {
    return "Recently";
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

/**
 * Builds guaranteed future ISO start and end timestamps for interview scheduling.
 * Handles inputs like "11:30 AM", "2:00 PM", "14:00", "4 PM", or custom text gracefully.
 */
export function buildIsoInterviewTime(dateStr?: string, timeStr?: string): { startIso: string; endIso: string } {
  let hours = 11;
  let minutes = 30;

  if (timeStr) {
    const trimmed = timeStr.trim();
    const matchWithColon = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    const matchSimple = trimmed.match(/^(\d{1,2})\s*(AM|PM)$/i);

    if (matchWithColon) {
      hours = parseInt(matchWithColon[1], 10);
      minutes = parseInt(matchWithColon[2], 10);
      const meridiem = matchWithColon[3]?.toUpperCase();
      if (meridiem === "PM" && hours < 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;
    } else if (matchSimple) {
      hours = parseInt(matchSimple[1], 10);
      minutes = 0;
      const meridiem = matchSimple[2]?.toUpperCase();
      if (meridiem === "PM" && hours < 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;
    }
  }

  let d: Date;
  if (dateStr && dateStr.includes("-")) {
    const [y, m, day] = dateStr.split("-").map(Number);
    d = new Date(y, m - 1, day, hours, minutes, 0, 0);
  } else {
    d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(hours, minutes, 0, 0);
  }

  const now = new Date();
  if (isNaN(d.getTime()) || d.getTime() <= now.getTime() + 15 * 60 * 1000) {
    d = new Date(now.getTime() + 86400000);
    d.setHours(hours, minutes, 0, 0);
    if (d.getTime() <= now.getTime()) {
      d = new Date(now.getTime() + 4 * 3600000);
    }
  }

  const end = new Date(d.getTime() + 60 * 60 * 1000);
  return {
    startIso: d.toISOString(),
    endIso: end.toISOString(),
  };
}

/**
 * Triggers a real browser file download for any URL without opening the browser's PDF viewer.
 * Converts to a local Blob URL (same-origin) so that the HTML5 `download` attribute is strictly respected.
 * If CORS prevents direct blob creation, seamlessly falls back to the server-side proxy route.
 */
export async function downloadFileDirectly(url: string, filename: string): Promise<void> {
  const safeFilename = filename?.trim() || "Resume.pdf";
  const finalFilename = safeFilename.toLowerCase().endsWith(".pdf") ? safeFilename : `${safeFilename}.pdf`;

  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.style.display = "none";
    link.href = blobUrl;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 2000);
  } catch (err) {
    console.warn("Direct blob download failed, attempting proxy route fallback:", err);

    try {
      const proxyUrl = `/api/proxy-download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(finalFilename)}`;
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = proxyUrl;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (fallbackErr) {
      console.error("All direct download strategies failed:", fallbackErr);
      const fallbackLink = document.createElement("a");
      fallbackLink.href = url;
      fallbackLink.download = finalFilename;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    }
  }
}

