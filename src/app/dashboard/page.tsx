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
  Edit
} from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('day')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState<'appointments' | 'clients' | 'payments' | 'analytics' | 'users'>('appointments')
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
    { time: '09:00', petName: 'Buddy', ownerName: 'Sarah Johnson', service: 'Full Groom', status: 'confirmed', groomer: 'Emma Wilson' },
    { time: '10:30', petName: 'Luna', ownerName: 'Mike Chen', service: 'Bath & Trim', status: 'confirmed', groomer: 'Alex Johnson' },
    { time: '14:00', petName: 'Max', ownerName: 'Emily Davis', service: 'Full Groom', status: 'pending', groomer: 'Emma Wilson' },
    { time: '15:30', petName: 'Bella', ownerName: 'David Wilson', service: 'Nail Trim', status: 'confirmed', groomer: 'Alex Johnson' },
  ]

  const mockGroomers = [
    { id: 1, name: 'Emma Wilson', email: 'emma@barkbook.com', phone: '(555) 123-4567', status: 'active', appointmentsToday: 4 },
    { id: 2, name: 'Alex Johnson', email: 'alex@barkbook.com', phone: '(555) 234-5678', status: 'active', appointmentsToday: 3 },
    { id: 3, name: 'Sarah Davis', email: 'sarah@barkbook.com', phone: '(555) 345-6789', status: 'off', appointmentsToday: 0 },
  ]

  const navItems = [
    { icon: Calendar, label: 'Appointments', id: 'appointments' },
    { icon: Users, label: 'Clients', id: 'clients' },
    { icon: DollarSign, label: 'Payments', id: 'payments' },
    { icon: BarChart3, label: 'Analytics', id: 'analytics' },
    { icon: User, label: 'Users', id: 'users' },
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
                               <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 appointment.status === 'confirmed' 
                                   ? 'bg-green-100 text-green-800' 
                                   : 'bg-yellow-100 text-yellow-800'
                               }`}>
                                 {appointment.status}
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
             <div className="text-center text-gray-500 py-8">
               <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
               <p>Clients management coming soon...</p>
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
         </main>
       </div>
     </div>
   )
 }
