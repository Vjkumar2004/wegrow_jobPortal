import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) => {
  const base = "inline-flex items-center font-medium rounded-full";

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  const variantStyles = {
    primary: "bg-[#EBF3FC] text-[#0756A8] border border-[#0756A8]/20",
    secondary: "bg-[#FEF4E6] text-[#b4530c] border border-[#F79400]/20",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200",
  };

  return (
    <span className={cn(base, sizeStyles[size], variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status.toLowerCase()) {
    case "applied":
    case "pending":
      return <Badge variant="neutral">{status}</Badge>;
    case "under review":
    case "draft":
      return <Badge variant="warning">{status}</Badge>;
    case "shortlisted":
    case "published":
    case "active":
    case "approved":
      return <Badge variant="primary">{status}</Badge>;
    case "interview":
    case "upcoming":
      return <Badge variant="secondary">{status}</Badge>;
    case "selected":
    case "completed":
    case "hired":
      return <Badge variant="success">{status}</Badge>;
    case "rejected":
    case "suspended":
    case "cancelled":
    case "closed":
      return <Badge variant="danger">{status}</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};
