import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ConfirmUploadDTO, fileService } from "@/lib/api/services/file-service";
import { CreateFolderDTO, folderService } from "@/lib/api/services/folder-service";
import { useAuthStore } from "@/store/auth-store";
import { FileItem, Folder } from "@/types/files";

import { userStatsKeys } from "./use-user";

// --- Query Key Factory ---
export const fileExplorerKeys = {
  all: ["file-explorer"] as const,
  folders: (parentId?: string | null) =>
    [...fileExplorerKeys.all, "folders", { parentId }] as const,
  files: (folderId?: string | null) => [...fileExplorerKeys.all, "files", { folderId }] as const,
  hierarchy: () => [...fileExplorerKeys.all, "hierarchy"] as const,
};

// --- Folders ---
export const useFolders = (parentId?: string | null) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery<Folder[]>({
    queryKey: fileExplorerKeys.folders(parentId),
    queryFn: () => folderService.listFolders(parentId),
    enabled: isAuthenticated,
  });
};

export const useFoldersHierarchy = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery<Folder[]>({
    queryKey: fileExplorerKeys.hierarchy(),
    queryFn: () => folderService.getHierarchy(),
    enabled: isAuthenticated,
  });
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation<Folder, { message: string }, CreateFolderDTO>({
    mutationFn: folderService.createFolder,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: fileExplorerKeys.folders(variables.parentId) });
      queryClient.invalidateQueries({ queryKey: fileExplorerKeys.hierarchy() });
      queryClient.invalidateQueries({ queryKey: userStatsKeys.all });
      toast.success("Folder created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create folder");
    },
  });
};

export const useRenameFolder = () => {
  const queryClient = useQueryClient();

  return useMutation<Folder, { message: string }, { id: string; name: string }>({
    mutationFn: ({ id, name }) => folderService.renameFolder(id, name),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: fileExplorerKeys.folders(data.parentId) });
      queryClient.invalidateQueries({ queryKey: fileExplorerKeys.hierarchy() });
      toast.success("Folder renamed successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to rename folder");
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation<void, { message: string }, { id: string; parentId?: string | null }>({
    mutationFn: ({ id }) => folderService.deleteFolder(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: fileExplorerKeys.folders(variables.parentId) });
      queryClient.invalidateQueries({ queryKey: fileExplorerKeys.hierarchy() });
      queryClient.invalidateQueries({ queryKey: userStatsKeys.all });
      toast.success("Folder deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete folder");
    },
  });
};

// --- Files ---
export const useFiles = (folderId?: string | null) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery<FileItem[]>({
    queryKey: fileExplorerKeys.files(folderId),
    queryFn: () => fileService.listFiles(folderId),
    enabled: isAuthenticated,
  });
};

export const useRenameFile = () => {
  const queryClient = useQueryClient();

  return useMutation<FileItem, { message: string }, { id: string; name: string }>({
    mutationFn: ({ id, name }) => fileService.renameFile(id, name),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: fileExplorerKeys.files(data.folderId) });
      toast.success("File renamed successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to rename file");
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation<void, { message: string }, { id: string; folderId?: string | null }>({
    mutationFn: ({ id }) => fileService.deleteFile(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: fileExplorerKeys.files(variables.folderId) });
      queryClient.invalidateQueries({ queryKey: userStatsKeys.all });
      toast.success("File deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete file");
    },
  });
};

export const useSignedUrl = () => {
  return useMutation({
    mutationFn: fileService.getSignedUrl,
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to get upload URL");
    },
  });
};

export const useConfirmUpload = () => {
  const queryClient = useQueryClient();

  return useMutation<FileItem, { message: string }, ConfirmUploadDTO>({
    mutationFn: fileService.confirmUpload,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: fileExplorerKeys.files(data.folderId) });
      queryClient.invalidateQueries({ queryKey: userStatsKeys.all });
      toast.success("File uploaded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to confirm upload");
    },
  });
};
