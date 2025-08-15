"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, User, Phone, Mail, Heart } from "lucide-react";

interface Business {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  description?: string;
  primaryColor: string;
  accentColor: string;
  logo?: string;
  services: Service[];
  groomers: { id: string; name: string; user: { name: string } }[];
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface TimeSlot {
  start: string;
  end: string;
  startTime: string;
  endTime: string;
  availableGroomers: { id: string; name: string }[];
}

interface Availability {
  date: string;
  availableSlots: TimeSlot[];
  groomers: { id: string; name: string }[];
}

interface TenantBookingWidgetProps {
  businessSlug: string;
}

export default function TenantBookingWidget({ businessSlug }: TenantBookingWidgetProps) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedGroomer, setSelectedGroomer] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    petName: "",
    petSpecies: "dog",
    petBreed: "",
    notes: "",
  });

  useEffect(() => {
    fetchBusiness();
  }, [businessSlug]);

  useEffect(() => {
    if (selectedDate && business) {
      fetchAvailability();
    }
  }, [selectedDate, business]);

  const fetchBusiness = async () => {
    try {
      const response = await fetch(`/api/business/${businessSlug}`);
      if (response.ok) {
        const data = await response.json();
        setBusiness(data);
      } else {
        setError("Business not found or booking disabled");
      }
    } catch (error) {
      console.error("Failed to fetch business:", error);
      setError("Failed to load business information");
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/business/${businessSlug}/availability?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setAvailability(data);
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      setError("Failed to load available times");
    }
    setLoading(false);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSelectedGroomer("");
    setAvailability(null);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    // Auto-select first available groomer if only one
    if (slot.availableGroomers.length === 1) {
      setSelectedGroomer(slot.availableGroomers[0].id);
    } else {
      setSelectedGroomer("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedGroomer || !business) {
      setError("Please select a time slot and groomer");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bookingData = {
        ...formData,
        groomerId: selectedGroomer,
        serviceId: selectedService || undefined,
        start: selectedSlot.start,
        end: selectedSlot.end,
      };

      const response = await fetch(`/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          businessSlug, // Add business slug for tenant-specific booking
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setStep(4);
      } else {
        setError(result.error || "Failed to book appointment");
      }
    } catch (error) {
      setError("Failed to book appointment");
    }
    setLoading(false);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 days ahead
    return maxDate.toISOString().split('T')[0];
  };

  const resetForm = () => {
    setSuccess(false);
    setStep(1);
    setSelectedDate("");
    setSelectedSlot(null);
    setSelectedGroomer("");
    setSelectedService("");
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      petName: "",
      petSpecies: "dog",
      petBreed: "",
      notes: "",
    });
  };

  // Custom styles based on business branding
  const getCustomStyles = () => {
    if (!business) return {};
    
    return {
      '--primary-color': business.primaryColor,
      '--accent-color': business.accentColor,
    } as React.CSSProperties;
  };

  if (initialLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading booking system...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Booking Unavailable</h2>
          <p className="text-gray-600 text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center" style={getCustomStyles()}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Your appointment has been successfully booked with {business.name}. We've sent a confirmation email with all the details.
          </p>
          <button
            onClick={resetForm}
            className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-colors text-white"
            style={{ backgroundColor: business.primaryColor }}
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={getCustomStyles()}>
        {/* Header */}
        <div className="p-6 sm:p-8 text-white" style={{ background: `linear-gradient(135deg, ${business.primaryColor}, ${business.accentColor})` }}>
          <div className="flex items-center mb-4">
            {business.logo && (
              <img 
                src={business.logo} 
                alt={`${business.name} logo`}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg mr-4"
              />
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{business.name}</h1>
              {business.description && (
                <p className="text-sm sm:text-base opacity-90 mt-1">{business.description}</p>
              )}
            </div>
          </div>
          <p className="text-sm sm:text-base opacity-90">
            Choose your service, date, and time to schedule your pet's grooming session.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[
              { number: 1, label: "Service", active: step >= 1 },
              { number: 2, label: "Date & Time", active: step >= 2 },
              { number: 3, label: "Details", active: step >= 3 },
            ].map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepItem.active
                      ? "text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  style={stepItem.active ? { backgroundColor: business.primaryColor } : {}}
                >
                  {stepItem.number}
                </div>
                <span
                  className={`ml-2 text-sm font-medium hidden sm:block ${
                    stepItem.active ? "text-gray-900" : "text-gray-500"
                  }`}
                  style={stepItem.active ? { color: business.primaryColor } : {}}
                >
                  {stepItem.label}
                </span>
                {index < 2 && (
                  <div
                    className={`w-8 h-0.5 mx-2 hidden sm:block ${
                      step >= stepItem.number + 1 ? "bg-gray-300" : "bg-gray-200"
                    }`}
                    style={step >= stepItem.number + 1 ? { backgroundColor: business.primaryColor } : {}}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Select a Service</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {business.services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service.id);
                      setStep(2);
                    }}
                    className={`p-4 sm:p-6 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                      selectedService === service.id
                        ? "border-gray-300 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={selectedService === service.id ? { borderColor: business.primaryColor, backgroundColor: `${business.primaryColor}10` } : {}}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{service.name}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3">{service.description}</p>
                    <div className="text-lg sm:text-xl font-bold" style={{ color: business.primaryColor }}>
                      ${service.price.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Choose Date & Time</h2>
              
              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-gray-400"
                  style={{ '--tw-ring-color': business.primaryColor } as React.CSSProperties}
                />
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Available Times</label>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2" style={{ borderColor: business.primaryColor }}></div>
                      <p className="text-gray-500 text-sm">Loading available times...</p>
                    </div>
                  ) : availability && availability.availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availability.availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => handleSlotSelect(slot)}
                          className={`p-3 border-2 rounded-lg text-center transition-all hover:shadow-sm ${
                            selectedSlot === slot
                              ? "border-gray-300 bg-gray-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          style={selectedSlot === slot ? { borderColor: business.primaryColor, backgroundColor: `${business.primaryColor}10` } : {}}
                        >
                          <div className="font-medium text-sm">{slot.startTime}</div>
                          <div className="text-xs text-gray-500">{slot.endTime}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8 text-sm">No available times for this date.</p>
                  )}
                </div>
              )}

              {/* Groomer Selection */}
              {selectedSlot && selectedSlot.availableGroomers.length > 1 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Groomer</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedSlot.availableGroomers.map((groomer) => (
                      <button
                        key={groomer.id}
                        onClick={() => setSelectedGroomer(groomer.id)}
                        className={`p-3 border-2 rounded-lg text-center transition-all hover:shadow-sm ${
                          selectedGroomer === groomer.id
                            ? "border-gray-300 bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        style={selectedGroomer === groomer.id ? { borderColor: business.primaryColor, backgroundColor: `${business.primaryColor}10` } : {}}
                      >
                        <div className="font-medium text-sm">{groomer.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedSlot || (selectedSlot.availableGroomers.length > 1 && !selectedGroomer)}
                  className="flex-1 px-4 py-3 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  style={{ backgroundColor: business.primaryColor }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Client & Pet Details</h2>
              
              <div className="space-y-4">
                {/* Client Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-gray-400"
                      placeholder="Your full name"
                      style={{ '--tw-ring-color': business.primaryColor } as React.CSSProperties}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-gray-400"
                      placeholder="your@email.com"
                      style={{ '--tw-ring-color': business.primaryColor } as React.CSSProperties}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-gray-400"
                    placeholder="(555) 123-4567"
                    style={{ '--tw-ring-color': business.primaryColor } as React.CSSProperties}
                  />
                </div>

                {/* Pet Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.petName}
                      onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-gray-400"
                      placeholder="Pet's name"
                      style={{ '--tw-ring-color': business.primaryColor } as React.CSSProperties}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
                    <select
                      value={formData.petSpecies}
                      onChange={(e) => setFormData({ ...formData, petSpecies: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-gray-400"
                      style={{ '--tw-ring-color': business.primaryColor } as React.CSSProperties}
                    >
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                  <input
                    type="text"
                    value={formData.petBreed}
                    onChange={(e) => setFormData({ ...formData, petBreed: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-gray-400"
                    placeholder="e.g., Golden Retriever"
                    style={{ '--tw-ring-color': business.primaryColor } as React.CSSProperties}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-gray-400"
                    placeholder="Any special instructions or concerns..."
                    style={{ '--tw-ring-color': business.primaryColor } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  style={{ backgroundColor: business.primaryColor }}
                >
                  {loading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
