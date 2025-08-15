"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  CreditCard, 
  Users, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Upgrade,
  Settings
} from "lucide-react";

interface BusinessDashboardData {
  business: {
    id: string;
    name: string;
    slug: string;
    planTier: string;
    subscriptionStatus: string;
    trialEndsAt: string | null;
  };
  usage: {
    groomersUsed: number;
    clientsUsed: number;
    appointmentsThisMonth: number;
  };
  limits: {
    maxGroomers: number;
    maxClients: number;
    maxAppointmentsPerMonth: number;
  };
  stats: {
    totalAppointments: number;
    totalRevenue: number;
    averageRating: number;
    activeClients: number;
  };
}

export default function BusinessDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<BusinessDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/business/dashboard");
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
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

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session || !data) {
    return null;
  }

  const { business, usage, limits, stats } = data;

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Dashboard</h1>
          <p className="text-gray-700">Welcome back, {business.name}</p>
        </div>

        {/* Subscription Status Card */}
        <div className="bg-white rounded-lg shadow border border-primary-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Subscription Status</h2>
            <div className="flex space-x-2">
              <button 
                onClick={handleBillingPortal}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <CreditCard className="w-4 h-4 mr-2 inline" />
                Billing Portal
              </button>
              <button 
                onClick={() => router.push('/business/subscription')}
                className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors"
              >
                <Upgrade className="w-4 h-4 mr-2 inline" />
                Manage Plan
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              {getStatusIcon(business.subscriptionStatus)}
              <div className="ml-3">
                <p className="text-sm font-medium text-primary-600">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(business.subscriptionStatus)}`}>
                  {business.subscriptionStatus}
                </span>
              </div>
            </div>
            
                         <div>
               <p className="text-sm font-medium text-gray-600">Current Plan</p>
               <p className="text-lg font-semibold text-gray-900">{business.planTier}</p>
             </div>
            
                         <div>
               <p className="text-sm font-medium text-gray-600">Trial Ends</p>
               <p className="text-lg font-semibold text-gray-900">{formatDate(business.trialEndsAt)}</p>
             </div>
          </div>
        </div>

        {/* Usage Limits */}
        <div className="bg-white rounded-lg shadow border border-primary-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Usage Limits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                             <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-medium text-gray-600">Groomers</span>
                 <span className="text-sm text-gray-600">
                  {usage.groomersUsed}/{limits.maxGroomers === -1 ? '∞' : limits.maxGroomers}
                </span>
              </div>
              <div className="w-full bg-primary-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(usage.groomersUsed, limits.maxGroomers))}`}
                  style={{ width: `${getUsagePercentage(usage.groomersUsed, limits.maxGroomers)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
                             <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-medium text-gray-600">Clients</span>
                 <span className="text-sm text-gray-600">
                  {usage.clientsUsed}/{limits.maxClients === -1 ? '∞' : limits.maxClients}
                </span>
              </div>
              <div className="w-full bg-primary-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(usage.clientsUsed, limits.maxClients))}`}
                  style={{ width: `${getUsagePercentage(usage.clientsUsed, limits.maxClients)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
                             <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-medium text-gray-600">Appointments (This Month)</span>
                 <span className="text-sm text-gray-600">
                  {usage.appointmentsThisMonth}/{limits.maxAppointmentsPerMonth === -1 ? '∞' : limits.maxAppointmentsPerMonth}
                </span>
              </div>
              <div className="w-full bg-primary-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(usage.appointmentsThisMonth, limits.maxAppointmentsPerMonth))}`}
                  style={{ width: `${getUsagePercentage(usage.appointmentsThisMonth, limits.maxAppointmentsPerMonth)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-primary-200">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-primary-600" />
                             <div className="ml-4">
                 <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                 <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-primary-200">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
                             <div className="ml-4">
                 <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                 <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-primary-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
                             <div className="ml-4">
                 <p className="text-sm font-medium text-gray-600">Active Clients</p>
                 <p className="text-2xl font-bold text-gray-900">{stats.activeClients}</p>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-primary-200">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-accent-600" />
                             <div className="ml-4">
                 <p className="text-sm font-medium text-gray-600">Average Rating</p>
                 <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow border border-primary-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => router.push('/business/appointments')}
              className="flex items-center p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <Calendar className="w-6 h-6 text-primary-600 mr-3" />
              <div className="text-left">
                                 <p className="font-medium text-gray-900">Manage Appointments</p>
                 <p className="text-sm text-gray-600">View and schedule appointments</p>
              </div>
            </button>
            
            <button 
              onClick={() => router.push('/business/clients')}
              className="flex items-center p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <Users className="w-6 h-6 text-primary-600 mr-3" />
              <div className="text-left">
                                 <p className="font-medium text-gray-900">Manage Clients</p>
                 <p className="text-sm text-gray-600">View and edit client information</p>
              </div>
            </button>
            
            <button 
              onClick={() => router.push('/business/settings')}
              className="flex items-center p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <Settings className="w-6 h-6 text-primary-600 mr-3" />
              <div className="text-left">
                                 <p className="font-medium text-gray-900">Business Settings</p>
                 <p className="text-sm text-gray-600">Configure your business profile</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
