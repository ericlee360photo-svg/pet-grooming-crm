"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Search, ExternalLink, Users, Calendar, Settings, Eye } from "lucide-react";

interface Business {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  description?: string;
  primaryColor: string;
  accentColor: string;
  active: boolean;
  bookingEnabled: boolean;
  createdAt: string;
  _count: {
    groomers: number;
    clients: number;
    appointments: number;
    services: number;
  };
}

export default function BusinessesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user.role !== "ADMIN") {
      router.push("/auth/signin");
      return;
    }

    fetchBusinesses();
  }, [session, status, router]);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch("/api/admin/businesses");
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data);
      }
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
    } finally {
      setLoading(false);
    }
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

  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Businesses</h1>
            <p className="text-primary-600 mt-1">Manage your BarkBook tenant businesses</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-2 rounded-md hover:from-primary-700 hover:to-accent-700 flex items-center transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Business
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-400" />
          <input
            type="text"
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-primary-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Add Business Form */}
      {showAddForm && (
        <AddBusinessForm 
          onSuccess={() => {
            setShowAddForm(false);
            fetchBusinesses();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Businesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((business) => (
            <div key={business.id} className="bg-white shadow-lg rounded-lg border border-primary-100 overflow-hidden">
              {/* Header with business colors */}
              <div 
                className="h-20 flex items-center justify-center text-white"
                style={{
                  background: `linear-gradient(135deg, ${business.primaryColor}, ${business.accentColor})`
                }}
              >
                <h3 className="text-lg font-semibold text-center px-4">{business.name}</h3>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-primary-600 font-medium">/{business.slug}</p>
                  {business.description && (
                    <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{business.description}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-neutral-900">{business._count.groomers}</div>
                    <div className="text-xs text-neutral-500">Groomers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-neutral-900">{business._count.clients}</div>
                    <div className="text-xs text-neutral-500">Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-neutral-900">{business._count.appointments}</div>
                    <div className="text-xs text-neutral-500">Appointments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-neutral-900">{business._count.services}</div>
                    <div className="text-xs text-neutral-500">Services</div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    business.active 
                      ? "bg-accent-100 text-accent-800" 
                      : "bg-secondary-100 text-secondary-800"
                  }`}>
                    {business.active ? "Active" : "Inactive"}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    business.bookingEnabled 
                      ? "bg-primary-100 text-primary-800" 
                      : "bg-neutral-100 text-neutral-800"
                  }`}>
                    {business.bookingEnabled ? "Booking On" : "Booking Off"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <a
                    href={`/book/${business.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-primary-100 text-primary-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-200 transition-colors flex items-center justify-center"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Page
                  </a>
                  <button className="flex-1 bg-accent-100 text-accent-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent-200 transition-colors flex items-center justify-center">
                    <Settings className="w-3 h-3 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="w-12 h-12 text-primary-300 mx-auto mb-4" />
            <p className="text-primary-500">No businesses found</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="mt-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              Add your first business
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// Simple Add Business Form Component
function AddBusinessForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    postal: "",
    description: "",
    primaryColor: "#c19a7e",
    accentColor: "#d19670",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setError(result.error || "Failed to create business");
      }
    } catch (error) {
      setError("Failed to create business");
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }));
  };

  return (
    <div className="bg-white shadow-lg rounded-lg border border-primary-200 p-6 mb-8">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Add New Business</h2>
      
      {error && (
        <div className="bg-secondary-50 border border-secondary-200 rounded-md p-3 mb-4">
          <p className="text-secondary-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="business-name"
            />
            <p className="text-xs text-neutral-500 mt-1">Will be used as: /book/{formData.slug}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Brief description of the business..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Primary Color
            </label>
            <input
              type="color"
              value={formData.primaryColor}
              onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
              className="w-full h-10 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Accent Color
            </label>
            <input
              type="color"
              value={formData.accentColor}
              onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
              className="w-full h-10 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-primary-200 text-primary-700 py-2 px-4 rounded-md hover:bg-primary-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-primary-600 to-accent-600 text-white py-2 px-4 rounded-md hover:from-primary-700 hover:to-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Creating..." : "Create Business"}
          </button>
        </div>
      </form>
    </div>
  );
}
