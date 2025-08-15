"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Scissors, Plus, Search, Mail, Phone, Calendar, CheckCircle, XCircle } from "lucide-react";

export default function GroomersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [groomers, setGroomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user.role !== "ADMIN") {
      router.push("/auth/signin");
      return;
    }

    fetchGroomers();
  }, [session, status, router]);

  const fetchGroomers = async () => {
    try {
      const response = await fetch("/api/groomers");
      if (response.ok) {
        const data = await response.json();
        setGroomers(data);
      }
    } catch (error) {
      console.error("Failed to fetch groomers:", error);
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

  const filteredGroomers = groomers.filter((groomer: any) =>
    groomer.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    groomer.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Groomers</h1>
            <p className="text-gray-600 mt-1">Manage your grooming staff</p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Groomer
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search groomers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
          />
        </div>
      </div>

      {/* Groomers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroomers.length > 0 ? (
          filteredGroomers.map((groomer: any) => (
            <div key={groomer.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-lg font-medium text-white">
                      {groomer.user?.name?.charAt(0) || "G"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {groomer.user?.name || "Unknown"}
                    </h3>
                    <div className="flex items-center mt-1">
                      {groomer.active ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {groomer.bio && (
                  <p className="text-sm text-gray-600 mt-4">{groomer.bio}</p>
                )}

                <div className="mt-4 space-y-2">
                  {groomer.user?.email && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="w-4 h-4 mr-2" />
                      {groomer.user.email}
                    </div>
                  )}
                  {groomer.user?.phone && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-4 h-4 mr-2" />
                      {groomer.user.phone}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {groomer.appts?.length || 0} appointments
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-white shadow rounded-lg">
              <div className="text-center py-12">
                <Scissors className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No groomers found</p>
                <button className="mt-2 text-indigo-600 hover:text-indigo-700">
                  Add your first groomer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Staff Overview</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {groomers.filter((g: any) => g.active).length}
              </div>
              <div className="text-sm text-gray-500">Active Groomers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {groomers.reduce((sum: number, g: any) => sum + (g.appts?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-500">Total Appointments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {groomers.length > 0 ? 
                  (groomers.reduce((sum: number, g: any) => sum + (g.appts?.length || 0), 0) / groomers.length).toFixed(1) 
                  : "0"
                }
              </div>
              <div className="text-sm text-gray-500">Avg per Groomer</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
