import { z } from "zod";

export const packageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Package name must be at least 2 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  stripePriceId: z.string().optional(),
  maxFolders: z.number().min(1, "At least 1 folder is required"),
  maxNesting: z.number().min(0, "Nesting cannot be negative"),
  allowedTypes: z.array(z.string()).min(1, "Select at least one file type"),
  maxFileSize: z.number().min(1, "File size must be at least 1MB"),
  storageLimit: z.number().min(0, "Storage limit cannot be negative"),
  totalFileLimit: z.number().min(1, "Total file limit must be at least 1"),
  filesPerFolder: z.number().min(1, "Files per folder must be at least 1"),
});

export type PackageFormValues = z.infer<typeof packageSchema>;
