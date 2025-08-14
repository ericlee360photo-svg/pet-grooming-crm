"use client";

import { useState } from "react";
import Calendar from "@/components/Calendar";
import AppointmentModal from "@/components/AppointmentModal";

export default function AppointmentsPage() {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | undefined>();
  const [selectedStart, setSelectedStart] = useState<Date | undefined>();
  const [selectedEnd, setSelectedEnd] = useState<Date | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEventClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setSelectedStart(undefined);
    setSelectedEnd(undefined);
    setIsModalOpen(true);
  };

  const handleDateSelect = (start: Date, end: Date) => {
    setSelectedAppointmentId(undefined);
    setSelectedStart(start);
    setSelectedEnd(end);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAppointmentId(undefined);
    setSelectedStart(undefined);
    setSelectedEnd(undefined);
  };

  const handleModalSave = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <button
          onClick={() => {
            setSelectedAppointmentId(undefined);
            setSelectedStart(undefined);
            setSelectedEnd(undefined);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          New Appointment
        </button>
      </div>
      
      <Calendar
        key={refreshKey}
        onEventClick={handleEventClick}
        onDateSelect={handleDateSelect}
      />

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        appointmentId={selectedAppointmentId}
        selectedStart={selectedStart}
        selectedEnd={selectedEnd}
        onSave={handleModalSave}
      />
    </div>
  );
}

