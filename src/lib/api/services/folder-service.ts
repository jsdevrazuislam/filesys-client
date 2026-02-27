import { ApiResponse } from "@/types/api";
import { Folder } from "@/types/files";

import { axiosInstance } from "../axios-instance";

export interface CreateFolderDTO {
  name: string;
  parentId?: string | null;
}

export interface RenameFolderDTO {
  name: string;
}

export const folderService = {
  listFolders: async (parentId?: string | null): Promise<Folder[]> => {
    const response = await axiosInstance.get<ApiResponse<Folder[]>>("/folders", {
      params: { parentId },
    });
    return (response as unknown as ApiResponse<Folder[]>).data;
  },

  createFolder: async (data: CreateFolderDTO): Promise<Folder> => {
    const response = await axiosInstance.post<ApiResponse<Folder>>("/folders", data);
    return (response as unknown as ApiResponse<Folder>).data;
  },

  renameFolder: async (id: string, name: string): Promise<Folder> => {
    const response = await axiosInstance.patch<ApiResponse<Folder>>(`/folders/${id}`, { name });
    return (response as unknown as ApiResponse<Folder>).data;
  },

  deleteFolder: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/folders/${id}`);
  },

  getHierarchy: async (): Promise<Folder[]> => {
    const response = await axiosInstance.get<ApiResponse<Folder[]>>("/folders/hierarchy");
    return (response as unknown as ApiResponse<Folder[]>).data;
  },
};
