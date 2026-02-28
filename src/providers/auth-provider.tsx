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
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      setAuth(user, "");
    }
  }, [user, setAuth]);

  const hasSessionHint = Cookies.get("has_session") === "true";
  const publicRoutes = ["/", "/register", "/forgot-password", "/reset-password"];
  const isPublicRoute = publicRoutes.includes(pathname);

  const isVerifying = hasSessionHint && !isAuthenticated && !user && (isLoading || !isFetched);

  if (isVerifying && !isPublicRoute) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-foreground">Verifying session...</p>
            <p className="text-xs text-muted-foreground">Please wait a moment</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
