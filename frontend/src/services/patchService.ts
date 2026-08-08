import { apiClient } from "./api";
import { HistoryResponse, PatchAnalysisResponse } from "../types/api";

export const patchService = {
  async analyzePatch(
    videoId: string,
    prompt: string
  ): Promise<PatchAnalysisResponse> {
    const response = await apiClient.post<PatchAnalysisResponse>(
      `/videos/${videoId}/patches/analyze`,
      { prompt }
    );
    return response.data;
  },

  async getPatches(videoId: string): Promise<PatchAnalysisResponse[]> {
    const response = await apiClient.get<{
      video_id: string;
      total: number;
      patches: PatchAnalysisResponse[];
    }>(`/videos/${videoId}/patches`);
    return response.data.patches;
  },

  async applyPatch(
    videoId: string,
    patchId: string
  ): Promise<PatchAnalysisResponse> {
    const response = await apiClient.post<PatchAnalysisResponse>(
      `/videos/${videoId}/patches/${patchId}/apply`
    );
    return response.data;
  },

  async revertPatch(
    videoId: string,
    patchId: string
  ): Promise<PatchAnalysisResponse> {
    const response = await apiClient.post<PatchAnalysisResponse>(
      `/videos/${videoId}/patches/${patchId}/revert`
    );
    return response.data;
  },

  async getHistory(videoId: string): Promise<HistoryResponse> {
    const response = await apiClient.get<HistoryResponse>(
      `/videos/${videoId}/history`
    );
    return response.data;
  },
};
