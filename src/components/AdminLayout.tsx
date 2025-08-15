"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Package,
  Camera,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  UserCheck,
  ClipboardList,
  Star,
  Home,
  Building2,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { name: "Businesses", href: "/admin/businesses", icon: Building2 },
  { name: "Appointments", href: "/admin/appointments", icon: Calendar },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Groomers", href: "/admin/groomers", icon: Scissors },
  { name: "Services", href: "/admin/services", icon: UserCheck },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Photos", href: "/admin/photos", icon: Camera },
  { name: "Invoices", href: "/admin/invoices", icon: CreditCard },
  { name: "Surveys", href: "/admin/surveys", icon: ClipboardList },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const quickActions = [
  { name: "Back to Website", href: "/", icon: Home },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-dark-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-primary-200 bg-gradient-to-r from-primary-500 to-accent-500">
            <div className="flex items-center">
              <div className="text-xl font-bold text-white">BarkBook</div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-white/70 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-primary-100 text-primary-700 border-r-2 border-primary-500"
                      : "text-neutral-700 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </a>
              );
            })}

            <div className="pt-6 mt-6 border-t border-primary-200">
              <div className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-3">
                Quick Actions
              </div>
              {quickActions.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium text-neutral-700 rounded-md hover:bg-primary-50 hover:text-primary-700"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </a>
              ))}
            </div>
          </nav>

          {/* User menu */}
          <div className="flex-shrink-0 border-t border-primary-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {session?.user?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-900">
                    {session?.user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-primary-600 capitalize">
                    {session?.user?.role?.toLowerCase() || "admin"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1 rounded-md text-primary-400 hover:text-primary-600"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-primary-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1 rounded-md text-primary-400 hover:text-primary-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-neutral-900">
                {navigation.find(item => item.href === pathname)?.name || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-primary-600">
                Welcome, {session?.user?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
