export type Role = "ADMIN" | "USER";

export interface Package {
  id: string;
  name: string;
  maxFolders: number;
  maxNesting: number;
  allowedTypes: string[];
  maxFileSize: string; // BigInt serialized as string
  storageLimit: string; // BigInt serialized as string
  totalFiles: number;
  filesPerFolder: number;
  price: number;
}

export interface Subscription {
  id: string;
  userId: string;
  packageId: string;
  isActive: boolean;
  package: Package;
  startDate: string;
  endDate?: string | null;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  isVerified: boolean;
  subscriptionHistory?: Subscription[];
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}
