import type { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "error" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  pulsing?: boolean;
}

const dotColors: Record<BadgeVariant, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  neutral: "bg-stone-400",
};

const labelColors: Record<BadgeVariant, string> = {
  success: "text-emerald-700",
  warning: "text-amber-700",
  error: "text-red-700",
  neutral: "text-stone-600",
};

export function Badge({ variant = "neutral", children, pulsing = false }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${labelColors[variant]}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} ${pulsing ? "animate-pulse-dot" : ""}`}
      />
      {children}
    </span>
  );
}
