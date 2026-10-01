"use client";

import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "soft";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 h-8 gap-1.5",
      md: "text-sm px-4 py-2 h-10 gap-2",
      lg: "text-base px-6 py-3 h-12 gap-2.5",
    };

    const variantStyles = {
      primary: "bg-[#0756A8] hover:bg-[#06468a] text-white focus:ring-[#0756A8] shadow-sm shadow-[#0756A8]/20",
      secondary: "bg-[#F79400] hover:bg-[#d9740b] text-white focus:ring-[#F79400] shadow-sm shadow-[#F79400]/25 font-semibold",
      outline: "border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-300 bg-white",
      ghost: "hover:bg-slate-100 text-slate-700 focus:ring-slate-200",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
      soft: "bg-[#EBF3FC] text-[#0756A8] hover:bg-[#d8e8fa] focus:ring-[#0756A8]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current fill-none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
