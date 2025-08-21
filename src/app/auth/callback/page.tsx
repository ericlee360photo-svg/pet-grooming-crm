'use client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Logo } from '@/components/ui/logo'

function AuthCallbackContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (!supabase) {
          setError('Authentication service not available')
          return
        }
        
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setError(error.message)
          return
        }

        if (data.session) {
          // User is authenticated, redirect to dashboard
          router.push('/dashboard')
        } else {
          // No session found, redirect to login
          router.push('/login')
        }
      } catch (error) {
        setError('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    handleAuthCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-cream-100 p-4">
        <div className="text-center">
          <div className="mb-8">
            <Logo size="3xl" />
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
            <h2 className="text-lg font-semibold mb-2">Authentication Error</h2>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 text-accent hover:underline"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-cream-100 p-4">
      <div className="text-center">
        <div className="mb-8">
          <Logo size="3xl" />
        </div>
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  )
}
