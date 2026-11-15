import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-slate-900 text-white shadow hover:bg-slate-800",
        secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
        outline: "text-slate-900 border-slate-300",
        disponible: "border-emerald-200 bg-emerald-50 text-emerald-700",
        asignado: "border-blue-200 bg-blue-50 text-blue-700",
        mantenimiento: "border-amber-200 bg-amber-50 text-amber-700",
        baja: "border-slate-300 bg-slate-100 text-slate-600",
        warning: "border-amber-300 bg-amber-100 text-amber-800",
        critical: "border-rose-300 bg-rose-100 text-rose-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
