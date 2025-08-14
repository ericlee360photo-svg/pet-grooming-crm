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
      onSuccess(data.paymentId);
    } catch (error) {
      onError("Failed to process Apple Pay payment");
    } finally {
      setLoading(false);
    }
  };

  const handleCashAppPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "cash_app",
          amount,
          currency,
          orderId,
          invoiceId,
        }),
      });

      const data = await response.json();
      onSuccess(data.paymentId);
    } catch (error) {
      onError("Failed to process Cash App payment");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Pay ${formatAmount(amount)} {currency}
        </h3>
        
        <div className="space-y-3">
          {/* Stripe Payment */}
          <div className="border rounded-lg p-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentProvider"
                value="stripe"
                checked={selectedProvider === "stripe"}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="mr-3"
              />
              <div className="flex items-center">
                <span className="font-medium">Credit/Debit Card</span>
                <div className="ml-2 flex space-x-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Visa</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">MC</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Amex</span>
                </div>
              </div>
            </label>
            {selectedProvider === "stripe" && (
              <button
                onClick={handleStripePayment}
                disabled={loading}
                className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Pay with Card"}
              </button>
            )}
          </div>

          {/* PayPal */}
          <div className="border rounded-lg p-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentProvider"
                value="paypal"
                checked={selectedProvider === "paypal"}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="mr-3"
              />
              <span className="font-medium text-blue-600">PayPal</span>
            </label>
            {selectedProvider === "paypal" && (
              <div className="mt-3">
                <PayPalScriptProvider
                  options={{
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                    currency: currency,
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "horizontal" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: formatAmount(amount),
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const order = await actions.order!.capture();
                      onSuccess(order.id!);
                    }}
                    onError={(err) => {
                      onError("PayPal payment failed");
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </div>

          {/* Apple Pay */}
          <div className="border rounded-lg p-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentProvider"
                value="apple_pay"
                checked={selectedProvider === "apple_pay"}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="mr-3"
              />
              <span className="font-medium">🍎 Apple Pay</span>
            </label>
            {selectedProvider === "apple_pay" && (
              <button
                onClick={handleApplePayment}
                disabled={loading || !window.ApplePaySession}
                className="mt-3 w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Pay with Apple Pay"}
              </button>
            )}
          </div>

          {/* Cash App Pay */}
          <div className="border rounded-lg p-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentProvider"
                value="cash_app"
                checked={selectedProvider === "cash_app"}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="mr-3"
              />
              <span className="font-medium text-green-600">💸 Cash App Pay</span>
            </label>
            {selectedProvider === "cash_app" && (
              <button
                onClick={handleCashAppPayment}
                disabled={loading}
                className="mt-3 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Pay with Cash App"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
