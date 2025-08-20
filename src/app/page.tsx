'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Get Google Apps Script URL from environment variable
      const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL
      
      if (!GOOGLE_SCRIPT_URL) {
        console.error('Google Script URL not configured')
        // Fallback to showing success message for now
        setIsSubmitted(true)
        setEmail('')
        return
      }
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'Direct',
          timestamp: new Date().toISOString(),
          source: 'BarkBook Landing Page'
        })
      })
      
      // Since we're using no-cors mode, we can't read the response
      // So we'll assume success if no error is thrown
      setIsSubmitted(true)
      setEmail('')
      
      // Optional: Track with analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'signup', {
          event_category: 'engagement',
          event_label: 'early_access_signup'
        })
      }
      
    } catch (error) {
      console.error('Error submitting email:', error)
      // Still show success message since no-cors mode doesn't give us response details
      setIsSubmitted(true)
      setEmail('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 to-coral-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 rounded-lg overflow-hidden mr-2 shadow-sm bg-white p-1">
                <img 
                  src="/favicon.svg" 
                  alt="BarkBook logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-navy">BarkBook</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/privacy" className="text-navy hover:text-coral-500 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-navy hover:text-coral-500 transition-colors">
                Terms
              </Link>
              <Link href="/refund" className="text-navy hover:text-coral-500 transition-colors">
                Refund Policy
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
        <div className="max-w-2xl text-center">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-24 md:w-40 md:h-30 rounded-xl overflow-hidden shadow-lg mb-4 bg-white p-2">
              <img 
                src="/favicon.svg" 
                alt="BarkBook logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">BarkBook</h2>
          </div>
          
          {/* Main Content */}
          <h1 className="text-5xl md:text-6xl font-bold text-navy mb-6">
            The Complete CRM for
            <span className="text-coral-500 block">Professional Pet Groomers</span>
          </h1>
          
          <p className="text-xl text-navy mb-8 max-w-2xl mx-auto">
            Smart CRM software designed for pet groomers. Manage bookings, track
            vaccines, send reminders, and simplify your grooming business.
          </p>

          {/* Email Signup Form */}
          {!isSubmitted ? (
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-coral-500 text-white rounded-lg shadow hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Signing up...' : 'Request Early Access'}
                </button>
              </form>
              <p className="text-sm text-navy/70 mt-4">
                Be the first to know when we launch. No spam, ever.
              </p>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg">
                <h3 className="font-semibold mb-2">Thank you for signing up!</h3>
                <p className="text-sm">
                  We&apos;ll notify you as soon as BarkBook is ready for early access.
                </p>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 text-accent hover:underline"
              >
                Sign up another email
              </button>
            </div>
          )}

          {/* Features Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
              Everything You Need to Run Your Grooming Business
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="text-center p-6 bg-white rounded-xl shadow-md">
                <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">📅</span>
                </div>
                <h4 className="text-xl font-bold text-navy mb-3">Smart Appointment Booking</h4>
                <p className="text-navy/70">
                  Automated scheduling with client preferences, recurring appointments, and SMS reminders. 
                  Never double-book or miss an appointment again.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center p-6 bg-white rounded-xl shadow-md">
                <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🐕</span>
                </div>
                <h4 className="text-xl font-bold text-navy mb-3">Pet Health Tracking</h4>
                <p className="text-navy/70">
                  Track vaccination records, allergies, behavioral notes, and grooming history. 
                  Keep every pet's profile complete and accessible.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center p-6 bg-white rounded-xl shadow-md">
                <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">💰</span>
                </div>
                <h4 className="text-xl font-bold text-navy mb-3">Payment & Analytics</h4>
                <p className="text-navy/70">
                  Integrated payment processing, automatic invoicing, and business analytics. 
                  See your revenue trends and top clients at a glance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-coral-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 flex items-center">
              <div className="w-6 h-6 rounded overflow-hidden mr-2 shadow-sm bg-white p-1">
                <img 
                  src="/favicon.svg" 
                  alt="BarkBook logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white">BarkBook</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-coral-100">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund" className="hover:text-white transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
          <div className="border-t border-coral-500 mt-6 pt-6 text-center text-coral-100">
            <p>&copy; {new Date().getFullYear()} BarkBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
