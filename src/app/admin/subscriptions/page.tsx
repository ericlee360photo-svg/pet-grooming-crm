"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { 
  CreditCard, 
  Users, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface Subscription {
  id: string;
  business: {
    id: string;
    name: string;
    slug: string;
    email: string;
  };
  status: string;
  planTier: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd: string;
  groomersUsed: number;
  clientsUsed: number;
  appointmentsThisMonth: number;
  createdAt: string;
}

interface PlanLimits {
  maxGroomers: number;
  maxClients: number;
  maxAppointmentsPerMonth: number;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  BASIC: { maxGroomers: 1, maxClients: 50, maxAppointmentsPerMonth: 100 },
  PRO: { maxGroomers: 3, maxClients: 200, maxAppointmentsPerMonth: 500 },
  GROWTH: { maxGroomers: 10, maxClients: -1, maxAppointmentsPerMonth: -1 }
};

export default function SubscriptionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    trialSubscriptions: 0,
    overdueSubscriptions: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user.role !== "ADMIN") {
      router.push("/auth/signin");
      return;
    }

    fetchSubscriptions();
  }, [session, status, router]);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("/api/admin/subscriptions");
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "TRIALING":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "PAST_DUE":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "CANCELED":
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "TRIALING":
        return "bg-blue-100 text-blue-800";
      case "PAST_DUE":
        return "bg-red-100 text-red-800";
      case "CANCELED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  if (status === "loading" || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
          <p className="text-gray-700">Monitor and manage all business subscriptions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-primary-200">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-primary-600" />
                           <div className="ml-4">
               <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
               <p className="text-2xl font-bold text-gray-900">{stats.totalSubscriptions}</p>
             </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-primary-200">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
                           <div className="ml-4">
               <p className="text-sm font-medium text-gray-600">Active</p>
               <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
             </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-primary-200">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-600" />
                           <div className="ml-4">
               <p className="text-sm font-medium text-gray-600">Trial</p>
               <p className="text-2xl font-bold text-gray-900">{stats.trialSubscriptions}</p>
             </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-primary-200">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
                           <div className="ml-4">
               <p className="text-sm font-medium text-gray-600">Overdue</p>
               <p className="text-2xl font-bold text-gray-900">{stats.overdueSubscriptions}</p>
             </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-primary-200">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
                           <div className="ml-4">
               <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
               <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
             </div>
            </div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-lg shadow border border-primary-200">
          <div className="px-6 py-4 border-b border-primary-200">
            <h2 className="text-xl font-semibold text-gray-900">All Subscriptions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Billing Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((subscription) => {
                  const limits = PLAN_LIMITS[subscription.planTier];
                  const groomerUsage = getUsagePercentage(subscription.groomersUsed, limits.maxGroomers);
                  const clientUsage = getUsagePercentage(subscription.clientsUsed, limits.maxClients);
                  const appointmentUsage = getUsagePercentage(subscription.appointmentsThisMonth, limits.maxAppointmentsPerMonth);
                  
                  return (
                                         <tr key={subscription.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                                                     <div className="text-sm font-medium text-gray-900">
                             {subscription.business.name}
                           </div>
                           <div className="text-sm text-gray-600">
                             {subscription.business.email}
                           </div>
                           <div className="text-xs text-gray-500">
                             {subscription.business.slug}
                           </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {subscription.planTier}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(subscription.status)}
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                            {subscription.status}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs text-primary-600 mb-1">
                              <span>Groomers</span>
                              <span>{subscription.groomersUsed}/{limits.maxGroomers === -1 ? '∞' : limits.maxGroomers}</span>
                            </div>
                            <div className="w-full bg-primary-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${getUsageColor(groomerUsage)}`}
                                style={{ width: `${groomerUsage}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs text-primary-600 mb-1">
                              <span>Clients</span>
                              <span>{subscription.clientsUsed}/{limits.maxClients === -1 ? '∞' : limits.maxClients}</span>
                            </div>
                            <div className="w-full bg-primary-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${getUsageColor(clientUsage)}`}
                                style={{ width: `${clientUsage}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs text-primary-600 mb-1">
                              <span>Appointments</span>
                              <span>{subscription.appointmentsThisMonth}/{limits.maxAppointmentsPerMonth === -1 ? '∞' : limits.maxAppointmentsPerMonth}</span>
                            </div>
                            <div className="w-full bg-primary-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${getUsageColor(appointmentUsage)}`}
                                style={{ width: `${appointmentUsage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                        <div>
                          <div>Start: {formatDate(subscription.currentPeriodStart)}</div>
                          <div>End: {formatDate(subscription.currentPeriodEnd)}</div>
                          {subscription.trialEnd && (
                            <div className="text-xs text-blue-600">
                              Trial ends: {formatDate(subscription.trialEnd)}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-accent-600 hover:text-accent-900 mr-3">
                          View Details
                        </button>
                        <button className="text-primary-600 hover:text-primary-900">
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
