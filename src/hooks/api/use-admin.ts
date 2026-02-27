import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  adminService,
  AdminStats,
  AdminUsersResponse,
  IPackage,
} from "@/lib/api/services/admin-service";
import { useAuthStore } from "@/store/auth-store";

export const adminKeys = {
  all: ["admin"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
  users: (params: { page?: number; limit?: number; search?: string; role?: string }) =>
    [...adminKeys.all, "users", params] as const,
  packages: () => [...adminKeys.all, "packages"] as const,
};

export const useAdminStats = () => {
  const { user, isAuthenticated } = useAuthStore();

  return useQuery<AdminStats>({
    queryKey: adminKeys.stats(),
    queryFn: () => adminService.getStats(),
    enabled: isAuthenticated && user?.role === "ADMIN",
  });
};

export const useAdminUsers = (params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) => {
  const { user, isAuthenticated } = useAuthStore();

  return useQuery<AdminUsersResponse>({
    queryKey: adminKeys.users(params),
    queryFn: () => adminService.getUsers(params),
    enabled: isAuthenticated && user?.role === "ADMIN",
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      toast.success("User role updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user role");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      toast.success("User deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
};

export const useAdminPackages = () => {
  const { user, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: adminKeys.packages(),
    queryFn: () => adminService.getPackages(),
    enabled: isAuthenticated && user?.role === "ADMIN",
  });
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<IPackage>) => adminService.createPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.packages() });
      toast.success("Package created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create package");
    },
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IPackage> }) =>
      adminService.updatePackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.packages() });
      toast.success("Package updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update package");
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.packages() });
      toast.success("Package deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete package");
    },
  });
};
