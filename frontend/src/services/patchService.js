import { apiClient } from "./api";
export const patchService = {
    async analyzePatch(videoId, prompt) {
        const response = await apiClient.post(`/videos/${videoId}/patches/analyze`, { prompt });
        return response.data;
    },
    async getPatches(videoId) {
        const response = await apiClient.get(`/videos/${videoId}/patches`);
        return response.data.patches;
    },
    async applyPatch(videoId, patchId) {
        const response = await apiClient.post(`/videos/${videoId}/patches/${patchId}/apply`);
        return response.data;
    },
    async revertPatch(videoId, patchId) {
        const response = await apiClient.post(`/videos/${videoId}/patches/${patchId}/revert`);
        return response.data;
    },
    async getHistory(videoId) {
        const response = await apiClient.get(`/videos/${videoId}/history`);
        return response.data;
    },
};
