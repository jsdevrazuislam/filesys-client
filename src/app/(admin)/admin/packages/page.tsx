import { Metadata } from "next";

import AdminPackagesClient from "./admin-packages-client";

export const metadata: Metadata = {
  title: "Subscription Packages",
  description: "Define and manage subscription packages and their limitations.",
};

export default function AdminPackagesPage() {
  return <AdminPackagesClient />;
}
