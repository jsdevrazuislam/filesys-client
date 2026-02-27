"use client";
import { FileText, FolderOpen, HardDrive, TrendingUp } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { UsageStats } from "@/features/dashboard/components/usage-stats";
import { useUserStats } from "@/hooks/api/use-user";
import { useAuthStore } from "@/store/auth-store";

export default function UserDashboardClient() {
  const user = useAuthStore((state) => state.user);
  const { data: stats, isLoading } = useUserStats();

  const formatBytes = (bytes: string) => {
    const b = Number(bytes);
    if (b === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return parseFloat((b / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const dashboardStats = [
    {
      label: "Total Files",
      value: stats?.totalFiles.toString() || "0",
      icon: FileText,
    },
    {
      label: "Folders",
      value: stats?.totalFolders.toString() || "0",
      icon: FolderOpen,
    },
    {
      label: "Storage Used",
      value: stats ? formatBytes(stats.usedStorage) : "0 B",
      icon: HardDrive,
    },
    {
      label: "Storage Limit",
      value: stats ? formatBytes(stats.maxStorage) : "0 B",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back, {user?.name || "User"}</p>
      </div>

      {/* Subscription and Usage */}
      <UsageStats />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))
          : dashboardStats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-2xl font-bold">{s.value}</p>
              </div>
            ))}
      </div>
    </div>
  );
}
