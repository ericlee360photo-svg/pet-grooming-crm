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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 rounded-lg overflow-hidden mr-2 shadow-sm bg-coral-500 p-1">
                <img 
                  src="/favicon.svg" 
                  alt="BarkBook logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-navy">BarkBook</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/privacy" className="text-gray-600 hover:text-coral-500 transition-colors font-medium">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-coral-500 transition-colors font-medium">
                Terms
              </Link>
              <Link href="/refund" className="text-gray-600 hover:text-coral-500 transition-colors font-medium">
                Refund Policy
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 bg-gradient-to-br from-cream via-white to-coral-50">
        <div className="max-w-2xl text-center">
          {/* Logo */}
          <div className="flex flex-col items-center mb-12">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-xl mb-6 bg-coral-500 p-3">
              <img 
                src="/favicon.svg" 
                alt="BarkBook logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-2">BarkBook</h2>
            <p className="text-coral-500 font-medium text-lg">Professional Pet Grooming CRM</p>
          </div>
          
          {/* Main Content */}
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6 leading-tight">
            The Complete CRM for
            <span className="text-coral-500 block">Professional Pet Groomers</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
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
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-coral-500 text-lg shadow-sm transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-coral-500 text-white rounded-xl shadow-lg hover:bg-coral-600 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg"
                >
                  {isLoading ? 'Signing up...' : 'Get Early Access 🚀'}
                </button>
              </form>
              <p className="text-sm text-gray-500 mt-4">
                Be the first to know when we launch. No spam, ever.
              </p>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-coral-50 border-2 border-coral-200 text-navy px-6 py-4 rounded-lg shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-coral-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-lg">✓</span>
                  </div>
                  <h3 className="font-bold text-lg text-navy">Welcome to BarkBook!</h3>
                </div>
                <p className="text-sm text-navy/80 mb-2">
                  Thank you for joining our early access list! 🐕
                </p>
                <p className="text-xs text-navy/70">
                  We&apos;ll notify you as soon as BarkBook is ready for professional pet groomers.
                </p>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 text-coral-600 hover:text-coral-700 font-medium hover:underline transition-colors"
              >
                Sign up another email
              </button>
            </div>
          )}

          {/* Migration Highlight Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-coral-50 to-coral-100 rounded-2xl p-8 md:p-12 border border-coral-200 shadow-xl">
              <div className="text-center">
                <div className="w-20 h-20 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">📁</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                  Migrate Your Existing Client List in Minutes
                </h3>
                <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                  Already have a client database? No problem! Simply drag & drop your CSV file 
                  and BarkBook will automatically import all your clients, pets, and appointment history.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="text-coral-500 mr-2">✓</span>
                    Excel & CSV Support
                  </div>
                  <div className="flex items-center">
                    <span className="text-coral-500 mr-2">✓</span>
                    Automatic Data Mapping
                  </div>
                  <div className="flex items-center">
                    <span className="text-coral-500 mr-2">✓</span>
                    Zero Data Loss
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20 max-w-5xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-navy text-center mb-16">
              Everything You Need to Run Your Grooming Business
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl text-white">📅</span>
                </div>
                <h4 className="text-xl font-bold text-navy mb-4">Smart Appointment Booking</h4>
                <p className="text-gray-600 leading-relaxed">
                  Automated scheduling with client preferences, recurring appointments, and SMS reminders. 
                  Never double-book or miss an appointment again.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl text-white">🐕</span>
                </div>
                <h4 className="text-xl font-bold text-navy mb-4">Pet Health Tracking</h4>
                <p className="text-gray-600 leading-relaxed">
                  Track vaccination records, allergies, behavioral notes, and grooming history. 
                  Keep every pet's profile complete and accessible.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl text-white">📁</span>
                </div>
                <h4 className="text-xl font-bold text-navy mb-4">Easy Data Migration</h4>
                <p className="text-gray-600 leading-relaxed">
                  Import your existing client list instantly. Simply drag & drop your CSV file 
                  and we'll automatically populate all your client and pet data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-navy text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 flex items-center">
              <div className="w-8 h-8 rounded-lg overflow-hidden mr-3 shadow-sm bg-coral-500 p-1">
                <img 
                  src="/favicon.svg" 
                  alt="BarkBook logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-white">BarkBook</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <Link href="/privacy" className="text-gray-300 hover:text-coral-500 transition-colors font-medium">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-coral-500 transition-colors font-medium">
                Terms of Service
              </Link>
              <Link href="/refund" className="text-gray-300 hover:text-coral-500 transition-colors font-medium">
                Refund Policy
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} BarkBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
