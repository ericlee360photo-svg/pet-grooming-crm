'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface Salon {
  id: string
  name: string
  address: string
  phone: string
  email: string
  logo?: string
  services: Service[]
  groomers: Groomer[]
  businessHours: BusinessHours
}

interface Service {
  id: number
  name: string
  description: string
  duration: number
  price: number
  category: string
  isActive: boolean
}

interface Groomer {
  id: number
  name: string
  specialties: string[]
  availability: string[]
}

interface BusinessHours {
  monday: { open: string; close: string }
  tuesday: { open: string; close: string }
  wednesday: { open: string; close: string }
  thursday: { open: string; close: string }
  friday: { open: string; close: string }
  saturday: { open: string; close: string }
  sunday: { open: string; close: string }
}

interface AppointmentSlot {
  time: string
  available: boolean
  groomer?: string
}

export default function SalonSchedulePage() {
  const params = useParams()
  const salonId = params.salonId as string
  
  const [salon, setSalon] = useState<Salon | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [selectedGroomer, setSelectedGroomer] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    petName: '',
    petBreed: '',
    petAge: '',
    notes: ''
  })
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([])
  const [step, setStep] = useState(1)

  // Mock salon data - in real app, this would come from API
  const mockSalon: Salon = {
    id: salonId,
    name: 'Pawsome Grooming',
    address: '123 Bark Street, Dogtown, CA 90210',
    phone: '(555) 123-4567',
    email: 'hello@pawsomegrooming.com',
    logo: '/barkbook-logo.svg',
    services: [
      { id: 1, name: 'Full Groom', description: 'Complete grooming service', duration: 90, price: 75, category: 'Full Service', isActive: true },
      { id: 2, name: 'Bath & Trim', description: 'Bath and basic trim', duration: 60, price: 55, category: 'Basic Service', isActive: true },
      { id: 3, name: 'Nail Trim', description: 'Nail trimming only', duration: 15, price: 20, category: 'Quick Service', isActive: true },
      { id: 4, name: 'Puppy Groom', description: 'Specialized puppy grooming', duration: 45, price: 45, category: 'Specialty', isActive: true }
    ],
    groomers: [
      { id: 1, name: 'Emma Wilson', specialties: ['Poodles', 'Terriers'], availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
      { id: 2, name: 'Alex Johnson', specialties: ['Golden Retrievers', 'Labradors'], availability: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] }
    ],
    businessHours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '09:00', close: '16:00' },
      sunday: { open: '10:00', close: '15:00' }
    }
  }

  useEffect(() => {
    // Simulate API call to get salon data
    setTimeout(() => {
      setSalon(mockSalon)
      setLoading(false)
    }, 1000)
  }, [salonId])

  useEffect(() => {
    if (selectedDate && selectedService && selectedGroomer) {
      generateAvailableSlots()
    }
  }, [selectedDate, selectedService, selectedGroomer])

  const generateAvailableSlots = () => {
    const slots: AppointmentSlot[] = []
    const selectedServiceData = salon?.services.find(s => s.id.toString() === selectedService)
    
    if (!selectedServiceData) return

    // Generate slots from 9 AM to 5 PM
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        
        // Mock availability - in real app, this would check actual bookings
        const available = Math.random() > 0.3 // 70% chance of being available
        
        slots.push({
          time,
          available,
          groomer: selectedGroomer
        })
      }
    }
    
    setAvailableSlots(slots)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      if (selectedService && selectedGroomer && selectedDate) {
        setStep(2)
      }
    } else if (step === 2) {
      if (selectedTime) {
        setStep(3)
      }
    } else if (step === 3) {
      // Submit booking
      alert(`🎉 Appointment Booked!\n\nThank you for booking with ${salon?.name}!\n\nDetails:\n- Service: ${salon?.services.find(s => s.id.toString() === selectedService)?.name}\n- Date: ${selectedDate}\n- Time: ${selectedTime}\n- Pet: ${clientInfo.petName}\n\nYou'll receive a confirmation email shortly.`)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading salon information...</p>
        </div>
      </div>
    )
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Salon Not Found</h1>
          <p className="text-gray-600">The salon you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            {salon.logo && (
              <img src={salon.logo} alt={salon.name} className="h-12 w-12" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{salon.name}</h1>
              <p className="text-gray-600">{salon.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-coral-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-coral-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-8 text-sm text-gray-600 mb-8">
          <span className={step >= 1 ? 'text-coral-600 font-medium' : ''}>Select Service</span>
          <span className={step >= 2 ? 'text-coral-600 font-medium' : ''}>Choose Time</span>
          <span className={step >= 3 ? 'text-coral-600 font-medium' : ''}>Your Details</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Your Service</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {salon.services.filter(service => service.isActive).map((service) => (
                    <div
                      key={service.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedService === service.id.toString()
                          ? 'border-coral-500 bg-coral-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedService(service.id.toString())}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <span className="text-lg font-bold text-coral-600">${service.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>⏱️ {service.duration} minutes</span>
                        <span className="mx-2">•</span>
                        <span>🏷️ {service.category}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Groomer (Optional)
                    </label>
                    <select
                      value={selectedGroomer}
                      onChange={(e) => setSelectedGroomer(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                    >
                      <option value="">Any available groomer</option>
                      {salon.groomers.map((groomer) => (
                        <option key={groomer.id} value={groomer.name}>
                          {groomer.name} - {groomer.specialties.join(', ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      min={getMinDate()}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                      required
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Step 2: Time Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Choose Your Time</h2>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </Button>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600">
                    Available times for {formatDate(selectedDate)} • {salon.services.find(s => s.id.toString() === selectedService)?.name}
                  </p>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        selectedTime === slot.time
                          ? 'bg-coral-500 text-white'
                          : slot.available
                          ? 'bg-white border border-gray-200 hover:border-coral-300 hover:bg-coral-50'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>

                {availableSlots.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No available slots for the selected date. Please choose a different date.
                  </p>
                )}
              </Card>
            </div>
          )}

          {/* Step 3: Client Information */}
          {step === 3 && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Your Information</h2>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    ← Back
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <Input
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pet Name *
                    </label>
                    <Input
                      value={clientInfo.petName}
                      onChange={(e) => setClientInfo({...clientInfo, petName: e.target.value})}
                      placeholder="Buddy"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pet Breed
                    </label>
                    <Input
                      value={clientInfo.petBreed}
                      onChange={(e) => setClientInfo({...clientInfo, petBreed: e.target.value})}
                      placeholder="Golden Retriever"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pet Age
                    </label>
                    <Input
                      value={clientInfo.petAge}
                      onChange={(e) => setClientInfo({...clientInfo, petAge: e.target.value})}
                      placeholder="3 years"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Notes
                  </label>
                  <textarea
                    value={clientInfo.notes}
                    onChange={(e) => setClientInfo({...clientInfo, notes: e.target.value})}
                    placeholder="Any special instructions or notes about your pet..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
                    rows={3}
                  />
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Appointment Summary</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Service:</strong> {salon.services.find(s => s.id.toString() === selectedService)?.name}</p>
                    <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                    <p><strong>Time:</strong> {selectedTime}</p>
                    <p><strong>Pet:</strong> {clientInfo.petName}</p>
                    <p><strong>Total:</strong> ${salon.services.find(s => s.id.toString() === selectedService)?.price}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                ← Back
              </Button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <Button
                  type="submit"
                  disabled={
                    (step === 1 && (!selectedService || !selectedDate)) ||
                    (step === 2 && !selectedTime)
                  }
                >
                  Continue →
                </Button>
              ) : (
                <Button type="submit">
                  Book Appointment
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Powered by BarkBook • {salon.phone} • {salon.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
