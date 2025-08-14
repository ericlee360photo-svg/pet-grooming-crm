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
      setPets(await response.json());
    } catch (error) {
      console.error("Failed to fetch pets:", error);
    }
  };

  const handleClientChange = (clientId: string) => {
    setFormData(prev => ({ ...prev, clientId, petId: "" }));
    if (clientId) {
      fetchPets(clientId);
    } else {
      setPets([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = appointmentId ? "/api/appointments" : "/api/appointments";
      const method = appointmentId ? "PUT" : "POST";
      
      const payload = appointmentId 
        ? { id: appointmentId, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save appointment");
      }
    } catch (error) {
      console.error("Save appointment error:", error);
      alert("Failed to save appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!appointmentId) return;
    
    if (confirm("Are you sure you want to delete this appointment?")) {
      try {
        const response = await fetch(`/api/appointments?id=${appointmentId}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          onSave();
          onClose();
        } else {
          alert("Failed to delete appointment");
        }
      } catch (error) {
        console.error("Delete appointment error:", error);
        alert("Failed to delete appointment");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {appointmentId ? "Edit Appointment" : "New Appointment"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a client</option>
                {clients.map((client: any) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pet
              </label>
              <select
                value={formData.petId}
                onChange={(e) => setFormData(prev => ({ ...prev, petId: e.target.value }))}
                required
                disabled={!formData.clientId}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a pet</option>
                {pets.map((pet: any) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} ({pet.species})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Groomer
              </label>
              <select
                value={formData.groomerId}
                onChange={(e) => setFormData(prev => ({ ...prev, groomerId: e.target.value }))}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a groomer</option>
                {groomers.map((groomer: any) => (
                  <option key={groomer.id} value={groomer.id}>
                    {groomer.user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <select
                value={formData.serviceId}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceId: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a service (optional)</option>
                {services.map((service: any) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${(service.priceCents / 100).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={formData.start}
                onChange={(e) => setFormData(prev => ({ ...prev, start: e.target.value }))}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                value={formData.end}
                onChange={(e) => setFormData(prev => ({ ...prev, end: e.target.value }))}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {appointmentId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELED">Canceled</option>
                <option value="NO_SHOW">No Show</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Any special instructions or notes..."
            />
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {appointmentId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : appointmentId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
