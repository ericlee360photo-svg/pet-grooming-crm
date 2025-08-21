'use client'

// Force dynamic rendering to avoid SSR issues with Supabase
export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/ui/logo"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from 'next/navigation'
import { OAuthButtons, OAuthDivider } from "@/components/ui/oauth-buttons"
import { signUpWithEmail } from "@/lib/auth"

function SignupContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPlan = searchParams.get('plan') || 'pro'

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { user, error } = await signUpWithEmail(
        formData.email,
        formData.password,
        {
          business_name: formData.businessName,
          owner_name: formData.ownerName,
          phone: formData.phone,
        }
      )
      
      if (error) {
        setErrors({ general: error.message })
        return
      }

      if (user) {
        // Redirect to dashboard or onboarding
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Signup error:', error)
      setErrors({ general: 'An error occurred during signup. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSuccess = () => {
    // OAuth redirect will handle the flow
    // User will be redirected to /auth/callback
  }

  const handleOAuthError = (error: string) => {
    setErrors({ general: error })
  }

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return value
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-cream-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Logo size="3xl" />
          </div>
          <p className="text-gray-600">Create your grooming business account</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Get Started</CardTitle>
            <CardDescription>
              Start your 14-day free trial. No credit card required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* OAuth Buttons */}
            <OAuthButtons 
              onSuccess={handleOAuthSuccess}
              onError={handleOAuthError}
              className="mb-6"
            />
            
            <OAuthDivider className="mb-6" />
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Business Information */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Your Grooming Salon"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className={errors.businessName ? 'border-red-500' : ''}
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Name *
                  </label>
                  <Input
                    id="ownerName"
                    type="text"
                    placeholder="Your Name"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    className={errors.ownerName ? 'border-red-500' : ''}
                  />
                  {errors.ownerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Plan Selection */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Plan
                </label>
                <div className="flex items-center justify-between">
                  <span className="capitalize font-medium">{selectedPlan}</span>
                  <span className="text-sm text-gray-600">14-day free trial</span>
                </div>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {errors.general}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-accent hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
                . View our{' '}
                <Link href="/refund" className="text-accent hover:underline">
                  Refund Policy
                </Link>
                .
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  )
}
