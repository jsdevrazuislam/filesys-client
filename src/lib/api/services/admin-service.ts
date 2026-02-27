import { ApiResponse } from "@/types/api";

import { axiosInstance } from "../axios-instance";

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalStorageUsage: string;
  systemHealth: "healthy" | "degraded" | "down";
  recentActivity: {
    id: string;
    type: string;
    message: string;
    createdAt: string;
  }[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  storageUsage: string;
  planName: string;
}

export interface IPackage {
  id: string;
  name: string;
  price: number;
  maxFolders: number;
  maxNesting: number;
  allowedTypes: string[];
  maxFileSize: string; // BigInt as string
  storageLimit: string; // BigInt as string
  totalFiles: number;
  filesPerFolder: number;
  stripePriceId?: string;
  createdAt: string;
}

export interface AdminUsersResponse {
  data: AdminUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const response = await axiosInstance.get<ApiResponse<AdminStats>>("/admin/stats");
    return (response as unknown as ApiResponse<AdminStats>).data;
  },

  getUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<AdminUsersResponse> => {
    const response = await axiosInstance.get<ApiResponse<AdminUsersResponse>>("/admin/users", {
      params,
    });
    return (response as unknown as ApiResponse<AdminUsersResponse>).data;
  },

  updateUserRole: async (userId: string, role: string): Promise<void> => {
    await axiosInstance.patch(`/admin/users/${userId}/role`, { role });
  },

  deleteUser: async (userId: string): Promise<void> => {
    await axiosInstance.delete(`/admin/users/${userId}`);
  },

  getPackages: async (): Promise<IPackage[]> => {
    const response = await axiosInstance.get<ApiResponse<IPackage[]>>("/packages");
    return (response as unknown as ApiResponse<IPackage[]>).data;
  },

  createPackage: async (data: Partial<IPackage>): Promise<IPackage> => {
    const response = await axiosInstance.post<ApiResponse<IPackage>>("/packages", data);
    return (response as unknown as ApiResponse<IPackage>).data;
  },

  updatePackage: async (id: string, data: Partial<IPackage>): Promise<IPackage> => {
    const response = await axiosInstance.patch<ApiResponse<IPackage>>(`/packages/${id}`, data);
    return (response as unknown as ApiResponse<IPackage>).data;
  },

  deletePackage: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/packages/${id}`);
  },
};
