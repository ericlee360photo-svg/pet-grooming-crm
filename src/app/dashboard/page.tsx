'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Search, 
  Plus, 
  Clock, 
  BarChart3, 
  Settings,
  Home,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
  User,
  Trash2,
  Edit,
  Link
} from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('day')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState<'appointments' | 'clients' | 'payments' | 'analytics' | 'users' | 'services' | 'scheduling'>('appointments')
  const [showAddGroomerModal, setShowAddGroomerModal] = useState(false)

  // Subscription limits (this would come from the user's actual subscription)
  const subscriptionLimits = {
    starter: { groomers: 2, clients: 100, appointments: 500 },
    professional: { groomers: 5, clients: 500, appointments: 2000 },
    enterprise: { groomers: 15, clients: 2000, appointments: 10000 }
  }
  
  // Mock current subscription (this would come from the database)
  const currentSubscription = 'professional'
  const currentLimits = subscriptionLimits[currentSubscription as keyof typeof subscriptionLimits]

  // Action handlers
  const handleNewAppointment = () => {
    console.log('New Appointment button clicked!')
    alert('✅ New Appointment button is working!\n\nThis would open a form to create a new appointment')
  }

  const handleAddNewClient = () => {
    alert('Add New Client: This would open a form to add a new client')
  }

  const handleProcessPayment = () => {
    alert('Process Payment: This would open the payment processing interface')
  }

  const handleSearchRecords = () => {
    const searchTerm = prompt('Enter search term:')
    if (searchTerm) {
      alert(`Searching for: "${searchTerm}"\nThis would search clients, pets, and appointments`)
    }
  }

  const handleViewFullSchedule = () => {
    alert('View Full Schedule: This would show the complete calendar view')
  }

  const handleViewAllActivity = () => {
    alert('View All Activity: This would show the complete activity log')
  }

  const handleFilterAppointments = () => {
    setShowFilterModal(true)
    alert('Filter Appointments: This would open filter options\n\nFilter by:\n• Service type\n• Status\n• Time range\n• Client')
    setShowFilterModal(false)
  }

  const handleInstallApp = () => {
    alert('Install App: This would trigger the PWA installation')
  }

  const handleShareApp = () => {
    alert('Share App: This would open the native share dialog')
  }

  const handleAddGroomer = () => {
    // Check if we've reached the groomer limit
    if (mockGroomers.length >= currentLimits.groomers) {
      alert(`❌ Cannot add more groomers!\n\nYou've reached your limit of ${currentLimits.groomers} groomers on the ${currentSubscription} plan.\n\nUpgrade to add more groomers.`)
      return
    }

    const name = prompt('Enter groomer name:')
    if (name) {
      alert(`✅ Groomer "${name}" added successfully!\n\nThis would create a new groomer profile with scheduling capabilities.\n\nGroomers: ${mockGroomers.length + 1}/${currentLimits.groomers}`)
    }
  }

  const handleDeleteGroomer = (groomerName: string) => {
    if (confirm(`Are you sure you want to delete ${groomerName}?`)) {
      alert(`✅ Groomer "${groomerName}" deleted successfully!`)
    }
  }

  const handleViewGroomerSchedule = (groomerName: string) => {
    alert(`📅 Viewing schedule for ${groomerName}\n\nThis would show the groomer's calendar with their appointments.`)
  }

  const handleAddClient = () => {
    alert('➕ Add New Client\n\nThis would open a form to add a new client with:\n• Owner information\n• Dog details\n• Vaccination records\n• Behavior notes\n• Grooming preferences')
  }

  const handleEditClient = (clientId: number) => {
    alert(`✏️ Edit Client #${clientId}\n\nThis would open the client edit form with all current information.`)
  }

  const handleViewClientDetails = (clientId: number) => {
    alert(`👁️ View Client #${clientId} Details\n\nThis would show the full client profile with:\n• Complete medical history\n• Grooming history\n• Appointment history\n• Notes and preferences`)
  }

  const handleSendVaccineReminder = (clientId: number, clientName: string) => {
    alert(`💉 Vaccine Reminder Sent\n\nReminder sent to ${clientName} about upcoming vaccine expiration.\n\n📧 Email includes:\n• Vaccine expiration details\n• Calendar attachment (.ics file)\n• Direct link to schedule appointment\n• Optional SMS notification`)
  }

  const handleSendVisitReminder = (clientId: number, clientName: string) => {
    alert(`📅 Visit Reminder Sent\n\nReminder sent to ${clientName} about recommended visit frequency.\n\n📧 Email includes:\n• Recommended appointment date\n• Calendar attachment (.ics file)\n• One-click scheduling link\n• Optional SMS notification`)
  }

  const handleDeleteClient = (clientId: number, clientName: string) => {
    if (confirm(`Are you sure you want to delete ${clientName}?`)) {
      alert(`🗑️ Client ${clientName} deleted successfully!`)
    }
  }

  const handleAddService = () => {
    alert('➕ Add New Service\n\nThis would open a form to add a new service with:\n• Service name and description\n• Duration and pricing\n• Category and included items\n• Active/inactive status')
  }

  const handleEditService = (serviceId: number) => {
    alert(`✏️ Edit Service #${serviceId}\n\nThis would open the service edit form with all current information.`)
  }

  const handleToggleServiceStatus = (serviceId: number, serviceName: string) => {
    alert(`🔄 Service Status Updated\n\n${serviceName} status has been toggled.\n\nThis would update the service availability for booking.`)
  }

  const handleDeleteService = (serviceId: number, serviceName: string) => {
    if (confirm(`Are you sure you want to delete the service "${serviceName}"?`)) {
      alert(`🗑️ Service "${serviceName}" deleted successfully!`)
    }
  }

  const handleDuplicateService = (serviceId: number, serviceName: string) => {
    alert(`📋 Service Duplicated\n\n"${serviceName}" has been duplicated as a new service.\n\nThis would create a copy for easy modification.`)
  }

  const handleGenerateSchedulingLink = () => {
    const salonId = 'pawsome-grooming' // In real app, this would be the actual salon ID
    const schedulingUrl = `${window.location.origin}/schedule/${salonId}`
    
    // Copy to clipboard
    navigator.clipboard.writeText(schedulingUrl).then(() => {
      alert(`🔗 Scheduling Link Generated!\n\nYour client scheduling link has been copied to clipboard:\n\n${schedulingUrl}\n\nYou can now share this link with your clients via email, SMS, or social media.`)
    }).catch(() => {
      alert(`🔗 Scheduling Link Generated!\n\nYour client scheduling link:\n\n${schedulingUrl}\n\nPlease copy this link and share it with your clients.`)
    })
  }

  const handleAppointmentCheckIn = (appointmentId: number, petName: string) => {
    alert(`✅ Checked In\n\n${petName} has been checked in for their appointment.\n\nThis would update the appointment status and notify the groomer.`)
  }

  const handleAppointmentCancel = (appointmentId: number, petName: string) => {
    if (confirm(`Are you sure you want to cancel ${petName}'s appointment?`)) {
      alert(`❌ Appointment Cancelled\n\n${petName}'s appointment has been cancelled.\n\nThis would send a cancellation email to the client and update the schedule.`)
    }
  }

  const handleAppointmentNoShow = (appointmentId: number, petName: string) => {
    if (confirm(`Mark ${petName} as a no-show?`)) {
      alert(`🚫 No-Show Recorded\n\n${petName} has been marked as a no-show.\n\nThis would update the appointment status and may trigger a no-show fee.`)
    }
  }

  const handleAppointmentDone = (appointmentId: number, petName: string) => {
    alert(`✅ Appointment Completed\n\n${petName}'s appointment has been completed.\n\nThis would update the appointment status and trigger payment processing.`)
  }

  const generateCalendarEvent = (type: 'vaccine' | 'visit', client: any) => {
    const now = new Date()
    // Use the first dog's data for the calendar event
    const dog = client.dogs[0]
    if (!dog) return ''
    
    const eventDate = type === 'vaccine' 
      ? new Date(dog.vaccineExpiration)
      : new Date(dog.nextRecommendedVisit)
    
    const eventTitle = type === 'vaccine' 
      ? `Vaccine Due - ${dog.name}`
      : `Grooming Appointment - ${dog.name}`
    
    const eventDescription = type === 'vaccine'
      ? `${dog.name}'s vaccines are due for renewal. Please contact BarkBook to schedule an appointment.`
      : `Time for ${dog.name}'s regular grooming appointment. Recommended every ${dog.recommendedFrequency} weeks.`
    
    // Generate .ics file content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//BarkBook//Pet Grooming CRM//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${client.id}-${type}-${Date.now()}@barkbook.com`,
      `DTSTAMP:${now.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:${eventDescription}`,
      `LOCATION:BarkBook Pet Grooming`,
      `ORGANIZER;CN=BarkBook:mailto:noreply@barkbook.com`,
      `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${client.ownerEmail}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')
    
    return icsContent
  }

  const handleSendCalendarInvite = (clientId: number, clientName: string, type: 'vaccine' | 'visit') => {
    const client = mockClients.find(c => c.id === clientId)
    if (!client || client.dogs.length === 0) return
    
    // Use the first dog's name for the filename, or client name if no dogs
    const dogName = client.dogs[0]?.name || client.ownerName
    
    const icsContent = generateCalendarEvent(type, client)
    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${dogName}-${type}-reminder.ics`
    link.click()
    
    URL.revokeObjectURL(url)
    
    alert(`📅 Calendar Invite Generated\n\nCalendar file (.ics) created for ${clientName}.\n\nThis would be automatically attached to the email notification.`)
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (calendarView === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
    }
    return slots
  }

  const mockAppointments = [
    { id: 1, time: '09:00', petName: 'Buddy', ownerName: 'Sarah Johnson', service: 'Full Groom', status: 'confirmed', groomer: 'Emma Wilson' },
    { id: 2, time: '10:30', petName: 'Luna', ownerName: 'Mike Chen', service: 'Bath & Trim', status: 'confirmed', groomer: 'Alex Johnson' },
    { id: 3, time: '14:00', petName: 'Max', ownerName: 'Emily Davis', service: 'Full Groom', status: 'pending', groomer: 'Emma Wilson' },
    { id: 4, time: '15:30', petName: 'Bella', ownerName: 'David Wilson', service: 'Nail Trim', status: 'confirmed', groomer: 'Alex Johnson' },
  ]

  const mockGroomers = [
    { id: 1, name: 'Emma Wilson', email: 'emma@barkbook.com', phone: '(555) 123-4567', status: 'active', appointmentsToday: 4 },
    { id: 2, name: 'Alex Johnson', email: 'alex@barkbook.com', phone: '(555) 234-5678', status: 'active', appointmentsToday: 3 },
    { id: 3, name: 'Sarah Davis', email: 'sarah@barkbook.com', phone: '(555) 345-6789', status: 'off', appointmentsToday: 0 },
  ]

  const mockServices = [
    {
      id: 1,
      name: 'Full Groom',
      description: 'Complete grooming service including bath, brush, trim, and nail clipping',
      duration: 90, // minutes
      price: 75.00,
      category: 'Full Service',
      isActive: true,
      includes: ['Bath & Blow Dry', 'Brushing & Detangling', 'Haircut & Trim', 'Nail Clipping', 'Ear Cleaning', 'Sanitary Trim']
    },
    {
      id: 2,
      name: 'Bath & Trim',
      description: 'Bath, brush, and light trim without full haircut',
      duration: 60,
      price: 55.00,
      category: 'Basic Service',
      isActive: true,
      includes: ['Bath & Blow Dry', 'Brushing & Detangling', 'Light Trim', 'Nail Clipping']
    },
    {
      id: 3,
      name: 'Nail Trim Only',
      description: 'Nail clipping and filing service',
      duration: 15,
      price: 15.00,
      category: 'Quick Service',
      isActive: true,
      includes: ['Nail Clipping', 'Nail Filing']
    },
    {
      id: 4,
      name: 'Puppy First Groom',
      description: 'Gentle introduction to grooming for puppies under 6 months',
      duration: 45,
      price: 45.00,
      category: 'Specialty',
      isActive: true,
      includes: ['Gentle Bath', 'Light Brushing', 'Nail Clipping', 'Positive Reinforcement']
    },
    {
      id: 5,
      name: 'De-Shedding Treatment',
      description: 'Specialized treatment for heavy shedding breeds',
      duration: 75,
      price: 65.00,
      category: 'Specialty',
      isActive: true,
      includes: ['De-shedding Bath', 'Specialized Brushing', 'Undercoat Removal', 'Conditioning Treatment']
    },
    {
      id: 6,
      name: 'Flea & Tick Treatment',
      description: 'Flea and tick removal with medicated bath',
      duration: 60,
      price: 40.00,
      category: 'Medical',
      isActive: true,
      includes: ['Medicated Bath', 'Flea Combing', 'Tick Removal', 'Prevention Application']
    }
  ]

  const mockClients = [
    {
      id: 1,
      ownerName: 'Sarah Johnson',
      ownerEmail: 'sarah.johnson@email.com',
      ownerPhone: '(555) 123-4567',
      address: '123 Main St, Anytown, CA 90210',
      notes: 'Prefers morning appointments, has a fenced yard',
      status: 'active',
      dogs: [
        {
          id: 1,
          name: 'Buddy',
          breed: 'Golden Retriever',
          age: 3,
          lastVaccinations: '2024-01-15',
          vaccineExpiration: '2025-01-15',
          behaviorNotes: 'Very friendly, loves treats, can be anxious with loud noises',
          groomingNotes: 'Prefers gentle brushing, sensitive around ears, needs regular nail trims',
          recommendedFrequency: 6, // weeks
          lastVisit: '2024-08-01',
          nextRecommendedVisit: '2024-09-12',
          specialNeeds: 'None',
          status: 'active'
        },
        {
          id: 2,
          name: 'Daisy',
          breed: 'Golden Retriever',
          age: 1,
          lastVaccinations: '2024-03-20',
          vaccineExpiration: '2025-03-20',
          behaviorNotes: 'Young and energetic, still learning, follows Buddy around',
          groomingNotes: 'Puppy coat, gentle introduction to grooming, frequent treats needed',
          recommendedFrequency: 4, // weeks
          lastVisit: '2024-08-10',
          nextRecommendedVisit: '2024-09-07',
          specialNeeds: 'Puppy training',
          status: 'active'
        }
      ]
    },
    {
      id: 2,
      ownerName: 'Mike Chen',
      ownerEmail: 'mike.chen@email.com',
      ownerPhone: '(555) 234-5678',
      address: '456 Oak Ave, Somewhere, CA 90211',
      notes: 'Works from home, flexible scheduling',
      status: 'active',
      dogs: [
        {
          id: 3,
          name: 'Luna',
          breed: 'Husky',
          age: 2,
          lastVaccinations: '2024-02-20',
          vaccineExpiration: '2025-02-20',
          behaviorNotes: 'High energy, loves to play, good with other dogs',
          groomingNotes: 'Heavy shedder, needs frequent brushing, double coat maintenance',
          recommendedFrequency: 4, // weeks
          lastVisit: '2024-08-15',
          nextRecommendedVisit: '2024-09-12',
          specialNeeds: 'High energy management',
          status: 'active'
        }
      ]
    },
    {
      id: 3,
      ownerName: 'Emily Davis',
      ownerEmail: 'emily.davis@email.com',
      ownerPhone: '(555) 345-6789',
      address: '789 Pine St, Elsewhere, CA 90212',
      notes: 'Allergic to certain shampoos, prefers hypoallergenic products',
      status: 'active',
      dogs: [
        {
          id: 4,
          name: 'Max',
          breed: 'Poodle',
          age: 5,
          lastVaccinations: '2024-03-10',
          vaccineExpiration: '2025-03-10',
          behaviorNotes: 'Well-behaved, responds well to commands, can be shy initially',
          groomingNotes: 'Requires professional grooming every 6-8 weeks, hypoallergenic coat',
          recommendedFrequency: 8, // weeks
          lastVisit: '2024-07-20',
          nextRecommendedVisit: '2024-09-17',
          specialNeeds: 'Hypoallergenic products only',
          status: 'active'
        },
        {
          id: 5,
          name: 'Sophie',
          breed: 'Poodle Mix',
          age: 3,
          lastVaccinations: '2024-04-15',
          vaccineExpiration: '2025-04-15',
          behaviorNotes: 'Playful and social, loves attention, good with children',
          groomingNotes: 'Curly coat, regular trimming needed, hypoallergenic products',
          recommendedFrequency: 6, // weeks
          lastVisit: '2024-08-05',
          nextRecommendedVisit: '2024-09-16',
          specialNeeds: 'Hypoallergenic products only',
          status: 'active'
        }
      ]
    },
    {
      id: 4,
      ownerName: 'David Wilson',
      ownerEmail: 'david.wilson@email.com',
      ownerPhone: '(555) 456-7890',
      address: '321 Elm St, Nowhere, CA 90213',
      notes: 'New client, first-time dog owner',
      status: 'active',
      dogs: [
        {
          id: 6,
          name: 'Bella',
          breed: 'Labrador Retriever',
          age: 1,
          lastVaccinations: '2024-04-05',
          vaccineExpiration: '2025-04-05',
          behaviorNotes: 'Puppy energy, learning basic commands, loves water',
          groomingNotes: 'Short coat, easy maintenance, regular bathing needed',
          recommendedFrequency: 4, // weeks
          lastVisit: '2024-08-10',
          nextRecommendedVisit: '2024-09-07',
          specialNeeds: 'Puppy training, first-time owner guidance',
          status: 'active'
        }
      ]
    }
  ]

  const navItems = [
    { icon: Calendar, label: 'Appointments', id: 'appointments' },
    { icon: Users, label: 'Clients', id: 'clients' },
    { icon: DollarSign, label: 'Services', id: 'services' },
    { icon: DollarSign, label: 'Payments', id: 'payments' },
    { icon: BarChart3, label: 'Analytics', id: 'analytics' },
    { icon: User, label: 'Users', id: 'users' },
    { icon: Link, label: 'Client Scheduling', id: 'scheduling' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="relative rounded-lg overflow-hidden h-10 w-10">
                <div className="absolute inset-0 bg-gradient-to-b from-cream-100 to-accent-500"></div>
                <svg viewBox="0 0 24 24" fill="none" className="absolute inset-0 w-full h-full">
                  <path d="M6 8C6 6.89543 6.89543 6 8 6H16C17.1046 6 18 6.89543 18 8V12C18 13.1046 17.1046 14 16 14H8C6.89543 14 6 13.1046 6 12V8Z" fill="#19253d"></path>
                  <path d="M7 7C7 6.44772 7.44772 6 8 6H9C9.55228 6 10 6.44772 10 7V9C10 9.55228 9.55228 10 9 10H8C7.44772 10 7 9.55228 7 9V7Z" fill="#19253d"></path>
                  <path d="M7.5 7.5C7.5 7.22386 7.72386 7 8 7H8.5C8.77614 7 9 7.22386 9 7.5V8.5C9 8.77614 8.77614 9 8.5 9H8C7.72386 9 7.5 8.77614 7.5 8.5V7.5Z" fill="#f8eee4"></path>
                  <path d="M10 10C10 9.44772 10.4477 9 11 9H13C13.5523 9 14 9.44772 14 10V12C14 12.5523 13.5523 13 13 13H11C10.4477 13 10 12.5523 10 12V10Z" fill="#19253d"></path>
                  <circle cx="9" cy="10" r="0.5" fill="#f8eee4"></circle>
                  <circle cx="15" cy="10" r="0.5" fill="#f8eee4"></circle>
                </svg>
              </div>
              <span className="font-bold text-primary text-2xl">BarkBook</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button size="sm" onClick={handleNewAppointment}>
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">New Appointment</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Navigation Sidebar */}
        <nav className="w-64 bg-white border-r min-h-screen">
          <div className="p-4">
                         <div className="space-y-2">
               {navItems.map((item, index) => (
                 <button
                   key={index}
                   onClick={() => setActiveTab(item.id as any)}
                   className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                     activeTab === item.id
                       ? 'bg-primary text-primary-foreground' 
                       : 'text-gray-700 hover:bg-gray-100'
                   }`}
                 >
                   <item.icon className="h-5 w-5" />
                   <span className="font-medium">{item.label}</span>
                 </button>
               ))}
             </div>
            
            {/* Quick Actions Section */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={handleNewAppointment}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={handleAddNewClient}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={handleProcessPayment}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Process Payment
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={handleSearchRecords}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Records
                </Button>
              </div>
            </div>
          </div>
        </nav>

                 {/* Main Content Area */}
         <main className="flex-1 p-6">
           {activeTab === 'appointments' && (
             <>
               {/* Calendar Header */}
               <div className="mb-6">
                 <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center space-x-4">
                     <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateDate('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateDate('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-lg font-medium text-gray-700">
                  {formatDate(currentDate)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={calendarView === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCalendarView('day')}
                >
                  Day
                </Button>
                <Button
                  variant={calendarView === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCalendarView('week')}
                >
                  Week
                </Button>
                <Button
                  variant={calendarView === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCalendarView('month')}
                >
                  Month
                </Button>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          <div className="bg-white rounded-lg border shadow-sm">
            {calendarView === 'day' && (
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  {getTimeSlots().map((time) => {
                    const appointment = mockAppointments.find(apt => apt.time === time)
                    return (
                      <div key={time} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                        <div className="w-20 text-sm font-medium text-gray-500">
                          {time}
                        </div>
                        <div className="flex-1">
                                                     {appointment ? (
                             <div className="flex items-center justify-between">
                               <div>
                                 <div className="font-medium text-gray-900">{appointment.petName}</div>
                                 <div className="text-sm text-gray-500">{appointment.ownerName} • {appointment.service}</div>
                                 <div className="text-xs text-blue-600">👤 {appointment.groomer}</div>
                               </div>
                               <div className="flex items-center space-x-2">
                                 <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                   appointment.status === 'confirmed' 
                                     ? 'bg-green-100 text-green-800' 
                                     : appointment.status === 'checked-in'
                                     ? 'bg-blue-100 text-blue-800'
                                     : appointment.status === 'completed'
                                     ? 'bg-purple-100 text-purple-800'
                                     : appointment.status === 'cancelled'
                                     ? 'bg-red-100 text-red-800'
                                     : appointment.status === 'no-show'
                                     ? 'bg-gray-100 text-gray-800'
                                     : 'bg-yellow-100 text-yellow-800'
                                 }`}>
                                   {appointment.status}
                                 </div>
                                 
                                 {/* Status Management Buttons */}
                                 <div className="flex space-x-1">
                                   {appointment.status === 'confirmed' && (
                                     <Button
                                       size="sm"
                                       variant="outline"
                                       className="h-6 px-2 text-xs bg-green-50 hover:bg-green-100"
                                       onClick={() => handleAppointmentCheckIn(appointment.id, appointment.petName)}
                                     >
                                       ✅
                                     </Button>
                                   )}
                                   
                                   {appointment.status === 'checked-in' && (
                                     <Button
                                       size="sm"
                                       variant="outline"
                                       className="h-6 px-2 text-xs bg-purple-50 hover:bg-purple-100"
                                       onClick={() => handleAppointmentDone(appointment.id, appointment.petName)}
                                     >
                                       ✅ Done
                                     </Button>
                                   )}
                                   
                                   {(appointment.status === 'confirmed' || appointment.status === 'checked-in') && (
                                     <>
                                       <Button
                                         size="sm"
                                         variant="outline"
                                         className="h-6 px-2 text-xs bg-red-50 hover:bg-red-100"
                                         onClick={() => handleAppointmentCancel(appointment.id, appointment.petName)}
                                       >
                                         ❌
                                       </Button>
                                       <Button
                                         size="sm"
                                         variant="outline"
                                         className="h-6 px-2 text-xs bg-gray-50 hover:bg-gray-100"
                                         onClick={() => handleAppointmentNoShow(appointment.id, appointment.petName)}
                                       >
                                         🚫
                                       </Button>
                                     </>
                                   )}
                                 </div>
                               </div>
                             </div>
                           ) : (
                            <div className="text-gray-400 text-sm">No appointments</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {calendarView === 'week' && (
              <div className="p-6">
                <div className="text-center text-gray-500 py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Weekly view coming soon...</p>
                </div>
              </div>
            )}

            {calendarView === 'month' && (
              <div className="p-6">
                <div className="text-center text-gray-500 py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Monthly view coming soon...</p>
                </div>
              </div>
                         )}
           </div>
             </>
           )}

           {activeTab === 'users' && (
             <div>
               <div className="mb-6">
                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h1 className="text-2xl font-bold text-gray-900">Users & Groomers</h1>
                     <p className="text-sm text-gray-500 mt-1">
                       {mockGroomers.length} of {currentLimits.groomers} groomers used • {currentSubscription.charAt(0).toUpperCase() + currentSubscription.slice(1)} Plan
                     </p>
                   </div>
                   <Button 
                     onClick={handleAddGroomer}
                     disabled={mockGroomers.length >= currentLimits.groomers}
                   >
                     <Plus className="h-4 w-4 mr-2" />
                     Add Groomer
                   </Button>
                 </div>
               </div>

               <div className="bg-white rounded-lg border shadow-sm">
                 <div className="p-6">
                   {/* Subscription Usage Bar */}
                   <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                     <div className="flex items-center justify-between mb-2">
                       <span className="text-sm font-medium text-gray-700">Groomer Usage</span>
                       <span className="text-sm text-gray-500">{mockGroomers.length}/{currentLimits.groomers}</span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-2">
                       <div 
                         className={`h-2 rounded-full transition-all duration-300 ${
                           mockGroomers.length / currentLimits.groomers >= 0.8 
                             ? 'bg-red-500' 
                             : mockGroomers.length / currentLimits.groomers >= 0.6 
                             ? 'bg-yellow-500' 
                             : 'bg-green-500'
                         }`}
                         style={{ width: `${(mockGroomers.length / currentLimits.groomers) * 100}%` }}
                       ></div>
                     </div>
                     {mockGroomers.length >= currentLimits.groomers && (
                       <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                         <p className="text-sm text-blue-800">
                           <strong>Limit reached!</strong> Upgrade your plan to add more groomers.
                         </p>
                       </div>
                     )}
                   </div>
                   
                   <div className="grid grid-cols-1 gap-4">
                     {mockGroomers.map((groomer) => (
                       <div key={groomer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                         <div className="flex items-center space-x-4">
                           <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                             <span className="text-white font-medium">
                               {groomer.name.split(' ').map(n => n[0]).join('')}
                             </span>
                           </div>
                           <div>
                             <div className="font-medium text-gray-900">{groomer.name}</div>
                             <div className="text-sm text-gray-500">{groomer.email}</div>
                             <div className="text-sm text-gray-500">{groomer.phone}</div>
                           </div>
                         </div>
                         <div className="flex items-center space-x-2">
                           <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                             groomer.status === 'active' 
                               ? 'bg-green-100 text-green-800' 
                               : 'bg-gray-100 text-gray-800'
                           }`}>
                             {groomer.status === 'active' ? 'Active' : 'Off'}
                           </div>
                           <div className="text-sm text-gray-500">
                             {groomer.appointmentsToday} appointments today
                           </div>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => handleViewGroomerSchedule(groomer.name)}
                           >
                             <Calendar className="h-4 w-4 mr-1" />
                             Schedule
                           </Button>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => handleDeleteGroomer(groomer.name)}
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'clients' && (
             <div>
               <div className="mb-6">
                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
                     <p className="text-sm text-gray-500 mt-1">
                       {mockClients.length} clients • Manage pet profiles, vaccinations, and grooming schedules
                     </p>
                   </div>
                   <Button onClick={handleAddClient}>
                     <Plus className="h-4 w-4 mr-2" />
                     Add Client
                   </Button>
                 </div>
               </div>

               <div className="bg-white rounded-lg border shadow-sm">
                 <div className="p-6">
                   <div className="grid grid-cols-1 gap-4">
                     {mockClients.map((client) => {
                       // Get the first dog for display purposes
                       const primaryDog = client.dogs[0]
                       if (!primaryDog) return null
                       
                       const vaccineExpirationDate = new Date(primaryDog.vaccineExpiration)
                       const nextVisitDate = new Date(primaryDog.nextRecommendedVisit)
                       const today = new Date()
                       const daysUntilVaccineExpiry = Math.ceil((vaccineExpirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                       const daysUntilNextVisit = Math.ceil((nextVisitDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                       
                       return (
                         <div key={client.id} className="border rounded-lg p-4 hover:bg-gray-50">
                           <div className="flex items-start justify-between">
                             <div className="flex-1">
                               <div className="flex items-center space-x-3 mb-3">
                                 <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                                   <span className="text-white font-medium text-lg">
                                     {primaryDog.name.charAt(0)}
                                   </span>
                                 </div>
                                 <div>
                                   <h3 className="text-lg font-semibold text-gray-900">{primaryDog.name}</h3>
                                   <p className="text-sm text-gray-500">{client.ownerName} • {primaryDog.breed}</p>
                                   <p className="text-xs text-gray-400">{primaryDog.age} years old</p>
                                   {client.dogs.length > 1 && (
                                     <p className="text-xs text-blue-600 font-medium">+{client.dogs.length - 1} more dogs</p>
                                   )}
                                 </div>
                               </div>
                               
                               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                 <div>
                                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</p>
                                   <p className="text-sm text-gray-900">{client.ownerEmail}</p>
                                   <p className="text-sm text-gray-600">{client.ownerPhone}</p>
                                 </div>
                                 <div>
                                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Vaccinations</p>
                                   <p className="text-sm text-gray-900">Expires: {new Date(primaryDog.vaccineExpiration).toLocaleDateString()}</p>
                                   <p className={`text-xs ${daysUntilVaccineExpiry <= 30 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                     {daysUntilVaccineExpiry > 0 ? `${daysUntilVaccineExpiry} days left` : 'Expired'}
                                   </p>
                                   {daysUntilVaccineExpiry <= 30 && (
                                     <p className="text-xs text-blue-600 font-medium">📅 Calendar invite available</p>
                                   )}
                                 </div>
                                 <div>
                                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Next Visit</p>
                                   <p className="text-sm text-gray-900">{new Date(primaryDog.nextRecommendedVisit).toLocaleDateString()}</p>
                                   <p className={`text-xs ${daysUntilNextVisit <= 7 ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                                     {daysUntilNextVisit > 0 ? `${daysUntilNextVisit} days away` : 'Overdue'}
                                   </p>
                                   {daysUntilNextVisit <= 7 && (
                                     <p className="text-xs text-blue-600 font-medium">📅 Calendar invite available</p>
                                   )}
                                 </div>
                                 <div>
                                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Frequency</p>
                                   <p className="text-sm text-gray-900">Every {primaryDog.recommendedFrequency} weeks</p>
                                   <p className="text-xs text-gray-500">Last: {new Date(primaryDog.lastVisit).toLocaleDateString()}</p>
                                 </div>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                 <div>
                                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Behavior Notes</p>
                                   <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{primaryDog.behaviorNotes}</p>
                                 </div>
                                 <div>
                                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Grooming Notes (Staff Only)</p>
                                   <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{primaryDog.groomingNotes}</p>
                                 </div>
                               </div>
                             </div>
                             
                             <div className="flex flex-col space-y-2 ml-4">
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => handleViewClientDetails(client.id)}
                               >
                                 <Search className="h-4 w-4 mr-1" />
                                 View
                               </Button>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => handleEditClient(client.id)}
                               >
                                 <Edit className="h-4 w-4 mr-1" />
                                 Edit
                               </Button>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => handleSendVaccineReminder(client.id, client.ownerName)}
                                 disabled={daysUntilVaccineExpiry > 30}
                               >
                                 💉 Vaccine
                               </Button>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => handleSendVisitReminder(client.id, client.ownerName)}
                                 disabled={daysUntilNextVisit > 7}
                               >
                                 📅 Visit
                               </Button>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => handleSendCalendarInvite(client.id, client.ownerName, 'vaccine')}
                                 disabled={daysUntilVaccineExpiry > 30}
                               >
                                 📅 Vaccine Calendar
                               </Button>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => handleSendCalendarInvite(client.id, client.ownerName, 'visit')}
                                 disabled={daysUntilNextVisit > 7}
                               >
                                 📅 Visit Calendar
                               </Button>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => handleDeleteClient(client.id, client.ownerName)}
                               >
                                 <Trash2 className="h-4 w-4" />
                               </Button>
                             </div>
                           </div>
                         </div>
                       )
                     })}
                   </div>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'services' && (
             <div>
               <div className="mb-6">
                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h1 className="text-2xl font-bold text-gray-900">Services & Pricing</h1>
                     <p className="text-sm text-gray-500 mt-1">
                       {mockServices.length} services • Manage your service offerings and pricing
                     </p>
                   </div>
                   <Button onClick={handleAddService}>
                     <Plus className="h-4 w-4 mr-2" />
                     Add Service
                   </Button>
                 </div>
               </div>

               <div className="bg-white rounded-lg border shadow-sm">
                 <div className="p-6">
                   <div className="grid grid-cols-1 gap-4">
                     {mockServices.map((service) => (
                       <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50">
                         <div className="flex items-start justify-between">
                           <div className="flex-1">
                             <div className="flex items-center space-x-3 mb-3">
                               <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                 service.isActive ? 'bg-green-100' : 'bg-gray-100'
                               }`}>
                                 <span className={`text-lg font-medium ${
                                   service.isActive ? 'text-green-600' : 'text-gray-400'
                                 }`}>
                                   💇
                                 </span>
                               </div>
                               <div>
                                 <div className="flex items-center space-x-2">
                                   <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                     service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                   }`}>
                                     {service.isActive ? 'Active' : 'Inactive'}
                                   </span>
                                   <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                     {service.category}
                                   </span>
                                 </div>
                                 <p className="text-sm text-gray-500">{service.description}</p>
                               </div>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                               <div>
                                 <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pricing</p>
                                 <p className="text-2xl font-bold text-gray-900">${service.price.toFixed(2)}</p>
                                 <p className="text-sm text-gray-500">{service.duration} minutes</p>
                               </div>
                               <div>
                                 <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</p>
                                 <p className="text-sm text-gray-900">{service.category}</p>
                                 <p className="text-xs text-gray-500">Service Type</p>
                               </div>
                               <div>
                                 <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Includes</p>
                                 <div className="text-sm text-gray-700">
                                   {service.includes.slice(0, 3).map((item, index) => (
                                     <div key={index} className="flex items-center">
                                       <span className="text-green-500 mr-1">✓</span>
                                       {item}
                                     </div>
                                   ))}
                                   {service.includes.length > 3 && (
                                     <p className="text-xs text-gray-500 mt-1">
                                       +{service.includes.length - 3} more items
                                     </p>
                                   )}
                                 </div>
                               </div>
                             </div>
                           </div>
                           
                           <div className="flex flex-col space-y-2 ml-4">
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => handleEditService(service.id)}
                             >
                               <Edit className="h-4 w-4 mr-1" />
                               Edit
                             </Button>
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => handleToggleServiceStatus(service.id, service.name)}
                             >
                               {service.isActive ? '🔄 Deactivate' : '🔄 Activate'}
                             </Button>
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => handleDuplicateService(service.id, service.name)}
                             >
                               📋 Duplicate
                             </Button>
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => handleDeleteService(service.id, service.name)}
                             >
                               <Trash2 className="h-4 w-4" />
                             </Button>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'payments' && (
             <div className="text-center text-gray-500 py-8">
               <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
               <p>Payments management coming soon...</p>
             </div>
           )}

           {activeTab === 'analytics' && (
             <div className="text-center text-gray-500 py-8">
               <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
               <p>Analytics dashboard coming soon...</p>
             </div>
           )}

           {activeTab === 'scheduling' && (
             <div>
               <div className="mb-6">
                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h1 className="text-2xl font-bold text-gray-900">Client Scheduling</h1>
                     <p className="text-sm text-gray-500 mt-1">
                       Share your scheduling link with clients for easy self-booking
                     </p>
                   </div>
                   <Button onClick={handleGenerateSchedulingLink}>
                     <Link className="h-4 w-4 mr-2" />
                     Generate Link
                   </Button>
                 </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Scheduling Link Card */}
                 <Card className="p-6">
                   <div className="flex items-center space-x-3 mb-4">
                     <div className="h-10 w-10 rounded-full bg-coral-100 flex items-center justify-center">
                       <Link className="h-5 w-5 text-coral-600" />
                     </div>
                     <div>
                       <h3 className="text-lg font-semibold text-gray-900">Your Scheduling Link</h3>
                       <p className="text-sm text-gray-500">Share this with your clients</p>
                     </div>
                   </div>
                   
                   <div className="bg-gray-50 rounded-lg p-4 mb-4">
                     <p className="text-sm font-mono text-gray-700 break-all">
                       {typeof window !== 'undefined' ? `${window.location.origin}/schedule/pawsome-grooming` : 'Loading...'}
                     </p>
                   </div>
                   
                   <div className="flex space-x-2">
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={handleGenerateSchedulingLink}
                     >
                       <Link className="h-4 w-4 mr-1" />
                       Copy Link
                     </Button>
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={() => {
                         const url = typeof window !== 'undefined' ? `${window.location.origin}/schedule/pawsome-grooming` : ''
                         window.open(url, '_blank')
                       }}
                     >
                       🔗 Preview
                     </Button>
                   </div>
                 </Card>

                 {/* Sharing Options Card */}
                 <Card className="p-6">
                   <div className="flex items-center space-x-3 mb-4">
                     <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                       <Users className="h-5 w-5 text-blue-600" />
                     </div>
                     <div>
                       <h3 className="text-lg font-semibold text-gray-900">Sharing Options</h3>
                       <p className="text-sm text-gray-500">Ways to share with clients</p>
                     </div>
                   </div>
                   
                   <div className="space-y-3">
                     <div className="flex items-center justify-between p-3 border rounded-lg">
                       <div className="flex items-center space-x-3">
                         <span className="text-2xl">📧</span>
                         <div>
                           <p className="font-medium text-gray-900">Email</p>
                           <p className="text-sm text-gray-500">Send via email campaign</p>
                         </div>
                       </div>
                       <Button variant="outline" size="sm">
                         Send
                       </Button>
                     </div>
                     
                     <div className="flex items-center justify-between p-3 border rounded-lg">
                       <div className="flex items-center space-x-3">
                         <span className="text-2xl">📱</span>
                         <div>
                           <p className="font-medium text-gray-900">SMS</p>
                           <p className="text-sm text-gray-500">Send via text message</p>
                         </div>
                       </div>
                       <Button variant="outline" size="sm">
                         Send
                       </Button>
                     </div>
                     
                     <div className="flex items-center justify-between p-3 border rounded-lg">
                       <div className="flex items-center space-x-3">
                         <span className="text-2xl">📋</span>
                         <div>
                           <p className="font-medium text-gray-900">QR Code</p>
                           <p className="text-sm text-gray-500">Generate QR code</p>
                         </div>
                       </div>
                       <Button variant="outline" size="sm">
                         Generate
                       </Button>
                     </div>
                   </div>
                 </Card>

                 {/* Recent Bookings Card */}
                 <Card className="p-6 lg:col-span-2">
                   <div className="flex items-center space-x-3 mb-4">
                     <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                       <Calendar className="h-5 w-5 text-green-600" />
                     </div>
                     <div>
                       <h3 className="text-lg font-semibold text-gray-900">Recent Online Bookings</h3>
                       <p className="text-sm text-gray-500">Appointments booked through your link</p>
                     </div>
                   </div>
                   
                   <div className="space-y-3">
                     <div className="flex items-center justify-between p-3 border rounded-lg">
                       <div className="flex items-center space-x-3">
                         <div className="h-8 w-8 rounded-full bg-coral-100 flex items-center justify-center">
                           <span className="text-sm font-medium text-coral-600">B</span>
                         </div>
                         <div>
                           <p className="font-medium text-gray-900">Buddy - Full Groom</p>
                           <p className="text-sm text-gray-500">Sarah Johnson • Today at 2:00 PM</p>
                         </div>
                       </div>
                       <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                         Confirmed
                       </span>
                     </div>
                     
                     <div className="flex items-center justify-between p-3 border rounded-lg">
                       <div className="flex items-center space-x-3">
                         <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                           <span className="text-sm font-medium text-blue-600">L</span>
                         </div>
                         <div>
                           <p className="font-medium text-gray-900">Luna - Bath & Trim</p>
                           <p className="text-sm text-gray-500">Mike Chen • Tomorrow at 10:30 AM</p>
                         </div>
                       </div>
                       <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                         Pending
                       </span>
                     </div>
                   </div>
                 </Card>
               </div>
             </div>
           )}
         </main>
       </div>
     </div>
   )
 }
