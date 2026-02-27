"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type PackageFormValues, packageSchema } from "@/features/packages/package-schemas";
import { useCreatePackage, useUpdatePackage } from "@/hooks/api/use-admin";
import { IPackage } from "@/lib/api/services/admin-service";

const fileTypes = [
  { label: "Images", value: "image/jpeg,image/png,image/gif,image/webp" },
  { label: "Videos", value: "video/mp4,video/webm" },
  { label: "PDFs", value: "application/pdf" },
  { label: "Audio", value: "audio/mpeg,audio/wav" },
  { label: "Archives", value: "application/zip,application/x-rar-compressed" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  initialData: IPackage | null;
}

export function PackageModal({ open, onClose, initialData }: Props) {
  const createMutation = useCreatePackage();
  const updateMutation = useUpdatePackage();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: "",
      price: 0,
      stripePriceId: "",
      maxFolders: 10,
      maxNesting: 3,
      allowedTypes: [],
      maxFileSize: 10,
      storageLimit: 1024,
      totalFileLimit: 100,
      filesPerFolder: 50,
    },
  });

  const allowedTypes =
    useWatch({
      control,
      name: "allowedTypes",
    }) || [];

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Convert BigInt strings back to number (MB) for form
        const mbSize = Math.floor(Number(BigInt(initialData.maxFileSize)) / (1024 * 1024));
        const storageMbSize = Math.floor(
          Number(BigInt(initialData.storageLimit || 0)) / (1024 * 1024)
        );
        reset({
          name: initialData.name,
          price: initialData.price,
          stripePriceId: initialData.stripePriceId || "",
          maxFolders: initialData.maxFolders,
          maxNesting: initialData.maxNesting,
          allowedTypes: initialData.allowedTypes,
          maxFileSize: mbSize,
          storageLimit: storageMbSize,
          totalFileLimit: initialData.totalFiles,
          filesPerFolder: initialData.filesPerFolder,
        });
      } else {
        reset({
          name: "",
          price: 0,
          stripePriceId: "",
          maxFolders: 10,
          maxNesting: 3,
          allowedTypes: ["image/jpeg,image/png,image/gif,image/webp"],
          maxFileSize: 10,
          storageLimit: 1024,
          totalFileLimit: 100,
          filesPerFolder: 50,
        });
      }
    }
  }, [initialData, open, reset]);

  const toggleType = (typeValue: string) => {
    const newTypes = allowedTypes.includes(typeValue)
      ? allowedTypes.filter((t) => t !== typeValue)
      : [...allowedTypes, typeValue];
    setValue("allowedTypes", newTypes, { shouldValidate: true });
  };

  const onSubmit = (data: PackageFormValues) => {
    const { totalFileLimit, ...rest } = data;
    const payload = {
      ...rest,
      maxFileSize: data.maxFileSize.toString(),
      storageLimit: data.storageLimit.toString(),
      totalFiles: totalFileLimit, // Map form field to backend field
    };

    if (initialData) {
      updateMutation.mutate(
        { id: initialData.id, data: payload },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onClose(),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {initialData ? "Update" : "Create New"} Package
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Package Name
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g. Professional Plan"
              className={`h-11 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.name && (
              <p className="text-[11px] font-medium text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-semibold">
                Price (USD)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className="h-11"
              />
              {errors.price && (
                <p className="text-[11px] font-medium text-destructive mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripePriceId" className="text-sm font-semibold">
                Stripe Price ID (Optional)
              </Label>
              <Input
                id="stripePriceId"
                {...register("stripePriceId")}
                placeholder="price_1Nw..."
                className={`h-11 ${errors.stripePriceId ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              {errors.stripePriceId && (
                <p className="text-[11px] font-medium text-destructive mt-1">
                  {errors.stripePriceId.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxFolders" className="text-sm font-semibold">
                Max Folders
              </Label>
              <Input
                id="maxFolders"
                type="number"
                {...register("maxFolders", { valueAsNumber: true })}
                className="h-11"
              />
              {errors.maxFolders && (
                <p className="text-[11px] font-medium text-destructive mt-1">
                  {errors.maxFolders.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxNesting" className="text-sm font-semibold">
                Max Nesting Depth
              </Label>
              <Input
                id="maxNesting"
                type="number"
                {...register("maxNesting", { valueAsNumber: true })}
                className="h-11"
              />
              {errors.maxNesting && (
                <p className="text-[11px] font-medium text-destructive mt-1">
                  {errors.maxNesting.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold">Allowed File Types</Label>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-accent/30 p-4 rounded-lg border border-border">
              {fileTypes.map((type) => (
                <label
                  key={type.label}
                  className="flex items-center gap-3 text-sm cursor-pointer hover:text-primary transition-colors py-1"
                >
                  <Checkbox
                    checked={allowedTypes.includes(type.value)}
                    onCheckedChange={() => toggleType(type.value)}
                    className="h-5 w-5"
                  />
                  <span className="font-medium">{type.label}</span>
                </label>
              ))}
            </div>
            {errors.allowedTypes && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {errors.allowedTypes.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize" className="text-sm font-semibold text-center block">
                Max Size (MB)
              </Label>
              <Input
                id="maxFileSize"
                type="number"
                {...register("maxFileSize", { valueAsNumber: true })}
                className="h-11 text-center"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="storageLimit"
                className="text-sm font-semibold text-center block leading-tight"
              >
                Storage Limit (MB)
              </Label>
              <Input
                id="storageLimit"
                type="number"
                {...register("storageLimit", { valueAsNumber: true })}
                className="h-11 text-center"
              />
              {errors.storageLimit && (
                <p className="text-[11px] font-medium text-destructive mt-1 text-center">
                  {errors.storageLimit.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalFileLimit" className="text-sm font-semibold text-center block">
                Total Files
              </Label>
              <Input
                id="totalFileLimit"
                type="number"
                {...register("totalFileLimit", { valueAsNumber: true })}
                className="h-11 text-center"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filesPerFolder" className="text-sm font-semibold text-center block">
                Files/Folder
              </Label>
              <Input
                id="filesPerFolder"
                type="number"
                {...register("filesPerFolder", { valueAsNumber: true })}
                className="h-11 text-center"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 h-11"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="px-8 h-11 font-bold shadow-md" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {initialData ? "Save Changes" : "Create Package"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
