import { ApiResponse } from "@/types/api";
import { FileItem } from "@/types/files";

import { axiosInstance } from "../axios-instance";

export interface RenameFileDTO {
  name: string;
}

export interface SignedUrlRequestDTO {
  fileName: string;
  fileType: string;
  fileSize: number;
  folderId?: string | null;
}

export interface ConfirmUploadDTO {
  name: string;
  size: number;
  mimeType: string;
  s3Key: string;
  folderId?: string | null;
}

export interface SignedUrlResponse {
  uploadUrl: string;
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  publicId: string;
}

export const fileService = {
  listFiles: async (folderId?: string | null): Promise<FileItem[]> => {
    const response = await axiosInstance.get<ApiResponse<FileItem[]>>("/files", {
      params: { folderId },
    });
    return (response as unknown as ApiResponse<FileItem[]>).data;
  },

  getFile: async (id: string): Promise<FileItem> => {
    const response = await axiosInstance.get<ApiResponse<FileItem>>(`/files/${id}`);
    return (response as unknown as ApiResponse<FileItem>).data;
  },

  renameFile: async (id: string, name: string): Promise<FileItem> => {
    const response = await axiosInstance.patch<ApiResponse<FileItem>>(`/files/${id}`, { name });
    return (response as unknown as ApiResponse<FileItem>).data;
  },

  deleteFile: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/files/${id}`);
  },

  getSignedUrl: async (data: SignedUrlRequestDTO): Promise<SignedUrlResponse> => {
    const response = await axiosInstance.post<ApiResponse<SignedUrlResponse>>(
      "/files/signed-url",
      data
    );
    return (response as unknown as ApiResponse<SignedUrlResponse>).data;
  },

  confirmUpload: async (data: ConfirmUploadDTO): Promise<FileItem> => {
    const response = await axiosInstance.post<ApiResponse<FileItem>>("/files/confirm", data);
    return (response as unknown as ApiResponse<FileItem>).data;
  },

  getFileUrl: async (id: string, action: "view" | "download"): Promise<{ url: string }> => {
    const response = await axiosInstance.get<ApiResponse<{ url: string }>>(
      `/files/${id}/${action}`
    );
    return (response as unknown as ApiResponse<{ url: string }>).data;
  },
};
