import { request } from "./api";
import type { Custodian, Asset } from "../types/asset";

export const custodianService = {
  async getAllCustodians(): Promise<Custodian[]> {
    return request<Custodian[]>("/custodians");
  },

  async getCustodianAssets(id: number): Promise<Asset[]> {
    return request<Asset[]>(`/custodians/${id}/assets`);
  },
};
