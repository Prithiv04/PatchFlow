import { apiClient } from "./api";
import { PatchReportData } from "../types/api";

export const reportService = {
  async getPatchReport(
    videoId: string,
    patchId: string
  ): Promise<PatchReportData> {
    const response = await apiClient.get<PatchReportData>(
      `/videos/${videoId}/patches/${patchId}/report`
    );
    return response.data;
  },
};
