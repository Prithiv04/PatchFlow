import { API_BASE_URL } from "./api";

export type ExportAssetType =
  | "video"
  | "transcript"
  | "captions"
  | "audio"
  | "thumbnail"
  | "package";

export const exportService = {
  getAssetDownloadUrl(videoId: string, assetType: ExportAssetType): string {
    return `${API_BASE_URL}/api/v1/videos/${videoId}/download/${assetType}`;
  },

  getReportDownloadUrl(videoId: string, patchId: string): string {
    return `${API_BASE_URL}/api/v1/videos/${videoId}/patches/${patchId}/download/report`;
  },

  downloadAsset(videoId: string, assetType: ExportAssetType) {
    const url = this.getAssetDownloadUrl(videoId, assetType);
    window.open(url, "_blank");
  },

  downloadPatchReport(videoId: string, patchId: string) {
    const url = this.getReportDownloadUrl(videoId, patchId);
    window.open(url, "_blank");
  },
};
