import { API_BASE_URL } from "./api";
export const exportService = {
    getAssetDownloadUrl(videoId, assetType) {
        return `${API_BASE_URL}/api/v1/videos/${videoId}/download/${assetType}`;
    },
    getReportDownloadUrl(videoId, patchId) {
        return `${API_BASE_URL}/api/v1/videos/${videoId}/patches/${patchId}/download/report`;
    },
    downloadAsset(videoId, assetType) {
        const url = this.getAssetDownloadUrl(videoId, assetType);
        window.open(url, "_blank");
    },
    downloadPatchReport(videoId, patchId) {
        const url = this.getReportDownloadUrl(videoId, patchId);
        window.open(url, "_blank");
    },
};
