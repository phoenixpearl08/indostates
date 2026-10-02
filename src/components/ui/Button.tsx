import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "emergency";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  leftIcon,
  rightIcon,
  href,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variantStyles = {
    primary: "bg-hospital-700 hover:bg-hospital-800 text-white shadow-sm focus:ring-hospital-500",
    secondary: "bg-hospital-100 hover:bg-hospital-200 text-hospital-900 focus:ring-hospital-400",
    outline: "border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-hospital-500",
    ghost: "hover:bg-slate-100 text-slate-700 focus:ring-slate-400",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    emergency: "bg-emergency hover:bg-emergency-dark text-white font-bold shadow-md animate-pulse focus:ring-red-600",
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
  };

  const combinedClass = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  if (href) {
    return (
      <Link href={href} className={combinedClass}>
        {(leftIcon || icon) && <span className="inline-flex shrink-0">{leftIcon || icon}</span>}
        {children}
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </Link>
    );
  }

  return (
    <button className={combinedClass} {...props}>
      {(leftIcon || icon) && <span className="inline-flex shrink-0">{leftIcon || icon}</span>}
      {children}
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
