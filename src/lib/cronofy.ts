// Cronofy configuration for calendar sync
// Note: Using a simplified approach for MVP, can be enhanced with actual Cronofy SDK later

export type CalendarEvent = {
  id: string
  summary: string
  description?: string
  start: Date
  end: Date
  location?: string
  attendees?: string[]
}

export type CalendarAvailability = {
  start: Date
  end: Date
  available: boolean
}

export type CalendarSyncConfig = {
  provider: 'google' | 'outlook' | 'ical'
  calendarId: string
  accessToken: string
  refreshToken?: string
}

// Calendar service functions (MVP implementation)
export class CalendarService {
  private config: CalendarSyncConfig

  constructor(config: CalendarSyncConfig) {
    this.config = config
  }

  // Get available time slots for a given date range
  async getAvailability(startDate: Date, endDate: Date): Promise<CalendarAvailability[]> {
    // MVP: Return business hours as available
    // In production, this would sync with actual calendar
    const businessHours = this.getBusinessHours(startDate, endDate)
    return businessHours
  }

  // Create a calendar event for an appointment
  async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    // MVP: Return mock event
    // In production, this would create actual calendar event
    const newEvent: CalendarEvent = {
      id: `event_${Date.now()}`,
      ...event,
    }
    
    console.log('Calendar event created:', newEvent)
    return newEvent
  }

  // Update an existing calendar event
  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    // MVP: Return updated event
    // In production, this would update actual calendar event
    const updatedEvent: CalendarEvent = {
      id: eventId,
      summary: updates.summary || 'Appointment',
      start: updates.start || new Date(),
      end: updates.end || new Date(),
      ...updates,
    }
    
    console.log('Calendar event updated:', updatedEvent)
    return updatedEvent
  }

  // Delete a calendar event
  async deleteEvent(eventId: string): Promise<boolean> {
    // MVP: Return success
    // In production, this would delete actual calendar event
    console.log('Calendar event deleted:', eventId)
    return true
  }

  // Get business hours for a date range (default: 9 AM - 5 PM, Mon-Fri)
  private getBusinessHours(startDate: Date, endDate: Date): CalendarAvailability[] {
    const availability: CalendarAvailability[] = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()
      
      // Monday = 1, Tuesday = 2, ..., Friday = 5
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Add business hours for this day
        const dayStart = new Date(currentDate)
        dayStart.setHours(9, 0, 0, 0)
        
        const dayEnd = new Date(currentDate)
        dayEnd.setHours(17, 0, 0, 0)
        
        availability.push({
          start: dayStart,
          end: dayEnd,
          available: true,
        })
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return availability
  }
}

// Calendar sync utilities
export const calendarUtils = {
  // Convert appointment to calendar event
  appointmentToEvent: (appointment: Record<string, unknown>, pets: Record<string, unknown>[], owner: Record<string, unknown>) => {
    const petNames = pets.map(pet => (pet as { name: string }).name).join(', ')
    return {
      summary: `Grooming: ${petNames}`,
      description: `Appointment for ${petNames} with ${(owner as { name: string }).name}`,
      start: new Date(appointment.start_at as string),
      end: new Date(appointment.end_at as string),
      location: (appointment.location as { address?: string })?.address || 'Grooming Salon',
      attendees: [(owner as { email?: string }).email].filter(Boolean),
    }
  },

  // Check if time slot is available
  isTimeSlotAvailable: (slot: CalendarAvailability, duration: number): boolean => {
    const slotDuration = slot.end.getTime() - slot.start.getTime()
    const requiredDuration = duration * 60 * 1000 // Convert minutes to milliseconds
    return slotDuration >= requiredDuration
  },

  // Find next available time slot
  findNextAvailableSlot: (
    availability: CalendarAvailability[],
    duration: number,
    preferredTime?: Date
  ): CalendarAvailability | null => {
    const sortedSlots = availability
      .filter(slot => slot.available && calendarUtils.isTimeSlotAvailable(slot, duration))
      .sort((a, b) => a.start.getTime() - b.start.getTime())

    if (preferredTime) {
      // Find slot that includes preferred time
      const preferredSlot = sortedSlots.find(slot => 
        slot.start <= preferredTime && slot.end >= preferredTime
      )
      if (preferredSlot) return preferredSlot
    }

    return sortedSlots[0] || null
  },
}

// Export default calendar service factory
export const createCalendarService = (config: CalendarSyncConfig) => {
  return new CalendarService(config)
}
