"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId?: string;
  selectedStart?: Date;
  selectedEnd?: Date;
  onSave: () => void;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  appointmentId,
  selectedStart,
  selectedEnd,
  onSave,
}: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    clientId: "",
    petId: "",
    groomerId: "",
    serviceId: "",
    start: "",
    end: "",
    notes: "",
    status: "SCHEDULED",
  });
  const [clients, setClients] = useState([]);
  const [pets, setPets] = useState([]);
  const [groomers, setGroomers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (selectedStart && selectedEnd) {
        setFormData(prev => ({
          ...prev,
          start: formatDateTime(selectedStart),
          end: formatDateTime(selectedEnd),
        }));
      }
      if (appointmentId) {
        fetchAppointment();
      }
    }
  }, [isOpen, appointmentId, selectedStart, selectedEnd]);

  const formatDateTime = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  const fetchData = async () => {
    try {
      const [clientsRes, groomersRes, servicesRes] = await Promise.all([
        fetch("/api/clients"),
        fetch("/api/groomers"),
        fetch("/api/services"),
      ]);

      setClients(await clientsRes.json());
      setGroomers(await groomersRes.json());
      setServices(await servicesRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const fetchAppointment = async () => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`);
      const appointment = await response.json();
      
      setFormData({
        clientId: appointment.clientId,
        petId: appointment.petId,
        groomerId: appointment.groomerId,
        serviceId: appointment.serviceId || "",
        start: formatDateTime(new Date(appointment.start)),
        end: formatDateTime(new Date(appointment.end)),
        notes: appointment.notes || "",
        status: appointment.status,
      });

      // Fetch pets for the selected client
      if (appointment.clientId) {
        fetchPets(appointment.clientId);
      }
    } catch (error) {
      console.error("Failed to fetch appointment:", error);
    }
  };

  const fetchPets = async (clientId: string) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/pets`);
      const petsData = await response.json();
      setPets(petsData);
    } catch (error) {
      console.error("Failed to fetch pets:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = appointmentId 
        ? `/api/appointments/${appointmentId}`
        : "/api/appointments";
      
      const method = appointmentId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to save appointment");
      }
    } catch (error) {
      console.error("Save appointment error:", error);
      alert("Failed to save appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleClientChange = (clientId: string) => {
    setFormData(prev => ({ ...prev, clientId, petId: "" }));
    setPets([]);
    if (clientId) {
      fetchPets(clientId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {appointmentId ? "Edit Appointment" : "New Appointment"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Client Selection */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Client *
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => handleClientChange(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
            >
              <option value="">Select a client</option>
              {clients.map((client: any) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
          </div>

          {/* Pet Selection */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Pet *
            </label>
            <select
              value={formData.petId}
              onChange={(e) => setFormData(prev => ({ ...prev, petId: e.target.value }))}
              required
              disabled={!formData.clientId}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base disabled:bg-gray-100"
            >
              <option value="">Select a pet</option>
              {pets.map((pet: any) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species})
                </option>
              ))}
            </select>
          </div>

          {/* Groomer Selection */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Groomer *
            </label>
            <select
              value={formData.groomerId}
              onChange={(e) => setFormData(prev => ({ ...prev, groomerId: e.target.value }))}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
            >
              <option value="">Select a groomer</option>
              {groomers.map((groomer: any) => (
                <option key={groomer.id} value={groomer.id}>
                  {groomer.name}
                </option>
              ))}
            </select>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Service
            </label>
            <select
              value={formData.serviceId}
              onChange={(e) => setFormData(prev => ({ ...prev, serviceId: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
            >
              <option value="">Select a service</option>
              {services.map((service: any) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.price}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="datetime-local"
                value={formData.start}
                onChange={(e) => setFormData(prev => ({ ...prev, start: e.target.value }))}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="datetime-local"
                value={formData.end}
                onChange={(e) => setFormData(prev => ({ ...prev, end: e.target.value }))}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
            >
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELED">Canceled</option>
              <option value="NO_SHOW">No Show</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base resize-none"
              placeholder="Any special instructions or notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                appointmentId ? "Update Appointment" : "Create Appointment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
