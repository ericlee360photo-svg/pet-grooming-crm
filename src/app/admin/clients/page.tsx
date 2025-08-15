"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Users, Plus, Search, Mail, Phone } from "lucide-react";

export default function ClientsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user.role !== "ADMIN") {
      router.push("/auth/signin");
      return;
    }

    fetchClients();
  }, [session, status, router]);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error);
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

  const filteredClients = clients.filter((client: any) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1">Manage your client database</p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
          />
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            All Clients ({filteredClients.length})
          </h3>
        </div>
        
        {filteredClients.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredClients.map((client: any) => (
              <div key={client.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {client.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{client.name}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        {client.email && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="w-3 h-3 mr-1" />
                            {client.email}
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-3 h-3 mr-1" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {client.pets?.length || 0} pets
                    </p>
                    <p className="text-sm text-gray-500">
                      {client.appts?.length || 0} appointments
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No clients found</p>
            <button className="mt-2 text-indigo-600 hover:text-indigo-700">
              Add your first client
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
