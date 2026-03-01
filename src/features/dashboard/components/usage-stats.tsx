"use client";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStats } from "@/hooks/api/use-user";

export function UsageStats() {
  const { data: stats, isLoading } = useUserStats();

  if (isLoading) return <UsageSkeleton />;
  if (!stats) return null;

  const usedBytes = BigInt(stats.usedStorage);
  const totalBytes = BigInt(stats.maxStorage);

  const usedGB = (Number(usedBytes) / 1024 ** 3).toFixed(1);
  const totalGB = (Number(totalBytes) / 1024 ** 3).toFixed(0);
  const pct = Math.min(stats.storageUsagePercentage, 100);
  const isStorageExceeded = stats.storageUsagePercentage >= 100;

  return (
    <div
      className={`mb-6 rounded-xl border p-5 transition-all ${
        stats.isLimitExceeded
          ? "border-destructive/30 bg-destructive/5 shadow-sm shadow-destructive/10"
          : "border-border bg-card"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Current Plan:</span>
            <span className="gradient-text font-bold uppercase">{stats.planName}</span>
            {stats.isLimitExceeded && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full animate-pulse">
                LIMIT EXCEEDED
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {usedGB} GB of {totalGB} GB used
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Progress
            value={pct}
            className="h-2"
            indicatorClassName={
              isStorageExceeded ? "bg-destructive transition-all" : "bg-primary transition-all"
            }
          />
          <p
            className={`text-[10px] mt-1 text-right font-medium ${isStorageExceeded ? "text-destructive" : "text-muted-foreground"}`}
          >
            {stats.storageUsagePercentage.toFixed(1)}% used
          </p>
        </div>
      </div>
    </div>
  );
}

function UsageSkeleton() {
  return (
    <div className="mb-6 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="w-full sm:w-64 space-y-2">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-12 ml-auto" />
        </div>
      </div>
    </div>
  );
}
