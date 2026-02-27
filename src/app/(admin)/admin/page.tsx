import { Metadata } from "next";

import AdminDashboardClient from "./admin-dashboard-client";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Overview of your FileSys platform performance and activity.",
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
