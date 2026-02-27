"use client";
import { format } from "date-fns";
import { Check, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePackages, useSubscribe, useSubscriptionHistory } from "@/hooks/api/use-packages";
import { useAuthStore } from "@/store/auth-store";

export default function SubscriptionClient() {
  const user = useAuthStore((state) => state.user);
  const { data: packages, isLoading: loadingPkgs } = usePackages();
  const { data: history, isLoading: loadingHistory } = useSubscriptionHistory();
  const { mutate: subscribe, isPending: isSubscribing } = useSubscribe();

  const currentPackageId = user?.subscriptionHistory?.[0]?.packageId;

  if (loadingPkgs) return <SubscriptionSkeleton />;

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your plan and billing</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {packages?.map((pkg) => {
          const isCurrent = pkg.id === currentPackageId;
          const maxFileSizeMB = (Number(BigInt(pkg.maxFileSize)) / (1024 * 1024)).toFixed(0);
          const maxStorageMB = (Number(BigInt(pkg.storageLimit)) / (1024 * 1024)).toFixed(0);
          const features = [
            `${maxStorageMB} MB storage`,
            `${pkg.maxFolders} folders`,
            `${pkg.maxNesting} nested folders`,
            `${pkg.totalFiles} files total`,
            `${maxFileSizeMB} MB max file`,
            `${pkg.filesPerFolder} files per folder`,
            ...pkg.allowedTypes.slice(0, 5).map((t) => t.split("/")[1]?.toUpperCase() || t),
          ];

          return (
            <div
              key={pkg.id}
              className={`relative h-fit rounded-xl border p-5 transition-all flex flex-col ${
                isCurrent
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              {isCurrent && (
                <Badge className="absolute -top-2.5 left-4 gradient-bg text-primary-foreground text-[10px]">
                  Current Plan
                </Badge>
              )}
              <h3 className="font-semibold uppercase tracking-wider">{pkg.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold">${pkg.price}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <ul className="mt-4 space-y-2 grow">
                {features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={isCurrent ? "outline" : "default"}
                className="w-full mt-5"
                disabled={isCurrent || isSubscribing}
                onClick={() => subscribe(pkg.id)}
              >
                {isSubscribing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isCurrent ? (
                  "Current Plan"
                ) : (
                  "Upgrade"
                )}
              </Button>
            </div>
          );
        })}
      </div>

      {/* History */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Subscription History</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Plan
                </th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Start Date
                </th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  End Date
                </th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loadingHistory ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-16" />
                      </td>
                    </tr>
                  ))
              ) : history?.length ? (
                history.map((h) => (
                  <tr key={h.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{h.package.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {format(new Date(h.startDate), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {h.endDate ? format(new Date(h.endDate), "MMM d, yyyy") : "Active"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={h.isActive ? "default" : "secondary"}
                        className="text-[10px] capitalize"
                      >
                        {h.isActive ? "Active" : "Expired"}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No subscription history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SubscriptionSkeleton() {
  return (
    <div className="p-6 lg:p-8">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-64 mb-8" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-xl border p-5 space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-32" />
              <div className="space-y-2">
                {Array(4)
                  .fill(0)
                  .map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
      </div>
    </div>
  );
}
