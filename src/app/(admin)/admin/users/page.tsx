import { Metadata } from "next";

import AdminUsersClient from "./admin-users-client";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage and monitor all users on the FileSys platform.",
};

export default function AdminUsersPage() {
  return <AdminUsersClient />;
}
