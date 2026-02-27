import { Metadata } from "next";

import FileExplorerClient from "./file-explorer-client";

export const metadata: Metadata = {
  title: "File Manager",
  description: "Manage your files and folders securely on FileSys.",
};

export default function FileExplorerPage() {
  return <FileExplorerClient />;
}
