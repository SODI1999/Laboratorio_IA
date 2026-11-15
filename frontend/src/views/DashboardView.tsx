import { useState, useEffect, useCallback } from "react";
import { KPISection } from "../components/assets/KPISection";
import { DistributionBar } from "../components/assets/DistributionBar";
import { RecommendationsBanner } from "../components/assets/RecommendationsBanner";
import { SkeletonKPI } from "../components/shared/SkeletonKPI";
import { ErrorAlert } from "../components/shared/ErrorAlert";
import { dashboardService } from "../services/dashboardService";
import type { DashboardMetrics, MaintenanceRecommendation } from "../types/asset";

interface DashboardViewProps {
  onNavigateToCatalog: (filter?: { criticalOnly?: boolean; olderThan90DaysOnly?: boolean }) => void;
  onProgramMaintenance?: (rec: MaintenanceRecommendation) => void;
}

export function DashboardView({ onNavigateToCatalog, onProgramMaintenance }: DashboardViewProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = useCallback((isActive: () => boolean) => {
    void dashboardService
      .getDashboardMetrics()
      .then((data) => {
        if (isActive()) {
          setMetrics(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (isActive()) {
          setError(err instanceof Error ? err.message : "Error al cargar las métricas del tablero.");
        }
      })
      .finally(() => {
        if (isActive()) {
          setLoading(false);
        }
      });
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    loadMetrics(() => true);
  };

  useEffect(() => {
    let active = true;
    loadMetrics(() => active);
    return () => {
      active = false;
    };
  }, [loadMetrics]);

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tablero Ejecutivo de Bodega</h1>
        <p className="text-sm text-slate-500 mt-1">
          Supervisión integral de valorización patrimonial, disponibilidad operativa y estado del parque de activos.
        </p>
      </div>

      {/* Loading state with zero CLS */}
      {loading && <SkeletonKPI />}

      {/* Error state with retry */}
      {error && (
        <ErrorAlert
          title="Fallo al obtener métricas del dashboard"
          message={error}
          onRetry={handleRetry}
        />
      )}

      {/* Ideal state */}
      {!loading && !error && metrics && (
        <div className="space-y-8">
          {/* Recommendations Banner (P06) */}
          <RecommendationsBanner
            recommendations={metrics.recommendations}
            onAction={(rec) => {
              if (onProgramMaintenance) {
                onProgramMaintenance(rec);
              } else {
                onNavigateToCatalog({ olderThan90DaysOnly: true });
              }
            }}
            onViewAll={() => onNavigateToCatalog({ olderThan90DaysOnly: true })}
          />

          {/* KPI Summary Cards */}
          <KPISection
            metrics={metrics}
            onFilterCritical={() => onNavigateToCatalog({ criticalOnly: true })}
            onFilterOlderThan90={() => onNavigateToCatalog({ olderThan90DaysOnly: true })}
          />

          {/* Distribution Progress Bars */}
          <DistributionBar metrics={metrics} />
        </div>
      )}
    </div>
  );
}
