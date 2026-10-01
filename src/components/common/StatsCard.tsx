import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendUp,
  subtitle,
  className
}) => {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm transition-all hover:shadow", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {icon && <div className="p-2.5 rounded-lg bg-blue-50 text-[#0756A8]">{icon}</div>}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</span>
        {trend && (
          <span className={cn("text-xs font-semibold", trendUp ? "text-emerald-600" : "text-rose-600")}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
};
