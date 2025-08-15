"use client";

import { ArrowRight, Star, Users, Calendar, BarChart3, Zap, CheckCircle, Building2, Globe, Heart, Menu, X } from "lucide-react";
import BarkBookLogo from "@/components/BarkBookLogo";
import { useState } from "react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-8 flex items-center justify-between">
        <div className="text-2xl sm:text-3xl font-bold text-white">BarkBook</div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <a className="text-white hover:text-accent-300 font-medium transition-colors" href="#features">Features</a>
          <a className="text-white hover:text-accent-300 font-medium transition-colors" href="/pricing">Pricing</a>
          <a className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-2 rounded-lg font-medium hover:from-accent-600 hover:to-accent-700 transition-all shadow-lg" href="/signup">Start Free Trial</a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-800 border-t border-primary-700">
          <nav className="px-4 py-4 space-y-4">
            <a className="block text-white hover:text-accent-300 font-medium transition-colors" href="#features">Features</a>
            <a className="block text-white hover:text-accent-300 font-medium transition-colors" href="/pricing">Pricing</a>
            <a className="block bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-2 rounded-lg font-medium hover:from-accent-600 hover:to-accent-700 transition-all shadow-lg text-center" href="/signup">Start Free Trial</a>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20 text-center">
        {/* Logo Hero */}
        <div className="mb-8 sm:mb-12 flex justify-center">
          <BarkBookLogo className="text-white" size="hero" />
        </div>

        {/* Trust Badge */}
        <div className="mb-8 flex justify-center">
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-flex items-center shadow-lg">
            <Star className="w-4 h-4 mr-2" />
            Trusted by 500+ Grooming Businesses
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 sm:mb-8 leading-tight">
          The Complete
          <br />
          <span className="bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent">Grooming Business</span>
        </h1>
        
        <p className="text-xl sm:text-2xl md:text-3xl text-primary-100 max-w-4xl mx-auto mb-8 sm:mb-12 px-4 leading-relaxed">
          Streamline appointments, delight clients, and grow your grooming business with our all-in-one platform.
        </p>

        <p className="text-lg sm:text-xl text-primary-200 max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
          Get your own branded booking page in minutes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16 px-4">
          <a 
            href="/signup" 
            className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl hover:from-accent-600 hover:to-accent-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center justify-center"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
          </a>
          <a 
            href="/pricing" 
            className="border-2 border-white text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl hover:bg-white hover:text-primary-900 transition-all inline-flex items-center justify-center"
          >
            View Pricing
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">500+</div>
            <div className="text-primary-200 text-sm sm:text-base">Active Businesses</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">50K+</div>
            <div className="text-primary-200 text-sm sm:text-base">Appointments Booked</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">98%</div>
            <div className="text-primary-200 text-sm sm:text-base">Customer Satisfaction</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-primary-200 text-sm sm:text-base">Support Available</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Everything You Need to Run Your Business</h2>
          <p className="text-xl sm:text-2xl text-primary-200 max-w-3xl mx-auto px-4">
            Powerful features designed specifically for grooming professionals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              title: 'Custom Booking Pages', 
              desc: 'Get your own branded booking page that matches your business style.',
              icon: Globe,
              color: 'primary',
              bgColor: 'from-primary-600 to-primary-700'
            },
            {
              title: 'Smart Scheduling', 
              desc: 'Multi-groomer calendar with availability management and conflict prevention.',
              icon: Calendar,
              color: 'accent',
              bgColor: 'from-accent-500 to-accent-600'
            },
            {
              title: 'Client Management', 
              desc: 'Keep detailed client and pet profiles with history and preferences.',
              icon: Users,
              color: 'secondary',
              bgColor: 'from-secondary-600 to-secondary-700'
            },
            {
              title: 'Photo Gallery', 
              desc: 'Showcase before/after photos to delight clients and attract new ones.',
              icon: Star,
              color: 'accent',
              bgColor: 'from-accent-400 to-accent-500'
            },
            {
              title: 'Analytics & Reports', 
              desc: 'Track revenue, popular services, and business growth over time.',
              icon: BarChart3,
              color: 'primary',
              bgColor: 'from-primary-500 to-primary-600'
            },
            {
              title: 'Automated Workflows', 
              desc: 'Send reminders, collect reviews, and follow up automatically.',
              icon: Zap,
              color: 'secondary',
              bgColor: 'from-secondary-500 to-secondary-600'
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            const colorClasses = {
              primary: 'text-primary-100',
              accent: 'text-accent-100',
              secondary: 'text-secondary-100'
            };
            
            return (
              <div key={feature.title} className={`rounded-2xl p-6 sm:p-8 hover:shadow-2xl transition-all transform hover:scale-105 bg-gradient-to-br ${feature.bgColor} border border-white/20`}>
                <div className="bg-white/20 rounded-xl p-3 w-fit mb-4">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className={`text-sm sm:text-base ${colorClasses[feature.color as keyof typeof colorClasses]}`}>{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="bg-gradient-to-r from-primary-800 to-dark-800 text-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-3xl p-8 sm:p-12 mb-12">
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">Ready to Transform Your Grooming Business?</h2>
            <p className="text-xl sm:text-2xl text-accent-100 mb-8 max-w-3xl mx-auto">
              Join hundreds of grooming professionals who have streamlined their operations and grown their revenue with BarkBook.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <div className="text-3xl sm:text-4xl font-bold mb-2">$19.99</div>
                <div className="text-accent-100 text-sm sm:text-base">Starting at /month</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <div className="text-3xl sm:text-4xl font-bold mb-2">14-Day</div>
                <div className="text-accent-100 text-sm sm:text-base">Free Trial</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <div className="text-3xl sm:text-4xl font-bold mb-2">Setup</div>
                <div className="text-accent-100 text-sm sm:text-base">In Minutes</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/signup"
                className="bg-white text-primary-900 px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl hover:bg-primary-50 transition-all inline-flex items-center justify-center shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
              </a>
              <a 
                href="/pricing"
                className="border-2 border-white text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl hover:bg-white hover:text-primary-900 transition-colors inline-flex items-center justify-center"
              >
                View All Plans
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

