import { Boxes, DollarSign, Activity, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { formatCOP } from "../../lib/utils";
import type { DashboardMetrics } from "../../types/asset";

interface KPISectionProps {
  metrics: DashboardMetrics;
  onFilterCritical?: () => void;
  onFilterOlderThan90?: () => void;
}

export function KPISection({ metrics, onFilterCritical, onFilterOlderThan90 }: KPISectionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Assets */}
      <Card className="border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Activos</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Boxes className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900">{metrics.totalAssets}</div>
            <p className="text-xs text-slate-500 mt-0.5">Parque total registrado en bodega</p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Valuation */}
      <Card className="border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Valorización Inventario</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900">{formatCOP(metrics.totalValuation)}</div>
            <p className="text-xs text-slate-500 mt-0.5">Capital activo bajo custodia</p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Availability Rate */}
      <Card className="border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tasa Disponibilidad</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900">{metrics.availabilityRate}%</div>
            <p className="text-xs text-slate-500 mt-0.5">
              {metrics.statusDistribution.DISPONIBLE || 0} disponibles para entrega
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Critical & Antiquity Alerts */}
      <Card
        onClick={onFilterCritical || onFilterOlderThan90}
        className="border-slate-200 shadow-xs hover:border-amber-300 cursor-pointer transition-colors bg-amber-50/20"
      >
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">Atención Requerida</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-amber-900">
              {metrics.criticalAssetsCount}
            </div>
            <p className="text-xs text-amber-700 mt-0.5">
              {metrics.statusDistribution.EN_MANTENIMIENTO || 0} en taller • {metrics.olderThan90DaysCount || 0} &gt; 90d
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
