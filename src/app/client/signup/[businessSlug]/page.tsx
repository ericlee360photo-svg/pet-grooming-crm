"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { User, Mail, Lock, Phone, MapPin } from "lucide-react";

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  logo: string | null;
}

export default function ClientSignupPage() {
  const params = useParams();
  const router = useRouter();
  const businessSlug = params.businessSlug as string;
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [signupLoading, setSignupLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

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
        setError("Business not found");
      }
    } catch (error) {
      setError("Failed to load business information");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setSignupLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          businessSlug: businessSlug,
        }),
      });

      if (response.ok) {
        // Auto-signin after successful signup
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push(`/client/dashboard?business=${businessSlug}`);
        } else {
          router.push(`/auth/signin?message=Account created successfully! Please sign in.`);
        }
      } else {
        const data = await response.json();
        setError(data.error || "Signup failed");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setSignupLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-900 mb-4">Business Not Found</h1>
          <p className="text-primary-700">The business you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="max-w-md mx-auto pt-12 pb-8 px-4">
        {/* Business Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {business.name.charAt(0)}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary-900 mb-2">
            Join {business.name}
          </h1>
          <p className="text-primary-700">
            Create your account to book appointments and manage your pets
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={signupLoading}
              className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-700 hover:to-accent-700 transition-all disabled:opacity-50"
            >
              {signupLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-primary-600">
              Already have an account?{" "}
              <a 
                href={`/auth/signin?business=${businessSlug}`}
                className="text-accent-600 hover:text-accent-700 font-medium"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-primary-500">
            By creating an account, you agree to our terms of service and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}
