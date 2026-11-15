/**
 * Domain types and API response interfaces for BodegaCore Asset Management.
 */

export type AssetStatus = 'DISPONIBLE' | 'ASIGNADO' | 'EN_MANTENIMIENTO' | 'DE_BAJA';

export type AssetCategory = 'COMPUTO' | 'HERRAMIENTAS' | 'REDES_TI' | 'MAQUINARIA_LIVIANA';

export interface Custodian {
  id: number;
  fullName: string;
  department: string;
  email: string;
  assignedAssetsCount?: number;
}

export interface MaintenanceRecommendation {
  assetId: number;
  assetTag: string;
  name: string;
  category: AssetCategory;
  lastInspectionDate: string;
  daysSinceInspection: number;
  reason: string;
  severity: 'WARNING' | 'CRITICAL';
}

export interface Asset {
  id: number;
  assetTag: string;
  name: string;
  category: AssetCategory;
  brand: string;
  model: string;
  serialNumber: string;
  warehouseLocation: string;
  acquisitionCost: number;
  purchaseDate: string;
  lastInspectionDate: string;
  status: AssetStatus;
  custodian?: Custodian | null;
  serviceProvider?: string | null;
  maintenanceReason?: string | null;
  isOlderThan90Days?: boolean;
  recommendedMaintenance?: boolean;
  daysSinceInspection?: number;
}

export interface DashboardMetrics {
  totalAssets: number;
  totalValuation: number;
  availabilityRate: number;
  criticalAssetsCount: number;
  olderThan90DaysCount: number;
  statusDistribution: Record<AssetStatus, number>;
  categoryDistribution: Record<AssetCategory, number>;
  recommendations: MaintenanceRecommendation[];
}

export interface AssetFilterState {
  category: AssetCategory | 'ALL';
  status: AssetStatus | 'ALL';
  criticalOnly: boolean;
  olderThan90DaysOnly: boolean;
  search: string;
}

export interface AssetCreateFormData {
  assetTag: string;
  name: string;
  category: AssetCategory;
  brand: string;
  model: string;
  serialNumber: string;
  warehouseLocation: string;
  acquisitionCost: number;
  purchaseDate: string;
  lastInspectionDate?: string;
}

export interface AssignFormData {
  custodianId: number;
  notes?: string;
}

export interface ReturnFormData {
  warehouseLocation: string;
}

export interface MaintenanceFormData {
  serviceProvider: string;
  reason: string;
}

export interface ReleaseMaintenanceFormData {
  warehouseLocation: string;
  notes?: string;
}
