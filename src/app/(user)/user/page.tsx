import { Metadata } from "next";

import UserDashboardClient from "./user-dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Welcome to your FileSys dashboard. Monitor your storage and files.",
};

export default function UserDashboardPage() {
  return <UserDashboardClient />;
}
