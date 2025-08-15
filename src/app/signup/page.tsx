"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, AlertCircle, CreditCard, Building2, User, Mail, Phone, MapPin } from "lucide-react";
import { PRICING_PLANS, formatPrice, getTrialDays, type PlanTier } from "@/lib/pricing";

interface SignupData {
  // Business info
  businessName: string;
  businessSlug: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessPostal: string;
  businessDescription: string;
  
  // Owner info
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  ownerPasswordConfirm: string;
  
  // Subscription
  planTier: PlanTier;
  billingCycle: "monthly" | "yearly";
}

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState<SignupData>({
    businessName: "",
    businessSlug: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessPostal: "",
    businessDescription: "",
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
    ownerPasswordConfirm: "",
    planTier: (searchParams.get("plan")?.toUpperCase() as PlanTier) || "PRO",
    billingCycle: (searchParams.get("billing") as "monthly" | "yearly") || "yearly",
  });

  useEffect(() => {
    // Auto-generate slug from business name
    if (formData.businessName && !formData.businessSlug) {
      const slug = formData.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, businessSlug: slug }));
    }
  }, [formData.businessName, formData.businessSlug]);

  const selectedPlan = PRICING_PLANS[formData.planTier];
  const price = formData.billingCycle === "monthly" 
    ? selectedPlan.priceMonthly 
    : Math.floor(selectedPlan.priceYearly / 12);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Validate passwords match
      if (formData.ownerPassword !== formData.ownerPasswordConfirm) {
        throw new Error("Passwords do not match");
      }

      // Create the business and subscription
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Signup failed");
      }

      // Redirect to payment setup or success page
      if (result.paymentRequired) {
        window.location.href = result.paymentUrl;
      } else {
        window.location.href = "/admin?welcome=true";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">
            Welcome to BarkBook
          </h1>
          <p className="text-xl text-primary-700">
            Get set up in minutes with a {getTrialDays()}-day free trial
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[
            { num: 1, label: "Plan", color: "from-blue-500 to-blue-600" },
            { num: 2, label: "Business", color: "from-purple-500 to-purple-600" },
            { num: 3, label: "Account", color: "from-green-500 to-green-600" },
            { num: 4, label: "Review", color: "from-orange-500 to-orange-600" }
          ].map((step, index) => (
            <div key={step.num} className="flex items-center">
              <div className="text-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all shadow-lg ${
                    step.num <= currentStep
                      ? `bg-gradient-to-r ${step.color} text-white`
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.num < currentStep ? <Check className="w-5 h-5" /> : step.num}
                </div>
                <div className={`text-xs mt-1 font-medium ${
                  step.num <= currentStep ? "text-gray-700" : "text-gray-400"
                }`}>
                  {step.label}
                </div>
              </div>
              {index < 3 && (
                <div className={`w-16 h-1 mx-4 rounded-full ${
                  step.num < currentStep ? "bg-gradient-to-r from-gray-300 to-gray-400" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-primary-200">
          
          {/* Step 1: Plan Selection */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
                <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-blue-900">Choose Your Plan</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {Object.entries(PRICING_PLANS).map(([tier, plan]) => {
                  const tierColors = {
                    BASIC: {
                      border: "border-blue-400",
                      bg: "bg-blue-50",
                      hover: "hover:border-blue-500",
                      text: "text-blue-600"
                    },
                    PRO: {
                      border: "border-primary-400",
                      bg: "bg-primary-50",
                      hover: "hover:border-primary-500",
                      text: "text-primary-600"
                    },
                    GROWTH: {
                      border: "border-green-400",
                      bg: "bg-green-50",
                      hover: "hover:border-green-500",
                      text: "text-green-600"
                    }
                  };
                  const colors = tierColors[tier as keyof typeof tierColors];
                  
                  return (
                  <div
                    key={tier}
                    onClick={() => setFormData(prev => ({ ...prev, planTier: tier as PlanTier }))}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                      formData.planTier === tier
                        ? `${colors.border} ${colors.bg} ring-2 ring-opacity-50`
                        : `border-gray-200 ${colors.hover} hover:bg-gray-50`
                    }`}
                  >
                    <h3 className={`font-bold text-lg mb-2 ${formData.planTier === tier ? colors.text : 'text-gray-700'}`}>{plan.name}</h3>
                    <div className={`text-2xl font-bold mb-2 ${formData.planTier === tier ? colors.text : 'text-gray-600'}`}>
                      {formatPrice(formData.billingCycle === "monthly" ? plan.priceMonthly : Math.floor(plan.priceYearly / 12))}
                      <span className="text-sm text-gray-500">/month</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {plan.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check className={`w-3 h-3 mr-1 ${formData.planTier === tier ? colors.text : 'text-gray-400'}`} />
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li className={formData.planTier === tier ? colors.text : 'text-gray-500'}>+{plan.features.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                  );
                })}
              </div>

              {/* Billing Cycle */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-neutral-700 mb-3">Billing Cycle</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, billingCycle: "monthly" }))}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      formData.billingCycle === "monthly"
                        ? "border-primary-400 bg-primary-50 text-primary-700"
                        : "border-primary-200 text-neutral-700 hover:border-primary-300"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, billingCycle: "yearly" }))}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      formData.billingCycle === "yearly"
                        ? "border-primary-400 bg-primary-50 text-primary-700"
                        : "border-primary-200 text-neutral-700 hover:border-primary-300"
                    }`}
                  >
                    Yearly <span className="text-accent-600 font-medium">(Save 17%)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Information */}
          {currentStep === 2 && (
            <div>
              <div className="flex items-center mb-6 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-l-4 border-purple-500">
                <Building2 className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-purple-900">Business Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Pawsome Pet Grooming"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Website URL *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-3 border border-r-0 border-primary-300 bg-primary-50 text-primary-600 text-sm rounded-l-lg">
                      yoursite.com/book/
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.businessSlug}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessSlug: e.target.value }))}
                      className="flex-1 px-4 py-3 border border-primary-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="pawsome-pets"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Business Email
                  </label>
                  <input
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessEmail: e.target.value }))}
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="info@pawsomepets.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Business Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.businessPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessPhone: e.target.value }))}
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessAddress: e.target.value }))}
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.businessCity}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessCity: e.target.value }))}
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Anytown"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.businessState}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessState: e.target.value }))}
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="CA"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Business Description
                  </label>
                  <textarea
                    value={formData.businessDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Professional pet grooming services with over 10 years of experience..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Owner Account */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-500">
                <User className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-green-900">Create Your Account</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="John Smith"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerEmail: e.target.value }))}
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="john@pawsomepets.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.ownerPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerPassword: e.target.value }))}
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="••••••••"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.ownerPasswordConfirm}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerPasswordConfirm: e.target.value }))}
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Complete */}
          {currentStep === 4 && (
            <div>
              <div className="flex items-center mb-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-l-4 border-orange-500">
                <Check className="w-6 h-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-orange-900">Review & Complete</h2>
              </div>
              
              <div className="bg-primary-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                <div className="flex justify-between items-center mb-2">
                  <span>{selectedPlan.name} Plan ({formData.billingCycle})</span>
                  <span className="font-bold">{formatPrice(price)}/month</span>
                </div>
                <div className="text-sm text-primary-600 mb-4">
                  {getTrialDays()}-day free trial • Cancel anytime
                </div>
                <div className="border-t border-primary-200 pt-4">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span>Free for {getTrialDays()} days, then {formatPrice(price)}/month</span>
                  </div>
                </div>
              </div>

              <div className="bg-accent-50 rounded-lg p-6 mb-6">
                <h4 className="font-bold mb-2">Business Details</h4>
                <p><strong>Name:</strong> {formData.businessName}</p>
                <p><strong>URL:</strong> yoursite.com/book/{formData.businessSlug}</p>
                <p><strong>Owner:</strong> {formData.ownerName} ({formData.ownerEmail})</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 text-secondary-600 mr-3" />
              <span className="text-secondary-700">{error}</span>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:from-primary-700 hover:to-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  `Start ${getTrialDays()}-Day Free Trial`
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
