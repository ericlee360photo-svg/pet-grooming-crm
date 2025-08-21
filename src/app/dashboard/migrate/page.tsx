'use client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, CheckCircle, AlertTriangle, Users, Heart } from 'lucide-react'
import CSVUpload from '@/components/ui/csv-upload'
import Link from 'next/link'

interface MigrationResult {
  success: boolean
  message: string
  results?: {
    total_rows: number
    clients_created: number
    pets_created: number
    skipped: number
    errors: string[]
  }
  error?: string
  details?: string
}

export default function MigratePage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<MigrationResult | null>(null)

  const handleUpload = async (data: any[]) => {
    setIsUploading(true)
    setResult(null)

    try {
      const response = await fetch('/api/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      })

      const result: MigrationResult = await response.json()
      setResult(result)

      if (result.success) {
        // Show success for a moment, then optionally redirect
        setTimeout(() => {
          // You can redirect to clients page or stay here
          // router.push('/dashboard/clients')
        }, 3000)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setResult({
        success: false,
        message: 'Upload failed',
        error: 'Failed to upload data',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('/api/migrate', { method: 'GET' })
      const csvContent = await response.text()
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'barkbook_import_template.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download template:', error)
    }
  }

  const handleReset = () => {
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-coral-500 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-navy mb-2">Import Client Data</h1>
              <p className="text-gray-600">
                Migrate your existing client list and pet records to BarkBook
              </p>
            </div>
            
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </button>
          </div>
        </div>

        {/* Upload Section */}
        {!result && (
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Before You Start:</h3>
              <div className="space-y-2 text-blue-800">
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">1.</span>
                  <span>Prepare your CSV file with client and pet information</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">2.</span>
                  <span>Include columns like: name, email, phone, pet_name, pet_breed, etc.</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">3.</span>
                  <span>Download our template above for the exact format</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">4.</span>
                  <span>Each row can contain one client with their pet information</span>
                </div>
              </div>
            </div>

            {/* CSV Upload Component */}
            <CSVUpload 
              onUpload={handleUpload}
              className={isUploading ? 'opacity-75 pointer-events-none' : ''}
            />

            {/* Loading Overlay */}
            {isUploading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8 max-w-sm mx-4 text-center">
                  <div className="w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-navy mb-2">Importing Data...</h3>
                  <p className="text-gray-600">
                    Please wait while we process your client data
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Success Result */}
            {result.success && result.results && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold text-green-900">Import Successful!</h3>
                    <p className="text-green-700">Your data has been imported to BarkBook</p>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-navy">{result.results.total_rows}</div>
                    <div className="text-sm text-gray-600">Total Rows</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-5 h-5 text-coral-500 mr-1" />
                      <div className="text-2xl font-bold text-navy">{result.results.clients_created}</div>
                    </div>
                    <div className="text-sm text-gray-600">Clients Added</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center justify-center mb-1">
                      <Heart className="w-5 h-5 text-coral-500 mr-1" />
                      <div className="text-2xl font-bold text-navy">{result.results.pets_created}</div>
                    </div>
                    <div className="text-sm text-gray-600">Pets Added</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-gray-500">{result.results.skipped}</div>
                    <div className="text-sm text-gray-600">Skipped</div>
                  </div>
                </div>

                {/* Errors */}
                {result.results.errors.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                      <h4 className="font-semibold text-yellow-900">
                        Some Issues Occurred ({result.results.errors.length})
                      </h4>
                    </div>
                    <div className="space-y-1 text-sm text-yellow-800 max-h-32 overflow-y-auto">
                      {result.results.errors.map((error, index) => (
                        <div key={index}>• {error}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    href="/dashboard"
                    className="flex-1 px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors font-medium text-center"
                  >
                    View Dashboard
                  </Link>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Import More Data
                  </button>
                </div>
              </div>
            )}

            {/* Error Result */}
            {!result.success && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold text-red-900">Import Failed</h3>
                    <p className="text-red-700">{result.error || 'An error occurred during import'}</p>
                  </div>
                </div>

                {result.details && (
                  <div className="bg-red-100 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-800">{result.details}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Support Section */}
        <div className="mt-12 bg-gray-100 rounded-xl p-6">
          <h3 className="font-semibold text-navy mb-3">Need Help?</h3>
          <div className="text-gray-600 space-y-2">
            <p>• Having trouble with the CSV format? Download our template above</p>
            <p>• Large datasets? Contact support for bulk import assistance</p>
            <p>• Questions about data mapping? Check our documentation</p>
          </div>
        </div>
      </div>
    </div>
  )
}
