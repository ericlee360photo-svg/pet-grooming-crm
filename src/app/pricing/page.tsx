"use client";

import { useState } from "react";
import { Check, Star, ArrowRight, Zap } from "lucide-react";
import { PRICING_PLANS, formatPrice, calculateYearlySavings, getTrialDays } from "@/lib/pricing";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your grooming business. Start with a {getTrialDays()}-day free trial, no credit card required.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 font-medium ${billingCycle === "monthly" ? "text-white" : "text-primary-200"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-300 transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`ml-3 font-medium ${billingCycle === "yearly" ? "text-white" : "text-primary-200"}`}>
              Yearly
            </span>
            <span className="ml-2 bg-accent-500 text-white px-2 py-1 rounded-full text-sm font-medium">
              Save 17%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {Object.entries(PRICING_PLANS).map(([tier, plan]) => {
            const price = billingCycle === "monthly" ? plan.priceMonthly : Math.floor(plan.priceYearly / 12);
            const savings = billingCycle === "yearly" ? calculateYearlySavings(tier as keyof typeof PRICING_PLANS) : 0;
            
            // Define color schemes for each tier
            const tierColors = {
              BASIC: {
                bg: "bg-gradient-to-b from-blue-50 to-blue-100",
                border: "border-blue-300",
                accent: "text-blue-700",
                button: "bg-blue-600 hover:bg-blue-700 text-white",
                check: "text-blue-600"
              },
              PRO: {
                bg: "bg-gradient-to-b from-purple-50 to-indigo-100",
                border: "border-purple-300",
                accent: "text-purple-700",
                button: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white",
                check: "text-purple-600"
              },
              GROWTH: {
                bg: "bg-gradient-to-b from-green-50 to-emerald-100",
                border: "border-green-300",
                accent: "text-green-700",
                button: "bg-green-600 hover:bg-green-700 text-white",
                check: "text-green-600"
              }
            };

            const colors = tierColors[tier as keyof typeof tierColors];
            
            return (
              <div
                key={tier}
                className={`relative rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-2 ${
                  plan.popular
                    ? `${colors.bg} border-2 ${colors.border} scale-105 ring-2 ring-primary-200 animate-pulse`
                    : `${colors.bg} border-2 ${colors.border}`
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg animate-bounce">
                      <Star className="w-4 h-4 mr-1 animate-spin" />
                      Best Value
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-primary-900 mb-2 drop-shadow-sm">{plan.name}</h3>
                  <p className={`${colors.accent} mb-4 font-semibold drop-shadow-sm`}>{plan.description}</p>
                  
                  <div className="mb-4">
                    {billingCycle === "yearly" && (
                      <div className="text-sm text-gray-500 mb-1">
                        <span className="line-through">
                          {formatPrice(plan.priceMonthly)}/month
                        </span>
                      </div>
                    )}
                    <span className="text-4xl font-bold text-primary-900 drop-shadow-sm">
                      {formatPrice(price)}
                    </span>
                    <span className={`${colors.accent} font-semibold`}>
                      {billingCycle === "yearly" ? "/month" : "/month"}
                    </span>
                    {billingCycle === "yearly" && (
                      <div className="text-xs text-gray-600 mt-1">
                        Billed annually ({formatPrice(plan.priceYearly)}/year)
                      </div>
                    )}
                  </div>
                  
                  {billingCycle === "yearly" && savings > 0 && (
                    <div className={`${colors.accent} font-medium text-sm`}>
                      Save {formatPrice(savings)} per year
                    </div>
                  )}
                  
                  {tier === "BASIC" && (
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                      {getTrialDays()}-day free trial
                    </div>
                  )}
                  {tier === "PRO" && (
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                      {getTrialDays()}-day free trial
                    </div>
                  )}
                  {tier === "GROWTH" && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                      {getTrialDays()}-day free trial
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className={`w-5 h-5 ${colors.check} mr-3 flex-shrink-0 mt-0.5`} />
                      <span className="text-primary-800 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    // Will redirect to signup flow
                    window.location.href = `/signup?plan=${tier.toLowerCase()}&billing=${billingCycle}`;
                  }}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transform ${colors.button} ${
                    plan.popular ? 'animate-pulse' : ''
                  }`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-primary-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow-sm border-2 border-blue-200 hover:shadow-md transition-all">
              <h3 className="font-semibold text-blue-900 mb-3">Can I change plans anytime?</h3>
              <p className="text-blue-700">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate the billing.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 shadow-sm border-2 border-green-200 hover:shadow-md transition-all">
              <h3 className="font-semibold text-green-900 mb-3">What happens after the free trial?</h3>
              <p className="text-green-700">
                After your {getTrialDays()}-day trial, you'll be charged based on your selected plan. Cancel anytime during the trial with no charges.
              </p>
            </div>
            

            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 shadow-sm border-2 border-orange-200 hover:shadow-md transition-all">
              <h3 className="font-semibold text-orange-900 mb-3">Is my data secure?</h3>
              <p className="text-orange-700">
                Absolutely. We use enterprise-grade security with SSL encryption and regular backups to keep your data safe.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-12 text-white">
            <Zap className="w-12 h-12 mx-auto mb-6 text-accent-200" />
            <h2 className="text-3xl font-bold mb-4">Ready to transform your grooming business?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of pet groomers who have streamlined their business with BarkBook.
            </p>
            <button
              onClick={() => {
                window.location.href = `/signup?plan=pro&billing=monthly`;
              }}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-50 transition-colors inline-flex items-center"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
