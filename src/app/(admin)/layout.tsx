import { AdminGuard, AuthGuard } from "@/components/auth/RouteGuards";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminGuard>
        <DashboardLayout>{children}</DashboardLayout>
      </AdminGuard>
    </AuthGuard>
  );
}
