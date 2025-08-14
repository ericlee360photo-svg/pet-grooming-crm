"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, Calendar, DollarSign, Star, TrendingUp, Package } from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalAppointments: 0,
    revenue: 0,
    averageRating: 0,
    totalProducts: 0,
    pendingPayments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, appointmentsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/appointments?limit=5"),
      ]);

      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
      if (appointmentsRes.ok) {
        setRecentAppointments(await appointmentsRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!session || session.user.role !== "ADMIN") {
    return <div className="flex justify-center items-center min-h-screen">Access denied</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your pet grooming business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Clients</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${(stats.revenue / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Rating</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Products</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Payments</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${(stats.pendingPayments / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Appointments</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentAppointments.map((appointment: any) => (
            <div key={appointment.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {appointment.client.name} - {appointment.pet.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appointment.groomer.user.name} • {new Date(appointment.start).toLocaleString()}
                  </p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  appointment.status === "COMPLETED" 
                    ? "bg-green-100 text-green-800"
                    : appointment.status === "SCHEDULED"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => router.push("/appointments")}
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <Calendar className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Manage Appointments</h3>
          <p className="text-gray-500">View and edit appointments</p>
        </button>

        <button
          onClick={() => router.push("/products")}
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <Package className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Manage Products</h3>
          <p className="text-gray-500">Add and edit retail products</p>
        </button>

        <button
          onClick={() => router.push("/admin/reports")}
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">View Reports</h3>
          <p className="text-gray-500">Revenue and analytics</p>
        </button>
      </div>
    </div>
  );
}
