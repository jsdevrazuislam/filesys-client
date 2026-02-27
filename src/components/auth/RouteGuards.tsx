"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { useGetCurrentUser } from "@/hooks/api/use-auth";
import { useAuthStore } from "@/store/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated: storeAuthenticated } = useAuthStore();
  const { data: user, isFetched, isLoading } = useGetCurrentUser();
  const router = useRouter();

  // Calculate effective authentication status
  const isAuthenticated = storeAuthenticated || !!user;

  useEffect(() => {
    // 1. Redirect to login if not authenticated
    if (isFetched && !isAuthenticated) {
      router.replace("/");
      return;
    }

    // 2. Redirect to verification notice if authenticated but not verified
    if (isFetched && isAuthenticated && user && !user.isVerified) {
      router.replace("/verify-notice");
    }
  }, [isFetched, isAuthenticated, user, router]);

  // Don't show children while loading or if definitively not authenticated
  if (isLoading || (isFetched && !isAuthenticated)) {
    return null;
  }

  return <>{children}</>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user: storeUser, isAuthenticated: storeAuthenticated } = useAuthStore();
  const { data: queryUser, isFetched, isLoading } = useGetCurrentUser();
  const router = useRouter();

  // Use query data if store hasn't synced yet
  const currentUser = storeUser || queryUser;
  const isAuthenticated = storeAuthenticated || !!queryUser;

  useEffect(() => {
    // Only redirect if revalidation is finished and we are NOT admin
    if (isFetched && isAuthenticated && currentUser && currentUser.role !== "ADMIN") {
      router.replace("/user");
    } else if (isFetched && !isAuthenticated) {
      router.replace("/");
    }
  }, [isFetched, isAuthenticated, currentUser, router]);

  // While revalidating or if not admin, don't show children
  if (isLoading || !isFetched || !isAuthenticated || currentUser?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
