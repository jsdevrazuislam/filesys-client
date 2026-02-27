"use client";

import React from "react";

import { useAuthState } from "@/hooks/use-auth-state";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: ("ADMIN" | "USER")[];
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * RoleGuard component for defensive rendering.
 * Wraps content that should only be visible to specific roles or authenticated users.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback = null,
  requireAuth = true,
}) => {
  const { isAuthenticated, hasRole } = useAuthState();

  // 1. Check authentication if required
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // 2. Check roles if restricted
  if (allowedRoles && allowedRoles.length > 0) {
    const canAccess = allowedRoles.some((role) => hasRole(role));
    if (!canAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

/**
 * Shorthand for Admin-only content
 */
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => (
  <RoleGuard allowedRoles={["ADMIN"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

/**
 * Shorthand for User-only content
 */
export const UserOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => (
  <RoleGuard allowedRoles={["USER"]} fallback={fallback}>
    {children}
  </RoleGuard>
);
