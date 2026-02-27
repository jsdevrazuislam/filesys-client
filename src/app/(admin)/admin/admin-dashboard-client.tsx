"use client";

import { formatDistanceToNow } from "date-fns";
import { DollarSign, HardDrive, Package, Users } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/hooks/api/use-admin";

export default function AdminDashboardClient() {
  const { data: stats, isLoading, error } = useAdminStats();

  const formatStorage = (bytes: string) => {
    const b = BigInt(bytes);
    if (b === BigInt(0)) return "0 B";
    const k = BigInt(1024);
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(Number(b)) / Math.log(Number(k)));
    return (Number(b) / Math.pow(Number(k), i)).toFixed(2) + " " + sizes[i];
  };

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/10 rounded-xl border border-destructive/20 mt-10 mx-auto max-w-2xl">
        <p className="text-destructive font-medium">Failed to load admin dashboard stats</p>
        <p className="text-sm text-destructive/80 mt-1">
          {(error as Error).message || "Please check your permissions and try again."}
        </p>
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-blue-500" },
    {
      label: "Active Subscriptions",
      value: stats?.activeSubscriptions ?? 0,
      icon: Package,
      color: "text-emerald-500",
    },
    {
      label: "Total Revenue",
      value: `$${stats?.totalRevenue ?? 0}`,
      icon: DollarSign,
      color: "text-amber-500",
    },
    {
      label: "Storage Used",
      value: stats ? formatStorage(stats.totalStorageUsage) : "0 B",
      icon: HardDrive,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">System-wide platform overview</p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))
          : statCards.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card p-4 sm:p-5 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="mt-2 text-xl sm:text-2xl font-bold tracking-tight">{stat.value}</p>
              </div>
            ))}
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-4">Recent System Activity</h2>
          {isLoading ? (
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-2 w-1/4" />
                    </div>
                  </div>
                ))}
            </div>
          ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-1 border-b border-border last:border-0 pb-3 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {activity.type === "USER_REGISTRATION" ? "UR" : "AC"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {activity.type.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0 ml-2 font-mono">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground text-center">No recent activity found</p>
            </div>
          )}
        </div>

        {/* System Health */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6 h-fit">
          <h2 className="text-base sm:text-lg font-semibold mb-4">System Health</h2>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium capitalize">
                  {stats?.systemHealth || "Healthy"}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">Service Availability</p>
              <div className="space-y-3">
                {["API Server", "PostgreSQL DB", "Cloudinary Storage", "Stripe Payments"].map(
                  (service) => (
                    <div key={service} className="flex items-center justify-between">
                      <span className="text-[11px] font-medium">{service}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold uppercase tracking-tighter">
                        UP
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
