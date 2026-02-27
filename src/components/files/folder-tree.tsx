"use client";

import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";
import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { Folder as FolderType } from "@/types/files";

interface FolderTreeProps {
  folders: FolderType[];
  currentFolderId: string | null;
  onFolderClick: (id: string | null, name: string) => void;
  level?: number;
  isLoading?: boolean;
}

export const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  currentFolderId,
  onFolderClick,
  level = 0,
  isLoading = false,
}) => {
  if (isLoading && level === 0) {
    return (
      <div className="space-y-2 px-2 py-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-full bg-muted/40 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }
  return (
    <div className={cn("space-y-1", level > 0 && "ml-4 border-l border-border/50 pl-2")}>
      {folders.map((folder) => (
        <FolderTreeNode
          key={folder.id}
          folder={folder}
          currentFolderId={currentFolderId}
          onFolderClick={onFolderClick}
          level={level}
        />
      ))}
    </div>
  );
};

const FolderTreeNode: React.FC<{
  folder: FolderType;
  currentFolderId: string | null;
  onFolderClick: (id: string | null, name: string) => void;
  level: number;
}> = ({ folder, currentFolderId, onFolderClick, level }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = folder.children && folder.children.length > 0;
  const isActive = currentFolderId === folder.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-1">
      <div
        onClick={() => onFolderClick(folder.id, folder.name)}
        className={cn(
          "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors cursor-pointer",
          isActive
            ? "bg-primary text-primary-foreground font-medium"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <button
          onClick={handleToggle}
          className={cn(
            "p-0.5 rounded-sm hover:bg-black/5 transition-opacity",
            !hasChildren && "opacity-0 cursor-default"
          )}
          disabled={!hasChildren}
        >
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
        {isActive ? (
          <FolderOpen className="h-4 w-4 shrink-0" />
        ) : (
          <Folder className="h-4 w-4 shrink-0" />
        )}
        <span className="truncate">{folder.name}</span>
      </div>

      {isExpanded && hasChildren && (
        <FolderTree
          folders={folder.children!}
          currentFolderId={currentFolderId}
          onFolderClick={onFolderClick}
          level={level + 1}
        />
      )}
    </div>
  );
};
