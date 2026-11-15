import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import type { DashboardMetrics } from "../../types/asset";

interface DistributionBarProps {
  metrics: DashboardMetrics;
}

export function DistributionBar({ metrics }: DistributionBarProps) {
  const total = metrics.totalAssets || 1;
  const status = metrics.statusDistribution;
  const categories = metrics.categoryDistribution;

  const disponiblePct = Math.round(((status.DISPONIBLE || 0) / total) * 100);
  const asignadoPct = Math.round(((status.ASIGNADO || 0) / total) * 100);
  const mantenimientoPct = Math.round(((status.EN_MANTENIMIENTO || 0) / total) * 100);
  const bajaPct = Math.round(((status.DE_BAJA || 0) / total) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Status Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Distribución por Estados Operativos</CardTitle>
          <CardDescription>Monitoreo de flujo de inventario en tiempo real</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Segmented bar */}
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
            <div style={{ width: `${disponiblePct}%` }} className="bg-emerald-500 h-full" title={`Disponible: ${disponiblePct}%`} />
            <div style={{ width: `${asignadoPct}%` }} className="bg-blue-500 h-full" title={`Asignado: ${asignadoPct}%`} />
            <div style={{ width: `${mantenimientoPct}%` }} className="bg-amber-500 h-full" title={`Mantenimiento: ${mantenimientoPct}%`} />
            <div style={{ width: `${bajaPct}%` }} className="bg-slate-400 h-full" title={`De Baja: ${bajaPct}%`} />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Disponible: <strong>{status.DISPONIBLE || 0}</strong> ({disponiblePct}%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-600">Asignado: <strong>{status.ASIGNADO || 0}</strong> ({asignadoPct}%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-600">Taller: <strong>{status.EN_MANTENIMIENTO || 0}</strong> ({mantenimientoPct}%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
              <span className="text-slate-600">De Baja: <strong>{status.DE_BAJA || 0}</strong> ({bajaPct}%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Category Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Parque de Activos por Categoría</CardTitle>
          <CardDescription>Composición técnica de los activos almacenados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {[
              { label: "Equipos de Cómputo", key: "COMPUTO", count: categories.COMPUTO || 0, color: "bg-indigo-600" },
              { label: "Herramientas Especializadas", key: "HERRAMIENTAS", count: categories.HERRAMIENTAS || 0, color: "bg-teal-600" },
              { label: "Infraestructura TI y Redes", key: "REDES_TI", count: categories.REDES_TI || 0, color: "bg-sky-600" },
              { label: "Maquinaria Liviana", key: "MAQUINARIA_LIVIANA", count: categories.MAQUINARIA_LIVIANA || 0, color: "bg-orange-600" },
            ].map((cat) => {
              const pct = Math.round((cat.count / total) * 100);
              return (
                <div key={cat.key} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{cat.label}</span>
                    <span className="text-slate-500 font-mono">{cat.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div style={{ width: `${pct}%` }} className={`h-full rounded-full ${cat.color}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
