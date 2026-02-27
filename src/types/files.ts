export interface Folder {
  id: string;
  name: string;
  userId: string;
  parentId: string | null;
  depthLevel: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    children: number;
    files: number;
  };
  children?: Folder[];
}

export interface FileItem {
  id: string;
  name: string;
  size: string; // BigInt as string
  mimeType: string;
  userId: string;
  folderId: string | null;
  s3Key: string;
  createdAt: string;
  updatedAt: string;
  url?: string;
}

export type GenericItem = (Folder & { type: "folder" }) | (FileItem & { type: "file" });
