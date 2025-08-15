"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  ClockIcon,
  TrendingUp,
  TrendingDown,
  Activity,
  Star,
  Package
} from "lucide-react";

interface Stats {
  totalClients: number;
  totalAppointments: number;
  revenue: number;
  averageRating: number;
  totalProducts: number;
  pendingPayments: number;
  todayAppointments?: number;
}

interface StatCard {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: any;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    totalAppointments: 0,
    revenue: 0,
    averageRating: 0,
    totalProducts: 0,
    pendingPayments: 0,
    todayAppointments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user.role !== "ADMIN") {
      router.push("/auth/signin");
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, appointmentsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/appointments?limit=5"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json();
        setRecentAppointments(appointmentsData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  const statCards: StatCard[] = [
    {
      name: "Total Clients",
      value: stats.totalClients.toString(),
      change: "+8% from last month",
      changeType: "positive",
      icon: Users,
    },
    {
      name: "Total Appointments",
      value: stats.totalAppointments.toString(),
      change: "+12% from last month",
      changeType: "positive",
      icon: Calendar,
    },
    {
      name: "Today's Appointments",
      value: (stats.todayAppointments || 0).toString(),
      change: "3 pending",
      changeType: "neutral",
      icon: ClockIcon,
    },
    {
      name: "Monthly Revenue",
      value: `$${(stats.revenue / 100).toFixed(2)}`,
      change: "+15% from last month",
      changeType: "positive",
      icon: DollarSign,
    },
    {
      name: "Average Rating",
      value: stats.averageRating.toFixed(1),
      change: "+0.2 from last month",
      changeType: "positive",
      icon: Star,
    },
    {
      name: "Products",
      value: stats.totalProducts.toString(),
      change: "5 new this month",
      changeType: "positive",
      icon: Package,
    },
  ];

  return (
    <AdminLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h1>
        <p className="text-primary-600 mt-1">Welcome back, {session.user.name}! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white overflow-hidden shadow-lg rounded-lg border border-primary-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <card.icon className="h-6 w-6 text-primary-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-primary-600 truncate">{card.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-neutral-900">{card.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-primary-50 px-5 py-3">
              <div className="text-sm">
                <span
                  className={`inline-flex items-center text-sm ${
                    card.changeType === "positive"
                      ? "text-accent-700"
                      : card.changeType === "negative"
                      ? "text-secondary-700"
                      : "text-primary-700"
                  }`}
                >
                  {card.changeType === "positive" && <TrendingUp className="w-3 h-3 mr-1" />}
                  {card.changeType === "negative" && <TrendingDown className="w-3 h-3 mr-1" />}
                  {card.changeType === "neutral" && <Activity className="w-3 h-3 mr-1" />}
                  {card.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <div className="bg-white shadow-lg rounded-lg border border-primary-100">
          <div className="px-6 py-4 border-b border-primary-200">
            <h3 className="text-lg font-medium text-neutral-900">Recent Appointments</h3>
          </div>
          <div className="p-6">
            {recentAppointments?.length ? (
              <div className="space-y-4">
                {recentAppointments.slice(0, 5).map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-neutral-900">{appointment.client?.name}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          appointment.status === "SCHEDULED" ? "bg-primary-100 text-primary-800" :
                          appointment.status === "COMPLETED" ? "bg-accent-100 text-accent-800" :
                          appointment.status === "CANCELED" ? "bg-secondary-100 text-secondary-800" :
                          "bg-neutral-100 text-neutral-800"
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-sm text-primary-600">{appointment.pet?.name} • {appointment.service?.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-neutral-500">{new Date(appointment.start).toLocaleDateString()}</p>
                        <p className="text-xs text-neutral-500">{appointment.groomer?.user?.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-primary-300 mx-auto mb-4" />
                <p className="text-primary-500">No recent appointments</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-lg rounded-lg border border-primary-100">
          <div className="px-6 py-4 border-b border-primary-200">
            <h3 className="text-lg font-medium text-neutral-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              <a 
                href="/appointments" 
                className="flex items-center p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors group"
              >
                <Calendar className="w-8 h-8 text-primary-600 mr-3 group-hover:text-primary-700" />
                <div>
                  <h4 className="text-sm font-medium text-neutral-900">Manage Appointments</h4>
                  <p className="text-sm text-primary-600">View and schedule appointments</p>
                </div>
              </a>
              
              <a 
                href="/admin/clients" 
                className="flex items-center p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors group"
              >
                <Users className="w-8 h-8 text-accent-600 mr-3 group-hover:text-accent-700" />
                <div>
                  <h4 className="text-sm font-medium text-neutral-900">Manage Clients</h4>
                  <p className="text-sm text-primary-600">Add and edit client information</p>
                </div>
              </a>
              
              <a 
                href="/admin/groomers" 
                className="flex items-center p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors group"
              >
                <Activity className="w-8 h-8 text-secondary-600 mr-3 group-hover:text-secondary-700" />
                <div>
                  <h4 className="text-sm font-medium text-neutral-900">Manage Groomers</h4>
                  <p className="text-sm text-primary-600">View staff schedules and availability</p>
                </div>
              </a>
              
              <a 
                href="/products" 
                className="flex items-center p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors group"
              >
                <Package className="w-8 h-8 text-primary-600 mr-3 group-hover:text-primary-700" />
                <div>
                  <h4 className="text-sm font-medium text-neutral-900">Manage Products</h4>
                  <p className="text-sm text-primary-600">Add and edit retail products</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="mt-8 bg-white shadow-lg rounded-lg border border-primary-100">
        <div className="px-6 py-4 border-b border-primary-200">
          <h3 className="text-lg font-medium text-neutral-900">Today's Schedule</h3>
        </div>
        <div className="p-6">
          {stats.todayAppointments ? (
            <p className="text-primary-600">You have {stats.todayAppointments} appointments scheduled for today.</p>
          ) : (
            <div className="text-center py-8">
              <ClockIcon className="w-12 h-12 text-primary-300 mx-auto mb-4" />
              <p className="text-primary-500">No appointments scheduled for today</p>
              <a 
                href="/appointments" 
                className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Schedule an appointment
              </a>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}