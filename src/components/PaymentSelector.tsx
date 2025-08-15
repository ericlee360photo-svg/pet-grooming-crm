"use client";

import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

interface PaymentSelectorProps {
  amount: number;
  currency?: string;
  orderId?: string;
  invoiceId?: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

export default function PaymentSelector({
  amount,
  currency = "USD",
  orderId,
  invoiceId,
  onSuccess,
  onError,
}: PaymentSelectorProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>("stripe");
  const [loading, setLoading] = useState(false);

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "stripe",
          amount,
          currency,
          orderId,
          invoiceId,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }),
      });

      const data = await response.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        onSuccess(data.paymentId);
      }
    } catch (error) {
      onError("Failed to process Stripe payment");
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "paypal",
          amount,
          currency,
          orderId,
          invoiceId,
        }),
      });

      const data = await response.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        onSuccess(data.paymentId);
      }
    } catch (error) {
      onError("Failed to process PayPal payment");
    } finally {
      setLoading(false);
    }
  };

  const handleApplePayment = async () => {
    if (!window.ApplePaySession || !ApplePaySession.canMakePayments()) {
      onError("Apple Pay is not available on this device");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "apple_pay",
          amount,
          currency,
          orderId,
          invoiceId,
        }),
      });

      const data = await response.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        onSuccess(data.paymentId);
      }
    } catch (error) {
      onError("Failed to process Apple Pay payment");
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePayment = async () => {
    if (!window.google?.payments?.api?.PaymentsClient) {
      onError("Google Pay is not available on this device");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google_pay",
          amount,
          currency,
          orderId,
          invoiceId,
        }),
      });

      const data = await response.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        onSuccess(data.paymentId);
      }
    } catch (error) {
      onError("Failed to process Google Pay payment");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
        
        <div className="mb-6">
          <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Total Amount: ${(amount / 100).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Select your preferred payment method</p>
        </div>

        {/* Payment Options */}
        <div className="space-y-4 mb-8">
          {/* Stripe/Card Payment */}
          <button
            onClick={() => setSelectedProvider("stripe")}
            className={`w-full p-4 sm:p-6 border-2 rounded-xl text-left transition-all hover:shadow-md ${
              selectedProvider === "stripe"
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-primary-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Credit/Debit Card</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Visa, Mastercard, American Express</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedProvider === "stripe" 
                  ? "border-primary-500 bg-primary-500" 
                  : "border-gray-300"
              }`}>
                {selectedProvider === "stripe" && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
            </div>
          </button>

          {/* PayPal */}
          <button
            onClick={() => setSelectedProvider("paypal")}
            className={`w-full p-4 sm:p-6 border-2 rounded-xl text-left transition-all hover:shadow-md ${
              selectedProvider === "paypal"
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-primary-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.067 8.478c.492.315.844.825.844 1.478 0 .653-.352 1.163-.844 1.478-.492.315-1.163.478-1.844.478H18v-1.956h.223c.681 0 1.352-.163 1.844-.478zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">PayPal</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Pay with your PayPal account</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedProvider === "paypal" 
                  ? "border-primary-500 bg-primary-500" 
                  : "border-gray-300"
              }`}>
                {selectedProvider === "paypal" && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
            </div>
          </button>

          {/* Apple Pay */}
          {typeof window !== 'undefined' && window.ApplePaySession && ApplePaySession.canMakePayments() && (
            <button
              onClick={() => setSelectedProvider("apple_pay")}
              className={`w-full p-4 sm:p-6 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                selectedProvider === "apple_pay"
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-primary-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Apple Pay</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Quick and secure payment</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedProvider === "apple_pay" 
                    ? "border-primary-500 bg-primary-500" 
                    : "border-gray-300"
                }`}>
                  {selectedProvider === "apple_pay" && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
              </div>
            </button>
          )}

          {/* Google Pay */}
          {typeof window !== 'undefined' && window.google?.payments?.api?.PaymentsClient && (
            <button
              onClick={() => setSelectedProvider("google_pay")}
              className={`w-full p-4 sm:p-6 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                selectedProvider === "google_pay"
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-primary-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Google Pay</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Fast and secure payment</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedProvider === "google_pay" 
                    ? "border-primary-500 bg-primary-500" 
                    : "border-gray-300"
                }`}>
                  {selectedProvider === "google_pay" && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Payment Button */}
        <button
          onClick={() => {
            switch (selectedProvider) {
              case "stripe":
                handleStripePayment();
                break;
              case "paypal":
                handlePayPalPayment();
                break;
              case "apple_pay":
                handleApplePayment();
                break;
              case "google_pay":
                handleGooglePayment();
                break;
              default:
                handleStripePayment();
            }
          }}
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 sm:py-4 px-6 rounded-xl font-semibold text-base sm:text-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay $${(amount / 100).toFixed(2)}`
          )}
        </button>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
