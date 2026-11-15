import { request } from "./api";
import type {
  Asset,
  AssetCategory,
  AssetStatus,
  AssetCreateFormData,
  AssignFormData,
  ReturnFormData,
  MaintenanceFormData,
  ReleaseMaintenanceFormData,
  MaintenanceRecommendation,
} from "../types/asset";

export interface AssetFilterParams {
  category?: AssetCategory | 'ALL';
  status?: AssetStatus | 'ALL';
  critical?: boolean;
  olderThan90Days?: boolean;
  search?: string;
}

export const assetService = {
  async getAssets(params: AssetFilterParams = {}): Promise<Asset[]> {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'ALL') {
      query.append("category", params.category);
    }
    if (params.status && params.status !== 'ALL') {
      query.append("status", params.status);
    }
    if (params.critical) {
      query.append("critical", "true");
    }
    if (params.olderThan90Days) {
      query.append("olderThan90Days", "true");
    }
    if (params.search && params.search.trim()) {
      query.append("search", params.search.trim());
    }

    const qs = query.toString();
    const endpoint = `/assets${qs ? `?${qs}` : ""}`;
    return request<Asset[]>(endpoint);
  },

  async getAssetById(id: number): Promise<Asset> {
    return request<Asset>(`/assets/${id}`);
  },

  async createAsset(data: AssetCreateFormData): Promise<Asset> {
    return request<Asset>("/assets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async assignAsset(id: number, data: AssignFormData): Promise<Asset> {
    return request<Asset>(`/assets/${id}/assign`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async returnAsset(id: number, data: ReturnFormData): Promise<Asset> {
    return request<Asset>(`/assets/${id}/return`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async sendToMaintenance(id: number, data: MaintenanceFormData): Promise<Asset> {
    return request<Asset>(`/assets/${id}/maintenance`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async releaseMaintenance(id: number, data: ReleaseMaintenanceFormData): Promise<Asset> {
    return request<Asset>(`/assets/${id}/release-maintenance`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async getRecommendations(): Promise<MaintenanceRecommendation[]> {
    return request<MaintenanceRecommendation[]>("/assets/recommendations");
  },
};
