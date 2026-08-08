import { apiClient } from "./api";
export const transcriptionService = {
    async transcribeVideo(videoId) {
        const response = await apiClient.post(`/videos/${videoId}/transcribe`);
        return response.data;
    },
    async getTranscript(videoId) {
        const response = await apiClient.get(`/videos/${videoId}/transcript`);
        return response.data;
    },
};
