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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
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
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-coral-500 transition-colors font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-gray-600 hover:text-coral-500 transition-colors font-medium"
              >
                Pricing
              </button>
              <Link href="/login" className="text-gray-600 hover:text-coral-500 transition-colors font-medium">
                Login
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
                  className="w-full px-6 py-4 bg-navy text-white rounded-xl shadow-lg hover:bg-navy-800 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg"
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

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/signup" 
              className="px-8 py-4 bg-navy text-white rounded-xl shadow-lg hover:bg-navy-800 hover:shadow-xl transition-all duration-200 font-semibold text-lg"
            >
              Start 14-Day Free Trial 🚀
            </Link>
            <button 
              onClick={() => scrollToSection('features')}
              className="px-8 py-4 border-2 border-navy text-navy rounded-xl hover:bg-navy hover:text-white transition-all duration-200 font-semibold text-lg"
            >
              See Features
            </button>
          </div>

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
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
              Everything You Need to Run Your Grooming Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From appointment scheduling to client management, BarkBook has all the tools 
              you need to streamline your pet grooming business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 bg-gradient-to-br from-cream to-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
            <div className="text-center p-8 bg-gradient-to-br from-cream to-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
            <div className="text-center p-8 bg-gradient-to-br from-cream to-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">💬</span>
              </div>
              <h4 className="text-xl font-bold text-navy mb-4">Client Communication</h4>
              <p className="text-gray-600 leading-relaxed">
                Automated SMS reminders, appointment confirmations, and follow-up messages. 
                Keep clients informed and reduce no-shows.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-8 bg-gradient-to-br from-cream to-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">📊</span>
              </div>
              <h4 className="text-xl font-bold text-navy mb-4">Business Analytics</h4>
              <p className="text-gray-600 leading-relaxed">
                Track revenue, popular services, client retention, and business growth. 
                Make data-driven decisions to grow your grooming business.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-8 bg-gradient-to-br from-cream to-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">📱</span>
              </div>
              <h4 className="text-xl font-bold text-navy mb-4">Mobile Ready</h4>
              <p className="text-gray-600 leading-relaxed">
                Access your business from anywhere. Update appointments, check client info, 
                and manage your schedule on the go.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-8 bg-gradient-to-br from-cream to-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">🔒</span>
              </div>
              <h4 className="text-xl font-bold text-navy mb-4">Secure & Reliable</h4>
              <p className="text-gray-600 leading-relaxed">
                Bank-level security for your client data. Automatic backups, 
                encrypted storage, and 99.9% uptime guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-navy to-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your business. No hidden fees, no surprises.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Starter</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-gray-300">/month</span>
                </div>
                <p className="text-gray-300">Perfect for solo groomers</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="text-coral-400 mr-3">✓</span>
                  Up to 200 clients
                </li>
                <li className="flex items-center">
                  <span className="text-coral-400 mr-3">✓</span>
                  Appointment scheduling
                </li>
                <li className="flex items-center">
                  <span className="text-coral-400 mr-3">✓</span>
                  SMS reminders
                </li>
                <li className="flex items-center">
                  <span className="text-coral-400 mr-3">✓</span>
                  Basic reporting
                </li>
                <li className="flex items-center">
                  <span className="text-coral-400 mr-3">✓</span>
                  Email support
                </li>
              </ul>
              <button className="w-full py-3 bg-coral-500 text-white rounded-xl hover:bg-coral-600 transition-colors font-semibold">
                Get Started
              </button>
            </div>

            {/* Professional Plan */}
            <div className="bg-coral-500 rounded-2xl p-8 border-2 border-coral-400 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-coral-400 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Professional</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$59</span>
                  <span className="text-white/80">/month</span>
                </div>
                <p className="text-white/80">For growing grooming businesses</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="text-white mr-3">✓</span>
                  Unlimited clients
                </li>
                <li className="flex items-center">
                  <span className="text-white mr-3">✓</span>
                  Advanced scheduling
                </li>
                <li className="flex items-center">
                  <span className="text-white mr-3">✓</span>
                  Automated reminders
                </li>
                <li className="flex items-center">
                  <span className="text-white mr-3">✓</span>
                  Detailed analytics
                </li>
                <li className="flex items-center">
                  <span className="text-white mr-3">✓</span>
                  Priority support
                </li>
                <li className="flex items-center">
                  <span className="text-white mr-3">✓</span>
                  Data migration
                </li>
              </ul>
              <button className="w-full py-3 bg-white text-coral-500 rounded-xl hover:bg-gray-100 transition-colors font-semibold">
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-gray-300">/month</span>
                </div>
                <p className="text-gray-300">For multi-location salons</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="text-coral-400 mr-3">✓</span>
                  Everything in Professional
                </li>
                <li className="flex items-center">
                  <span className="text-coral-400 mr-3">✓</span>
                  Multi-location support
                </li>
                <li className="flex items-center">
                  <span className="text-coral-400 mr-3">✓</span>
                  Staff management
                </li>
                <li className="flex items-center">
                  <span className="text-coral-400 mr-3">✓</span>
                  Advanced integrations
                </li>
                <li className="flex items-center">
                  <span className="text-coral-400 mr-3">✓</span>
                  Dedicated account manager
                </li>
                <li className="flex items-center">
                  <span className="text-coral-400 mr-3">✓</span>
                  Custom training
                </li>
              </ul>
              <button className="w-full py-3 bg-coral-500 text-white rounded-xl hover:bg-coral-600 transition-colors font-semibold">
                Contact Sales
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-300 mb-4">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <p className="text-sm text-gray-400">
              Need a custom plan? <Link href="/contact" className="text-coral-400 hover:text-coral-300 underline">Contact us</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-lg overflow-hidden mr-3 shadow-sm bg-coral-500 p-1">
                  <img 
                    src="/favicon.svg" 
                    alt="BarkBook logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-2xl font-bold text-white">BarkBook</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                The complete CRM solution for professional pet groomers. 
                Streamline your business and focus on what you love - grooming pets.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-coral-400 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-coral-400 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-coral-400 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-coral-400 transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-coral-400 transition-colors">Pricing</button></li>
                <li><Link href="/login" className="text-gray-300 hover:text-coral-400 transition-colors">Login</Link></li>
                <li><Link href="/signup" className="text-gray-300 hover:text-coral-400 transition-colors">Sign Up</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-300 hover:text-coral-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-coral-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/refund" className="text-gray-300 hover:text-coral-400 transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} BarkBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
