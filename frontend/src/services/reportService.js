import { apiClient } from "./api";
export const reportService = {
    async getPatchReport(videoId, patchId) {
        const response = await apiClient.get(`/videos/${videoId}/patches/${patchId}/report`);
        return response.data;
    },
};
