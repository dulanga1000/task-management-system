import api from "./api";
import type { AdminStatsResponse } from "@/types/admin";

export const getAdminStats = async (): Promise<AdminStatsResponse> => {
  const response = await api.get<AdminStatsResponse>("/admin/stats");
  return response.data;
};
