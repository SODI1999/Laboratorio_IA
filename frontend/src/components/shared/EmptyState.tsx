import { SearchX, PlusCircle, type LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  title = "No se encontraron activos",
  description = "No existen activos registrados que coincidan con los criterios de búsqueda o filtros seleccionados.",
  icon: Icon = SearchX,
  actionLabel = "Restablecer filtros",
  onAction,
  secondaryActionLabel = "Nuevo Activo",
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-4">
        <Icon className="h-7 w-7 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAction && (
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {onSecondaryAction && (
          <Button size="sm" onClick={onSecondaryAction} className="space-x-1.5">
            <PlusCircle className="h-4 w-4" />
            <span>{secondaryActionLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
