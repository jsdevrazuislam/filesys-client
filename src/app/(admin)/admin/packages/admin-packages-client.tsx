"use client";

import { Loader2, Package, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { PackageModal } from "@/components/modal/PackageModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminPackages, useDeletePackage } from "@/hooks/api/use-admin";
import { IPackage } from "@/lib/api/services/admin-service";

export default function AdminPackagesClient() {
  const { data: packages, isLoading, error } = useAdminPackages();
  const deleteMutation = useDeletePackage();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<IPackage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fmt = (v: number | string) => {
    if (typeof v === "string") {
      const b = BigInt(v);
      if (b === BigInt(0)) return "0 B";
      const k = BigInt(1024);
      const sizes = ["B", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(Number(b)) / Math.log(Number(k)));
      return (Number(b) / Math.pow(Number(k), i)).toFixed(0) + " " + sizes[i];
    }
    return v === -1 ? "Unlimited" : String(v);
  };

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/10 rounded-xl border border-destructive/20 mt-10 mx-auto max-w-2xl">
        <p className="text-destructive font-medium">Failed to load packages</p>
        <p className="text-sm text-destructive/80 mt-1">
          {(error as Error).message || "Please check your permissions."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subscription Packages</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure plan limits and pricing</p>
        </div>
        <Button
          onClick={() => {
            setEditingPkg(null);
            setModalOpen(true);
          }}
          className="shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> New Package
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Plan Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
                  Folders
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
                  Nesting
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
                  Max File Size
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
                  Storage Limit
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  File Types
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-4">
                        <Skeleton className="h-5 w-24" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-5 w-12" />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Skeleton className="h-5 w-8 mx-auto" />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Skeleton className="h-5 w-8 mx-auto" />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Skeleton className="h-5 w-8 mx-auto" />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Skeleton className="h-5 w-12 mx-auto" />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Skeleton className="h-5 w-12 mx-auto" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-5 w-32" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-8 w-16 ml-auto" />
                      </td>
                    </tr>
                  ))
              ) : packages?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-10 w-10 text-muted-foreground/30" />
                      <p className="text-sm font-medium text-muted-foreground">
                        No subscription packages found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                packages?.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-4 font-bold text-sm">{pkg.name}</td>
                    <td className="px-4 py-4">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 border-emerald-100 font-mono"
                      >
                        ${pkg.price}/mo
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm font-mono text-center">
                      {fmt(pkg.maxFolders)}
                    </td>
                    <td className="px-4 py-4 text-sm font-mono text-center">
                      {fmt(pkg.maxNesting)}
                    </td>
                    <td className="px-4 py-4 text-sm font-mono text-center">
                      {fmt(pkg.maxFileSize)}
                    </td>
                    <td className="px-4 py-4 text-sm font-mono text-center">
                      {pkg.storageLimit ? fmt(pkg.storageLimit) : "Unlimited"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {pkg.allowedTypes.map((t) => (
                          <Badge
                            key={t}
                            variant="outline"
                            className="text-[9px] px-1 py-0 uppercase font-bold tracking-tighter"
                          >
                            {t.split("/")[1]?.toUpperCase() || t}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setEditingPkg(pkg);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteId(pkg.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PackageModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingPkg(null);
        }}
        initialData={editingPkg}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting this package will prevent new users from subscribing to it. Existing
              subscribers might be affected depending on billing logic.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deleteId && deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) })
              }
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Package"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
