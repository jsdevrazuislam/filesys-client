import { useLogout } from "@/hooks/api/use-auth";
import { useAuthStore } from "@/store/auth-store";

export const useAuthState = () => {
  const { user, token, isAuthenticated } = useAuthStore();
  const logout = useLogout();

  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";

  const hasRole = (role: "ADMIN" | "USER") => {
    return user?.role === role;
  };

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isUser,
    hasRole,
    logout,
  };
};
