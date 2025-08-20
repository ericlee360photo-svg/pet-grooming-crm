'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Search,
  Filter
} from "lucide-react"
import { dateUtils, currencyUtils } from "@/lib/utils"

export default function DashboardPage() {
  const [selectedDate] = useState(new Date())

  // Mock data for demonstration
  const dashboardData = {
    todayAppointments: 8,
    completedToday: 5,
    pendingToday: 3,
    totalClients: 247,
    monthlyRevenue: 12450,
    averageAppointmentTime: 75,
    upcomingAppointments: [
      {
        id: '1',
        petName: 'Buddy',
        ownerName: 'Sarah Johnson',
        time: '09:00 AM',
        service: 'Full Groom',
        status: 'confirmed'
      },
      {
        id: '2',
        petName: 'Luna',
        ownerName: 'Mike Chen',
        time: '10:30 AM',
        service: 'Bath & Trim',
        status: 'confirmed'
      },
      {
        id: '3',
        petName: 'Max',
        ownerName: 'Emily Davis',
        time: '02:00 PM',
        service: 'Full Groom',
        status: 'pending'
      }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'appointment',
        message: 'Appointment completed for Buddy',
        time: '2 hours ago'
      },
      {
        id: '2',
        type: 'payment',
        message: 'Payment received from Sarah Johnson',
        time: '3 hours ago'
      },
      {
        id: '3',
        type: 'client',
        message: 'New client registered: Emily Davis',
        time: '1 day ago'
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="lg" />
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Today: {dateUtils.formatDate(selectedDate, 'MMM dd, yyyy')}
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.todayAppointments}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.completedToday} completed, {dashboardData.pendingToday} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                +12 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currencyUtils.formatCents(dashboardData.monthlyRevenue * 100)}</div>
              <p className="text-xs text-muted-foreground">
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Appointment Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.averageAppointmentTime} min</div>
              <p className="text-xs text-muted-foreground">
                -5 min from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today&apos;s Schedule</CardTitle>
                    <CardDescription>
                      Upcoming appointments for {dateUtils.formatDate(selectedDate, 'EEEE, MMMM dd')}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                                             <div className="flex items-center space-x-4">
                         <div className="flex-shrink-0">
                           <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center">
                             <span className="text-white text-sm font-bold">🐾</span>
                           </div>
                         </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{appointment.petName}</h4>
                          <p className="text-sm text-gray-500">{appointment.ownerName}</p>
                          <p className="text-sm text-gray-500">{appointment.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{appointment.time}</div>
                        <div className="flex items-center space-x-1">
                          {appointment.status === 'confirmed' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="text-sm text-gray-500 capitalize">{appointment.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" className="w-full">
                    View Full Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates from your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {activity.type === 'appointment' && (
                          <Calendar className="h-4 w-4 text-accent" />
                        )}
                        {activity.type === 'payment' && (
                          <DollarSign className="h-4 w-4 text-green-500" />
                        )}
                        {activity.type === 'client' && (
                          <Users className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Add New Client
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Process Payment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Search Records
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
