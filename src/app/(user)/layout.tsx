import { AuthGuard } from "@/components/auth/RouteGuards";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
