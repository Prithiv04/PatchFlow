import { apiClient } from "./api";
export const uploadService = {
    async uploadVideo(file, onProgress) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiClient.post("/videos/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total && onProgress) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percent);
                }
            },
        });
        return response.data;
    },
};
