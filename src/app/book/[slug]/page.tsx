"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TenantBookingWidget from "@/components/TenantBookingWidget";

interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  primaryColor: string;
  accentColor: string;
  logo?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
}

export default function BusinessBookingPage() {
  const params = useParams();
  const businessSlug = params.slug as string;
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBusiness();
  }, [businessSlug]);

  const fetchBusiness = async () => {
    try {
      const response = await fetch(`/api/business/${businessSlug}`);
      if (response.ok) {
        const data = await response.json();
        setBusiness(data);
      } else {
        setError("Business not found or booking is disabled");
      }
    } catch (error) {
      console.error("Failed to fetch business:", error);
      setError("Failed to load business information");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-2">Business Not Found</h1>
          <p className="text-gray-600 mb-4">
            {error || "This booking page is not available or has been disabled."}
          </p>
          <a 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  // Set dynamic styles based on business branding
  const customStyles = {
    '--primary-color': business.primaryColor,
    '--accent-color': business.accentColor,
    background: `linear-gradient(135deg, ${business.primaryColor}10, ${business.accentColor}10)`,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen p-4" style={customStyles}>
      {/* Header */}
      <header className="max-w-4xl mx-auto py-8">
        <div className="text-center">
          {business.logo && (
            <img 
              src={business.logo} 
              alt={business.name}
              className="w-20 h-20 mx-auto mb-4 rounded-full object-cover shadow-lg"
            />
          )}
          <h1 
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: business.primaryColor }}
          >
            {business.name}
          </h1>
          {business.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {business.description}
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Business Info */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6" style={{ color: business.primaryColor }}>
              About {business.name}
            </h2>
            
            <div className="space-y-4">
              {business.address && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600">
                    {business.address}
                    {business.city && `, ${business.city}`}
                    {business.state && `, ${business.state}`}
                  </p>
                </div>
              )}
              
              {business.phone && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
                  <a 
                    href={`tel:${business.phone}`}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {business.phone}
                  </a>
                </div>
              )}
              
              {business.email && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                  <a 
                    href={`mailto:${business.email}`}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {business.email}
                  </a>
                </div>
              )}

              {business.website && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Website</h3>
                  <a 
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {business.website}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Business Hours</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>9:00 AM - 3:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div>
            <TenantBookingWidget businessSlug={businessSlug} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-12 py-8 text-center">
        <p className="text-sm text-gray-500">
                        Powered by BarkBook • Professional pet grooming management
        </p>
      </footer>
    </div>
  );
}
