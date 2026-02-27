"use client";

import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

import { useGetCurrentUser } from "@/hooks/api/use-auth";
import { useAuthStore } from "@/store/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, isAuthenticated } = useAuthStore();
  const { data: user, isLoading, isFetched } = useGetCurrentUser();

  useEffect(() => {
    if (user) {
      setAuth(user, ""); // token handled by HttpOnly cookies
    }
  }, [user, setAuth]);

  // Initial session verification loader
  const pathname = usePathname();
  const hasSessionHint = Cookies.get("has_session") === "true";
  const publicRoutes = ["/", "/register", "/forgot-password", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (hasSessionHint && isLoading && !isFetched && !isAuthenticated && !isPublicRoute) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
