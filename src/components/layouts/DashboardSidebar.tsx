"use client";

import {
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  PanelLeft,
  PanelLeftClose,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/api/use-auth";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

const adminNavItems: NavItem[] = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Packages", url: "/admin/packages", icon: Package },
];

const userNavItems: NavItem[] = [
  { title: "Dashboard", url: "/user", icon: LayoutDashboard },
  { title: "My Files", url: "/user/files", icon: FileText },
  { title: "Subscription", url: "/user/subscription", icon: CreditCard },
];

export function DashboardSidebar() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const pathname = usePathname();

  const navItems = user?.role === "ADMIN" ? adminNavItems : userNavItems;
  const roleTitle = user?.role === "ADMIN" ? "Admin Panel" : "User Dashboard";

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-4 w-4 text-primary-foreground" />
        </div>
        {isSidebarOpen && <span className="font-semibold text-sm truncate">{roleTitle}</span>}
      </div>

      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.url ||
            (item.url !== "/admin" && item.url !== "/user" && pathname.startsWith(item.url));
          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !isSidebarOpen && "justify-center"
              )}
              title={!isSidebarOpen ? item.title : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {isSidebarOpen && item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-2 flex flex-col gap-2">
        <div
          className={cn(
            "flex items-center gap-2",
            isSidebarOpen ? "justify-between" : "justify-center"
          )}
        >
          {isSidebarOpen && <ThemeToggle />}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-muted-foreground cursor-pointer"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        <button
          onClick={() => logout()}
          className={cn(
            "flex items-center cursor-pointer gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full",
            !isSidebarOpen && "justify-center"
          )}
          title={!isSidebarOpen ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {isSidebarOpen && "Logout"}
        </button>
      </div>
    </aside>
  );
}
