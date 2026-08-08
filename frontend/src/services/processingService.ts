import { apiClient } from "./api";
import { ProcessingResponse } from "../types/api";

export const processingService = {
  async processVideo(videoId: string): Promise<ProcessingResponse> {
    const response = await apiClient.post<ProcessingResponse>(
      `/videos/${videoId}/process`
    );
    return response.data;
  },

  async getVideoMetadata(videoId: string): Promise<ProcessingResponse> {
    const response = await apiClient.get<ProcessingResponse>(
      `/videos/${videoId}/metadata`
    );
    return response.data;
  },
};
