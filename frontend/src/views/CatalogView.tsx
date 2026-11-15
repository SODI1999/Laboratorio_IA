import { useState, useEffect, useCallback } from "react";
import { AssetFilters } from "../components/assets/AssetFilters";
import { AssetTable } from "../components/assets/AssetTable";
import { AssetModal, type ModalMode } from "../components/assets/AssetModal";
import { AssetDrawer } from "../components/assets/AssetDrawer";
import { SkeletonTable } from "../components/shared/SkeletonTable";
import { EmptyState } from "../components/shared/EmptyState";
import { ErrorAlert } from "../components/shared/ErrorAlert";
import { assetService } from "../services/assetService";
import { custodianService } from "../services/custodianService";
import type {
  Asset,
  AssetFilterState,
  Custodian,
  AssetCreateFormData,
  AssignFormData,
  ReturnFormData,
  MaintenanceFormData,
  ReleaseMaintenanceFormData,
} from "../types/asset";

interface CatalogViewProps {
  initialFilters?: Partial<AssetFilterState>;
}

export function CatalogView({ initialFilters }: CatalogViewProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<AssetFilterState>({
    category: initialFilters?.category || 'ALL',
    status: initialFilters?.status || 'ALL',
    criticalOnly: initialFilters?.criticalOnly || false,
    olderThan90DaysOnly: initialFilters?.olderThan90DaysOnly || false,
    search: initialFilters?.search || '',
  });

  // Modal and Drawer states
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [activeAsset, setActiveAsset] = useState<Asset | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await assetService.getAssets({
        category: filters.category,
        status: filters.status,
        critical: filters.criticalOnly,
        olderThan90Days: filters.olderThan90DaysOnly,
        search: filters.search,
      });
      setAssets(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar los activos del catálogo.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    let active = true;
    void custodianService
      .getAllCustodians()
      .then((data) => {
        if (active) {
          setCustodians(data);
        }
      })
      .catch(() => {
        // Non-fatal, fallback to empty list
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    void assetService
      .getAssets({
        category: filters.category,
        status: filters.status,
        critical: filters.criticalOnly,
        olderThan90Days: filters.olderThan90DaysOnly,
        search: filters.search,
      })
      .then((data) => {
        if (active) {
          setAssets(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Error al cargar los activos del catálogo.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<AssetFilterState>) => {
    setLoading(true);
    setError(null);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setLoading(true);
    setError(null);
    setFilters({
      category: 'ALL',
      status: 'ALL',
      criticalOnly: false,
      olderThan90DaysOnly: false,
      search: '',
    });
  };

  // Operational modal handlers
  const handleOpenCreate = () => {
    setActiveAsset(null);
    setModalMode('create');
  };

  const handleOpenAssign = (asset: Asset) => {
    setActiveAsset(asset);
    setModalMode('assign');
  };

  const handleOpenReturn = (asset: Asset) => {
    setActiveAsset(asset);
    setModalMode('return');
  };

  const handleOpenMaintenance = (asset: Asset) => {
    setActiveAsset(asset);
    setModalMode('maintenance');
  };

  const handleOpenRelease = (asset: Asset) => {
    setActiveAsset(asset);
    setModalMode('release');
  };

  const handleViewDetails = (asset: Asset) => {
    setActiveAsset(asset);
    setIsDrawerOpen(true);
  };

  // Form submissions
  const handleCreateSubmit = async (data: AssetCreateFormData) => {
    await assetService.createAsset(data);
    setFeedbackMessage(`Activo ${data.assetTag} registrado exitosamente.`);
    await fetchAssets();
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleAssignSubmit = async (id: number, data: AssignFormData) => {
    const updated = await assetService.assignAsset(id, data);
    setFeedbackMessage(`Activo ${updated.assetTag} asignado exitosamente.`);
    await fetchAssets();
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleReturnSubmit = async (id: number, data: ReturnFormData) => {
    const updated = await assetService.returnAsset(id, data);
    setFeedbackMessage(`Activo ${updated.assetTag} retornado a bodega.`);
    await fetchAssets();
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleMaintenanceSubmit = async (id: number, data: MaintenanceFormData) => {
    const updated = await assetService.sendToMaintenance(id, data);
    setFeedbackMessage(`Activo ${updated.assetTag} despachado a taller.`);
    await fetchAssets();
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleReleaseSubmit = async (id: number, data: ReleaseMaintenanceFormData) => {
    const updated = await assetService.releaseMaintenance(id, data);
    setFeedbackMessage(`Activo ${updated.assetTag} liberado de mantenimiento con inspección renovada.`);
    await fetchAssets();
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Catálogo e Inventario de Activos</h1>
        <p className="text-sm text-slate-500 mt-1">
          Gestión de fichas técnicas, filtros desacoplados por estado crítico (P03) y antigüedad (P04), y acciones de custodia.
        </p>
      </div>

      {/* Temporary Success Toast */}
      {feedbackMessage && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-900 shadow-xs animate-in fade-in duration-200">
          ✓ {feedbackMessage}
        </div>
      )}

      {/* Filters Toolbar */}
      <AssetFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onNewAsset={handleOpenCreate}
        totalResults={assets.length}
      />

      {/* Loading state with zero CLS */}
      {loading && <SkeletonTable rows={6} />}

      {/* Error state with retry */}
      {error && !loading && (
        <ErrorAlert
          title="Fallo al consultar el catálogo"
          message={error}
          onRetry={fetchAssets}
        />
      )}

      {/* Empty state */}
      {!loading && !error && assets.length === 0 && (
        <EmptyState
          title="No se encontraron activos para los filtros actuales"
          description="Intente modificar o restablecer los filtros de búsqueda para consultar otros activos."
          actionLabel="Restablecer filtros"
          onAction={handleResetFilters}
          secondaryActionLabel="Registrar nuevo activo"
          onSecondaryAction={handleOpenCreate}
        />
      )}

      {/* Ideal state: Table */}
      {!loading && !error && assets.length > 0 && (
        <AssetTable
          assets={assets}
          onViewDetails={handleViewDetails}
          onAssign={handleOpenAssign}
          onReturn={handleOpenReturn}
          onMaintenance={handleOpenMaintenance}
          onReleaseMaintenance={handleOpenRelease}
        />
      )}

      {/* Central Modal for all operational flows */}
      {modalMode !== null && (
        <AssetModal
          key={`${modalMode}-${activeAsset?.id ?? 'new'}`}
          mode={modalMode}
          asset={activeAsset}
          custodians={custodians}
          open={true}
          onOpenChange={(open) => !open && setModalMode(null)}
          onCreateSubmit={handleCreateSubmit}
          onAssignSubmit={handleAssignSubmit}
          onReturnSubmit={handleReturnSubmit}
          onMaintenanceSubmit={handleMaintenanceSubmit}
          onReleaseSubmit={handleReleaseSubmit}
        />
      )}

      {/* Technical Detail Sheet Drawer */}
      <AssetDrawer
        asset={activeAsset}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onAssign={handleOpenAssign}
        onReturn={handleOpenReturn}
        onMaintenance={handleOpenMaintenance}
        onReleaseMaintenance={handleOpenRelease}
      />
    </div>
  );
}
