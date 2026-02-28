import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { type LoginFormValues } from "@/features/auth/auth-schemas";
import { axiosInstance } from "@/lib/api/axios-instance";
import { useAuthStore } from "@/store/auth-store";
import { ApiResponse } from "@/types/api";
import { AuthResponse, User } from "@/types/auth";

// --- Auth Hooks ---

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginFormValues & { callbackUrl?: string }) => {
      const response = await axiosInstance.post<ApiResponse<AuthResponse>>("/auth/login", data);
      return {
        ...(response as unknown as ApiResponse<AuthResponse>).data,
        callbackUrl: data.callbackUrl,
      };
    },
    onSuccess: async (data: AuthResponse & { callbackUrl?: string }) => {
      setAuth(data.user, data.token);

      // 1. Invalidate and await auth queries
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      Cookies.set("has_session", "true");
      Cookies.set("user_role", data.user.role);
      Cookies.set("access_token", data.token);

      toast.success("Welcome back!");

      // 3. Handle Redirect
      if (data.callbackUrl) {
        router.replace(data.callbackUrl);
      } else if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Invalid email or password");
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      await axiosInstance.post("/auth/register", data);
    },
    onSuccess: () => {
      toast.success("Account created! Please check your email to verify.");
      router.push("/");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to create account");
    },
  });
};

export const useLogout = () => {
  const logoutStore = useAuthStore((state) => state.logout);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/logout");
    },
    onSuccess: () => {
      // 1. Clear session hints BEFORE clearing store or cache
      Cookies.remove("has_session");
      Cookies.remove("user_role");

      // 2. Cancel and remove auth queries synchronously
      queryClient.cancelQueries({ queryKey: ["auth-user"] });
      queryClient.removeQueries({ queryKey: ["auth-user"] });

      // 3. Reset store and redirect
      logoutStore();
      queryClient.clear();
      router.push("/");
      toast.success("Logged out successfully");
    },
    onError: (error: { message: string }) => {
      // Hard logout even on error
      Cookies.remove("has_session");
      Cookies.remove("user_role");
      queryClient.cancelQueries({ queryKey: ["auth-user"] });
      queryClient.removeQueries({ queryKey: ["auth-user"] });
      logoutStore();
      queryClient.clear();
      router.push("/");
      toast.error(error.message || "Logout issues, session cleared locally");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      await axiosInstance.post("/auth/reset-password", { email });
    },
    onSuccess: () => {
      toast.success("Reset instructions sent to your email.");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to send reset instructions");
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { token: string; newPassword: string }) => {
      await axiosInstance.post("/auth/complete-reset-password", data);
    },
    onSuccess: () => {
      toast.success("Password reset successfully. Please log in.");
      router.push("/");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to reset password");
    },
  });
};

export const useVerifyEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (token: string) => {
      await axiosInstance.get(`/auth/verify-email?token=${token}`);
    },
    onSuccess: () => {
      toast.success("Email verified successfully! You can now log in.");
      router.push("/");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Email verification failed");
    },
  });
};

export const useGetCurrentUser = () => {
  const { isAuthenticated, user } = useAuthStore();
  const hasSessionHint = Cookies.get("has_session") === "true";

  return useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<User>>("/auth/me");
      return (response as unknown as ApiResponse<User>).data;
    },
    // Only run if we have a session hint AND (we aren't authenticated yet OR we don't have a user object)
    enabled: hasSessionHint && (!isAuthenticated || !user),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: { status?: number }) => {
      if (error.status === 401) return false;
      return failureCount < 3;
    },
  });
};
