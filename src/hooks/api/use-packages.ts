import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosInstance } from "@/lib/api/axios-instance";
import { useAuthStore } from "@/store/auth-store";
import { ApiResponse } from "@/types/api";
import { Package, Subscription } from "@/types/auth";

export const usePackages = () => {
  return useQuery<Package[]>({
    queryKey: ["packages"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<Package[]>>("/packages");
      return (response as unknown as ApiResponse<Package[]>).data;
    },
  });
};

export const useSubscriptionHistory = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery<Subscription[]>({
    queryKey: ["subscription-history"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<Subscription[]>>("/packages/history");
      return (response as unknown as ApiResponse<Subscription[]>).data;
    },
    enabled: isAuthenticated,
  });
};

export const useSubscribe = () => {
  return useMutation({
    mutationFn: async (packageId: string) => {
      const response = await axiosInstance.post<ApiResponse<{ url: string }>>(
        "/payments/checkout",
        { packageId }
      );
      return (response as unknown as ApiResponse<{ url: string }>).data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to initiate subscription");
    },
  });
};
