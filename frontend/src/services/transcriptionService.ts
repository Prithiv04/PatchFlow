import { apiClient } from "./api";
import { TranscriptResponse } from "../types/api";

export const transcriptionService = {
  async transcribeVideo(videoId: string): Promise<TranscriptResponse> {
    const response = await apiClient.post<TranscriptResponse>(
      `/videos/${videoId}/transcribe`
    );
    return response.data;
  },

  async getTranscript(videoId: string): Promise<TranscriptResponse> {
    const response = await apiClient.get<TranscriptResponse>(
      `/videos/${videoId}/transcript`
    );
    return response.data;
  },
};
