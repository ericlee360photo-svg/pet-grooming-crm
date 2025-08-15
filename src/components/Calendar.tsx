"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";

interface CalendarProps {
  groomerId?: string;
  onEventClick?: (appointmentId: string) => void;
  onDateSelect?: (start: Date, end: Date) => void;
}

export default function Calendar({ groomerId, onEventClick, onDateSelect }: CalendarProps) {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [groomerId]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (groomerId) params.set("groomerId", groomerId);
      
      const response = await fetch(`/api/appointments?${params}`);
      const appointments = await response.json();

      const calendarEvents: EventInput[] = appointments.map((appointment: any) => ({
        id: appointment.id,
        title: `${appointment.pet.name} - ${appointment.client.name}`,
        start: appointment.start,
        end: appointment.end,
        backgroundColor: getStatusColor(appointment.status),
        borderColor: getStatusColor(appointment.status),
        extendedProps: {
          appointment,
        },
      }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "#3b82f6"; // blue
      case "COMPLETED":
        return "#10b981"; // green
      case "CANCELED":
        return "#ef4444"; // red
      case "NO_SHOW":
        return "#f59e0b"; // amber
      default:
        return "#6b7280"; // gray
    }
  };

  const handleEventClick = (info: any) => {
    if (onEventClick) {
      onEventClick(info.event.id);
    }
  };

  const handleDateSelect = (info: any) => {
    if (onDateSelect) {
      onDateSelect(info.start, info.end);
    }
  };

  return (
    <div className="p-2 sm:p-4">
      {loading && (
        <div className="mb-4 text-center text-gray-600 text-sm sm:text-base">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto mb-2"></div>
          Loading appointments...
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={window.innerWidth < 768 ? "dayGridMonth" : "timeGridWeek"}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: window.innerWidth < 768 ? "dayGridMonth" : "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
          events={events}
          eventClick={handleEventClick}
          selectable={true}
          select={handleDateSelect}
          selectMirror={true}
          dayMaxEvents={window.innerWidth < 768 ? 3 : true}
          weekends={true}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Saturday
            startTime: "08:00",
            endTime: "18:00",
          }}
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          eventDisplay={window.innerWidth < 768 ? "list-item" : "block"}
          dayHeaderFormat={{
            weekday: window.innerWidth < 768 ? "short" : "long",
          }}
          titleFormat={{
            year: "numeric",
            month: window.innerWidth < 768 ? "short" : "long",
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
          }}
          moreLinkClick="popover"
          eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
          dayCellClassNames="hover:bg-gray-50 transition-colors"
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          slotLabelClassNames="text-xs sm:text-sm font-medium text-gray-600"
          dayHeaderClassNames="text-xs sm:text-sm font-semibold text-gray-700"
          titleClassNames="text-sm sm:text-base font-bold text-gray-900"
          buttonClassNames="text-xs sm:text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-2 sm:px-3 py-1 sm:py-2 rounded"
          todayButtonClassNames="text-xs sm:text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 px-2 sm:px-3 py-1 sm:py-2 rounded"
        />
      </div>
    </div>
  );
}

