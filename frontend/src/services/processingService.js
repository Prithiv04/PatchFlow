import { apiClient } from "./api";
export const processingService = {
    async processVideo(videoId) {
        const response = await apiClient.post(`/videos/${videoId}/process`);
        return response.data;
    },
    async getVideoMetadata(videoId) {
        const response = await apiClient.get(`/videos/${videoId}/metadata`);
        return response.data;
    },
};
