'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { PricingToggle } from "@/components/ui/pricing-toggle"
import { Calendar, Users, CreditCard, MessageSquare, Shield, Zap, Smartphone } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isAnnual, setIsAnnual] = useState(false)

  // Pricing data
  const pricing = {
    basic: {
      monthly: 29,
      annual: 24
    },
    pro: {
      monthly: 59,
      annual: 49
    },
    growth: {
      monthly: 99,
      annual: 82
    }
  }

  const getCurrentPrice = (plan: keyof typeof pricing) => {
    return isAnnual ? pricing[plan].annual : pricing[plan].monthly
  }

  const getOriginalPrice = (plan: keyof typeof pricing) => {
    return pricing[plan].monthly
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="lg" />
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-primary transition-colors">
                Login
              </Link>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Logo size="hero" showText={false} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
            The Complete CRM for
            <span className="text-accent block">Professional Pet Groomers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your grooming business with appointment booking, client management, 
            payment processing, and automated communications - all in one beautiful platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
              <Link href="#demo">Watch Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Everything You Need to Run Your Grooming Business
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                From appointment scheduling to payment processing, BarkBook handles all the details 
                so you can focus on what you do best - making pets look and feel amazing.
              </p>
            </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader>
                <Calendar className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-primary">Smart Scheduling</CardTitle>
                <CardDescription className="text-primary/70">
                  Online booking with real-time availability, calendar sync, and automated reminders.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-primary">Client Management</CardTitle>
                <CardDescription className="text-primary/70">
                  Complete pet profiles, vaccination tracking, and client communication history.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader>
                <CreditCard className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-primary">Payment Processing</CardTitle>
                <CardDescription className="text-primary/70">
                  Secure deposits, online payments, and automated invoicing with Stripe integration.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Automated Communications</CardTitle>
                <CardDescription>
                  SMS reminders, confirmations, and two-way messaging with Twilio integration.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Vaccine Management</CardTitle>
                <CardDescription>
                  Track vaccination records, set expiration alerts, and enforce policies.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Mobile-First Design</CardTitle>
                <CardDescription>
                  PWA that works on any device, perfect for mobile groomers and salon staff.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Choose the plan that fits your business size and needs.
            </p>
            <PricingToggle onToggle={setIsAnnual} />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Basic</CardTitle>
                <div className="flex flex-col items-center">
                  {isAnnual && (
                    <div className="text-lg text-gray-500 line-through mb-1">
                      ${getOriginalPrice('basic')}/month
                    </div>
                  )}
                  <div className="text-4xl font-bold text-primary">
                    ${getCurrentPrice('basic')}
                    <span className="text-lg text-gray-500">
                      /{isAnnual ? 'month' : 'month'}
                    </span>
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-gray-600 mt-1">
                      Billed annually (${getCurrentPrice('basic') * 12}/year)
                    </div>
                  )}
                </div>
                <CardDescription>Perfect for solo groomers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />Up to 100 clients</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />Basic appointment booking</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />SMS reminders (50/month)</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />Payment processing</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />Mobile app access</li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/signup?plan=basic">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-accent relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="flex flex-col items-center">
                  {isAnnual && (
                    <div className="text-lg text-gray-500 line-through mb-1">
                      ${getOriginalPrice('pro')}/month
                    </div>
                  )}
                  <div className="text-4xl font-bold text-primary">
                    ${getCurrentPrice('pro')}
                    <span className="text-lg text-gray-500">
                      /{isAnnual ? 'month' : 'month'}
                    </span>
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-gray-600 mt-1">
                      Billed annually (${getCurrentPrice('pro') * 12}/year)
                    </div>
                  )}
                </div>
                <CardDescription>For growing grooming businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />Unlimited clients</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />Advanced scheduling</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />SMS reminders (500/month)</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />Calendar sync</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />Vaccine management</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />Analytics & reporting</li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/signup?plan=pro">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Growth Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Growth</CardTitle>
                <div className="flex flex-col items-center">
                  {isAnnual && (
                    <div className="text-lg text-gray-500 line-through mb-1">
                      ${getOriginalPrice('growth')}/month
                    </div>
                  )}
                  <div className="text-4xl font-bold text-primary">
                    ${getCurrentPrice('growth')}
                    <span className="text-lg text-gray-500">
                      /{isAnnual ? 'month' : 'month'}
                    </span>
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-gray-600 mt-1">
                      Billed annually (${getCurrentPrice('growth') * 12}/year)
                    </div>
                  )}
                </div>
                <CardDescription>For multi-location salons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />Everything in Pro</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />Multiple locations</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />Unlimited SMS</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />Team management</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />Advanced analytics</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-accent mr-2" />Priority support</li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/signup?plan=growth">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              All plans include a 14-day free trial.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Grooming Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professional groomers who trust BarkBook to manage their business.
          </p>
          <Button size="lg" variant="accent" className="text-lg px-8 py-3" asChild>
            <Link href="/signup">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Logo size="md" className="text-white" />
              </div>
              <p className="text-gray-400">
                The complete CRM solution for professional pet groomers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BarkBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
