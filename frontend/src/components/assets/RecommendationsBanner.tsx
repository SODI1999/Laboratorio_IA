import { AlertTriangle, Wrench, ShieldCheck, ChevronRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { MaintenanceRecommendation } from "../../types/asset";

interface RecommendationsBannerProps {
  recommendations: MaintenanceRecommendation[];
  onAction?: (recommendation: MaintenanceRecommendation) => void;
  onViewAll?: () => void;
}

export function RecommendationsBanner({
  recommendations,
  onAction,
  onViewAll,
}: RecommendationsBannerProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="flex items-center space-x-3 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-900 shadow-xs">
        <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
        <div className="flex-1 text-xs">
          <span className="font-semibold text-emerald-950">Inspecciones al día:</span> Todos los activos operativos cuentan con revisiones técnicas dentro de la ventana de 90 días reglamentaria.
        </div>
      </div>
    );
  }

  const topRec = recommendations[0];

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-amber-950">
                Sugerencias de Mantenimiento Preventivo (P06)
              </span>
              <Badge variant="warning" className="text-[10px]">
                {recommendations.length} {recommendations.length === 1 ? 'Activo' : 'Activos'} Requieren Atención
              </Badge>
            </div>
            <p className="text-xs text-amber-800 mt-1 max-w-2xl leading-relaxed">
              <strong>{topRec.assetTag} ({topRec.name}):</strong> {topRec.reason}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:self-center">
          {onAction && (
            <Button
              size="sm"
              variant="amber"
              onClick={() => onAction(topRec)}
              className="text-xs space-x-1.5 whitespace-nowrap shadow-xs"
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>Programar Mantenimiento</span>
            </Button>
          )}
          {onViewAll && recommendations.length > 1 && (
            <Button
              size="sm"
              variant="outline"
              onClick={onViewAll}
              className="text-xs border-amber-300 bg-white text-amber-900 hover:bg-amber-100/50 space-x-1 whitespace-nowrap"
            >
              <span>Ver todas ({recommendations.length})</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
