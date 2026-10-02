import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverEffect = false, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden",
        hoverEffect && "transition-all duration-300 hover:shadow-card hover:-translate-y-1 hover:border-hospital-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={cn("p-6 pb-3 border-b border-slate-100", className)} {...props}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={cn("p-6 pt-3 bg-slate-50/60 border-t border-slate-100", className)} {...props}>
      {children}
    </div>
  );
};
