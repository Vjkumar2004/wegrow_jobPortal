import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
