import { request } from "./api";
import type { DashboardMetrics } from "../types/asset";

export const dashboardService = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return request<DashboardMetrics>("/dashboard");
  },
};
