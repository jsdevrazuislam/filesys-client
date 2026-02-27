"use client";
import {
  ChevronRight,
  Download,
  Eye,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Folder as FolderIcon,
  FolderPlus,
  Grid3X3,
  Home,
  List,
  Loader2,
  Menu,
  MoreHorizontal,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";
import { useMemo, useState } from "react";

import { FolderTree } from "@/components/files/folder-tree";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateFolder,
  useDeleteFile,
  useDeleteFolder,
  useFiles,
  useFolders,
  useFoldersHierarchy,
  useRenameFile,
  useRenameFolder,
} from "@/hooks/api/use-files";
import { useUpload } from "@/hooks/api/use-upload";
import { useUserStats } from "@/hooks/api/use-user";
import { fileService } from "@/lib/api/services/file-service";
import { GenericItem } from "@/types/files";

interface Breadcrumb {
  id: string | null;
  name: string;
}

export default function FileExplorerClient() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([{ id: null, name: "Home" }]);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // UI state for rename
  const [renameItem, setRenameItem] = useState<{
    id: string;
    name: string;
    type: "file" | "folder";
  } | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const currentFolderId = breadcrumbs[breadcrumbs.length - 1].id;

  // Queries
  const { data: folders = [], isLoading: foldersLoading } = useFolders(currentFolderId);
  const { data: files = [], isLoading: filesLoading } = useFiles(currentFolderId);
  const { data: hierarchy = [], isLoading: hierarchyLoading } = useFoldersHierarchy();
  const { data: stats } = useUserStats();

  // Compute dynamic accept attribute from allowedTypes
  const allowedTypes = stats?.allowedTypes;
  const acceptAttribute =
    !allowedTypes || allowedTypes.length === 0
      ? "image/*"
      : allowedTypes
          .flatMap((group) => group.split(","))
          .map((t) => t.trim())
          .filter(Boolean)
          .join(",");

  // Mutations
  const createFolderMutation = useCreateFolder();
  const deleteFileMutation = useDeleteFile();
  const deleteFolderMutation = useDeleteFolder();
  const renameFileMutation = useRenameFile();
  const renameFolderMutation = useRenameFolder();
  const { mutate: uploadFile, progress: uploadProgress, isUploading } = useUpload();

  const isLoading = foldersLoading || filesLoading;

  // Combine folders and files for display
  const items = useMemo<GenericItem[]>(() => {
    const folderItems: GenericItem[] = (Array.isArray(folders) ? folders : []).map((f) => ({
      ...f,
      type: "folder",
    }));
    const fileItems: GenericItem[] = (Array.isArray(files) ? files : []).map((f) => ({
      ...f,
      type: "file",
    }));
    return [...folderItems, ...fileItems];
  }, [folders, files]);

  const handleBreadcrumb = (index: number) => {
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
  };

  const handleFolderClick = (folderId: string | null, folderName: string) => {
    if (folderId === null) {
      setBreadcrumbs([{ id: null, name: "Home" }]);
      return;
    }
    setBreadcrumbs((prev) => {
      const idx = prev.findIndex((b) => b.id === folderId);
      if (idx !== -1) return prev.slice(0, idx + 1);
      return [...prev, { id: folderId, name: folderName }];
    });
    setMobileSidebarOpen(false);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolderMutation.mutate(
        { name: newFolderName, parentId: currentFolderId },
        {
          onSuccess: () => {
            setNewFolderOpen(false);
            setNewFolderName("");
          },
        }
      );
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile({ file, folderId: currentFolderId });
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    }
  };

  const handleRename = () => {
    if (!renameItem || !renameValue.trim()) return;

    if (renameItem.type === "folder") {
      renameFolderMutation.mutate(
        { id: renameItem.id, name: renameValue },
        {
          onSuccess: () => setRenameItem(null),
        }
      );
    } else {
      renameFileMutation.mutate(
        { id: renameItem.id, name: renameValue },
        {
          onSuccess: () => setRenameItem(null),
        }
      );
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return FileImage;
    if (mimeType.startsWith("video/")) return FileVideo;
    if (mimeType.startsWith("audio/")) return FileAudio;
    return FileText;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-border/50 bg-muted/10">
        <div className="p-4 border-b border-border/50 flex items-center gap-2">
          <FolderIcon className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-sm">Folder Library</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3">
            <button
              onClick={() => handleFolderClick(null, "Home")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
                currentFolderId === null
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>All Files</span>
            </button>
            <FolderTree
              folders={hierarchy}
              onFolderClick={handleFolderClick}
              currentFolderId={currentFolderId}
              isLoading={hierarchyLoading}
            />
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <ScrollArea className="flex-1">
          <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Trigger */}
                <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 p-0">
                    <SheetHeader className="p-4 border-b text-left">
                      <SheetTitle>Folder Library</SheetTitle>
                    </SheetHeader>
                    <div className="p-3">
                      <button
                        onClick={() => handleFolderClick(null, "Home")}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
                          currentFolderId === null
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        <Home className="h-4 w-4" />
                        <span>All Files</span>
                      </button>
                      <FolderTree
                        folders={hierarchy}
                        onFolderClick={handleFolderClick}
                        currentFolderId={currentFolderId}
                        isLoading={hierarchyLoading}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">File Manager</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your files and nested folders
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setNewFolderOpen(true)}
                  disabled={createFolderMutation.isPending}
                  className="shadow-sm"
                >
                  {createFolderMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FolderPlus className="mr-2 h-4 w-4" />
                  )}
                  New Folder
                </Button>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    onChange={handleUpload}
                    disabled={isUploading}
                    accept={acceptAttribute}
                  />
                  <Button asChild disabled={isUploading} className="shadow-sm shadow-primary/20">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Upload
                    </label>
                  </Button>
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-primary flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Uploading your file...
                  </span>
                  <span className="text-primary/70">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1.5" />
              </div>
            )}

            {/* Breadcrumbs + View Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide no-scrollbar">
                {breadcrumbs.map((crumb, i) => (
                  <div key={i} className="flex items-center shrink-0">
                    {i > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground/30 mx-0.5" />}
                    <button
                      onClick={() => handleBreadcrumb(i)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all text-sm ${
                        i === breadcrumbs.length - 1
                          ? "bg-accent text-foreground font-semibold"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      }`}
                    >
                      {i === 0 && <Home className="h-4 w-4" />}
                      <span>{crumb.name}</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 rounded-xl bg-muted/30 p-1 border border-border/50">
                <button
                  onClick={() => setView("grid")}
                  className={`rounded-lg p-2 transition-all duration-200 ${
                    view === "grid"
                      ? "bg-background text-primary shadow-sm scale-110"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid3X3 className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`rounded-lg p-2 transition-all duration-200 ${
                    view === "list"
                      ? "bg-background text-primary shadow-sm scale-110"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Items Container */}
            <div className="min-h-[400px]">
              {isLoading ? (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-border/50 bg-card/50 p-6 space-y-4 shadow-sm"
                    >
                      <Skeleton className="h-12 w-12 mx-auto rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-3/4 mx-auto" />
                        <Skeleton className="h-2 w-1/2 mx-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-muted/10 rounded-3xl border border-dashed border-border/50 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                    <FolderPlus className="h-10 w-10 text-primary/40" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">Your explorer is empty</h3>
                  <p className="text-sm text-muted-foreground mt-2 text-center max-w-[320px] leading-relaxed">
                    Organize your workspace by creating nested folders or uploading files directly
                    here.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-8 px-8 h-11 rounded-xl transition-all hover:scale-105 active:scale-95"
                    onClick={() => setNewFolderOpen(true)}
                  >
                    <FolderPlus className="mr-2 h-4 w-4" /> Create First Folder
                  </Button>
                </div>
              ) : view === "grid" ? (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-2xl border border-border/50 bg-card p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden"
                      onDoubleClick={() =>
                        item.type === "folder" ? handleFolderClick(item.id, item.name) : null
                      }
                    >
                      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 group-hover:duration-300">
                        <ItemMenu
                          item={item}
                          onDelete={() => {
                            if (item.type === "folder") {
                              deleteFolderMutation.mutate({
                                id: item.id,
                                parentId: currentFolderId,
                              });
                            } else {
                              deleteFileMutation.mutate({ id: item.id, folderId: currentFolderId });
                            }
                          }}
                          onRename={() => {
                            setRenameItem({ id: item.id, name: item.name, type: item.type });
                            setRenameValue(item.name);
                          }}
                        />
                      </div>
                      <div className="flex flex-col items-center gap-4 pt-4 pb-2">
                        <div className="relative">
                          {item.type === "folder" ? (
                            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-primary/5">
                              <FolderIcon className="h-8 w-8 text-primary transition-colors" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-muted/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-border/30">
                              {(() => {
                                const Icon = getFileIcon(item.mimeType);
                                return <Icon className="h-8 w-8 text-muted-foreground" />;
                              })()}
                            </div>
                          )}
                        </div>
                        <div className="text-center w-full px-2">
                          <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">
                            {item.type === "folder" ? "Folder" : formatSize(Number(item.size))}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/20">
                          <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                            Name
                          </th>
                          <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                            Type
                          </th>
                          <th className="px-6 py-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                            Size
                          </th>
                          <th className="px-6 py-4 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {items.map((item) => (
                          <tr
                            key={item.id}
                            className="group hover:bg-primary/5 cursor-pointer transition-colors"
                            onDoubleClick={() =>
                              item.type === "folder" ? handleFolderClick(item.id, item.name) : null
                            }
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {item.type === "folder" ? (
                                  <div className="p-2 bg-primary/5 rounded-lg group-hover:scale-105 transition-transform">
                                    <FolderIcon className="h-4 w-4 text-primary" />
                                  </div>
                                ) : (
                                  <div className="p-2 bg-muted/40 rounded-lg group-hover:scale-105 transition-transform">
                                    {(() => {
                                      const Icon = getFileIcon(item.mimeType);
                                      return <Icon className="h-4 w-4 text-muted-foreground" />;
                                    })()}
                                  </div>
                                )}
                                <span className="font-semibold group-hover:text-primary transition-colors">
                                  {item.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground font-medium uppercase text-[10px] tracking-tight">
                              {item.type === "folder"
                                ? "Folder"
                                : item.mimeType.split("/")[1] || "File"}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground font-mono text-xs tabular-nums">
                              {item.type === "folder" ? "--" : formatSize(Number(item.size))}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <ItemMenu
                                item={item}
                                onDelete={() => {
                                  if (item.type === "folder") {
                                    deleteFolderMutation.mutate({
                                      id: item.id,
                                      parentId: currentFolderId,
                                    });
                                  } else {
                                    deleteFileMutation.mutate({
                                      id: item.id,
                                      folderId: currentFolderId,
                                    });
                                  }
                                }}
                                onRename={() => {
                                  setRenameItem({ id: item.id, name: item.name, type: item.type });
                                  setRenameValue(item.name);
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="h-12" />
        </ScrollArea>
      </main>

      {/* Dialogs remain identical but with premium styling if needed */}
      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl gap-6 p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                Folder Name
              </Label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Marketing Campaign..."
                className="h-12 rounded-xl border-border bg-muted/10 px-4 focus:ring-primary/20"
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setNewFolderOpen(false)}
                className="rounded-xl h-11 px-6 font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={createFolderMutation.isPending || !newFolderName.trim()}
                className="rounded-xl h-11 px-8 font-semibold shadow-lg shadow-primary/20"
              >
                {createFolderMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Folder
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!renameItem} onOpenChange={(open) => !open && setRenameItem(null)}>
        <DialogContent className="sm:max-w-sm rounded-2xl gap-6 p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Rename {renameItem?.type === "folder" ? "Folder" : "File"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                New Name
              </Label>
              <Input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                placeholder="Enter new name..."
                className="h-12 rounded-xl border-border bg-muted/10 px-4 focus:ring-primary/20"
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setRenameItem(null)}
                className="rounded-xl h-11 px-6 font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRename}
                disabled={
                  renameFileMutation.isPending ||
                  renameFolderMutation.isPending ||
                  !renameValue.trim()
                }
                className="rounded-xl h-11 px-8 font-semibold shadow-lg shadow-primary/20"
              >
                {(renameFileMutation.isPending || renameFolderMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ItemMenu({
  item,
  onDelete,
  onRename,
}: {
  item: GenericItem;
  onDelete: () => void;
  onRename: () => void;
}) {
  const handleAction = async (action: "view" | "download") => {
    try {
      const { url } = await fileService.getFileUrl(item.id, action);
      if (action === "view") {
        window.open(url, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", item.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      // Error is handled by UI or toast if needed
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-accent text-muted-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {item.type === "file" && (
          <>
            <DropdownMenuItem onClick={() => handleAction("view")}>
              <Eye className="mr-2 h-3.5 w-3.5" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("download")}>
              <Download className="mr-2 h-3.5 w-3.5" /> Download
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={onRename}>
          <Pencil className="mr-2 h-3.5 w-3.5" /> Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
