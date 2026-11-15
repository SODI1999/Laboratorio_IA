import { Search, RotateCcw, Wrench, Clock, PlusCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import type { AssetFilterState, AssetCategory, AssetStatus } from "../../types/asset";

interface AssetFiltersProps {
  filters: AssetFilterState;
  onFilterChange: (newFilters: Partial<AssetFilterState>) => void;
  onReset: () => void;
  onNewAsset: () => void;
  totalResults: number;
}

export function AssetFilters({
  filters,
  onFilterChange,
  onReset,
  onNewAsset,
  totalResults,
}: AssetFiltersProps) {
  const hasActiveFilters =
    filters.category !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.criticalOnly ||
    filters.olderThan90DaysOnly ||
    filters.search.trim().length > 0;

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por placa (ej. ACT-001) o denominación..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-9 bg-slate-50/50 border-slate-200 text-sm"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-2">
          <Button onClick={onNewAsset} className="space-x-1.5 whitespace-nowrap">
            <PlusCircle className="h-4 w-4" />
            <span>Nuevo Activo</span>
          </Button>
        </div>
      </div>

      {/* Filter controls row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        {/* Category select */}
        <div className="w-48">
          <Select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value as AssetCategory | 'ALL' })}
            className="text-xs h-8"
          >
            <option value="ALL">Todas las Categorías</option>
            <option value="COMPUTO">Equipos de Cómputo</option>
            <option value="HERRAMIENTAS">Herramientas</option>
            <option value="REDES_TI">Redes y Telecom</option>
            <option value="MAQUINARIA_LIVIANA">Maquinaria Liviana</option>
          </Select>
        </div>

        {/* Status select */}
        <div className="w-40">
          <Select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value as AssetStatus | 'ALL' })}
            className="text-xs h-8"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="DISPONIBLE">Disponible</option>
            <option value="ASIGNADO">Asignado</option>
            <option value="EN_MANTENIMIENTO">En Mantenimiento</option>
            <option value="DE_BAJA">De Baja</option>
          </Select>
        </div>

        {/* P03: Dedicated Critical / Maintenance Toggle */}
        <Button
          size="sm"
          variant={filters.criticalOnly ? "amber" : "outline"}
          onClick={() => onFilterChange({ criticalOnly: !filters.criticalOnly })}
          className="text-xs h-8 space-x-1"
        >
          <Wrench className="h-3.5 w-3.5" />
          <span>Filtro Crítico / Taller (P03)</span>
        </Button>

        {/* P04: Dedicated Antiquity >90 days Toggle */}
        <Button
          size="sm"
          variant={filters.olderThan90DaysOnly ? "default" : "outline"}
          onClick={() => onFilterChange({ olderThan90DaysOnly: !filters.olderThan90DaysOnly })}
          className="text-xs h-8 space-x-1"
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Antigüedad &gt; 90 Días (P04)</span>
        </Button>

        {/* Reset filter button */}
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onReset}
            className="text-xs h-8 text-slate-500 hover:text-slate-900 space-x-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restablecer ({totalResults} resultados)</span>
          </Button>
        )}
      </div>
    </div>
  );
}
