import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/api/axios-instance";
import { useAuthStore } from "@/store/auth-store";
import { ApiResponse } from "@/types/api";

// --- Query Key Factory ---
export const userStatsKeys = {
  all: ["user-stats"] as const,
};

export interface UserStats {
  totalFiles: number;
  totalFolders: number;
  usedStorage: string;
  maxStorage: string;
  storageUsagePercentage: number;
  planName: string;
  allowedTypes: string[];
}

export const useUserStats = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery<UserStats>({
    queryKey: userStatsKeys.all,
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<UserStats>>("/user/stats");
      return (response as unknown as ApiResponse<UserStats>).data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
