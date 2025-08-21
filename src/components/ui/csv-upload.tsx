'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'

interface CSVUploadProps {
  onUpload: (data: any[]) => void
  onClose?: () => void
  className?: string
}

interface ParsedData {
  headers: string[]
  rows: any[]
  preview: any[]
  totalRows: number
}

export default function CSVUpload({ onUpload, onClose, className = '' }: CSVUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const parseCSV = useCallback((text: string): ParsedData => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length === 0) throw new Error('CSV file is empty')
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      return row
    })

    return {
      headers,
      rows,
      preview: rows.slice(0, 5), // First 5 rows for preview
      totalRows: rows.length
    }
  }, [])

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    if (!selectedFile.type.includes('csv') && !selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file')
      return
    }

    setFile(selectedFile)
    setIsProcessing(true)
    setError(null)

    try {
      const text = await selectedFile.text()
      const parsed = parseCSV(text)
      setParsedData(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file')
      setParsedData(null)
    } finally {
      setIsProcessing(false)
    }
  }, [parseCSV])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleConfirmUpload = useCallback(() => {
    if (parsedData) {
      onUpload(parsedData.rows)
      // Reset state
      setParsedData(null)
      setFile(null)
      setError(null)
    }
  }, [parsedData, onUpload])

  const handleReset = useCallback(() => {
    setParsedData(null)
    setFile(null)
    setError(null)
  }, [])

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-coral-500 rounded-full flex items-center justify-center mr-3">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-navy">Import Client Data</h3>
            <p className="text-sm text-gray-600">Upload your CSV file to migrate existing clients</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Upload Area */}
      {!parsedData && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragOver
              ? 'border-coral-500 bg-coral-50'
              : 'border-gray-300 hover:border-coral-400 hover:bg-gray-50'
          }`}
        >
          {isProcessing ? (
            <div className="space-y-4">
              <div className="w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600">Processing your CSV file...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-coral-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-navy mb-2">
                  Drag & drop your CSV file here
                </p>
                <p className="text-gray-600 mb-4">
                  or click to browse your files
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="inline-block px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 cursor-pointer transition-colors font-medium"
                >
                  Choose File
                </label>
              </div>
              <div className="text-xs text-gray-500">
                Supported formats: CSV files with client and pet data
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
          <div>
            <p className="text-red-700 font-medium">Upload Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={handleReset}
            className="ml-auto px-3 py-1 text-red-600 hover:bg-red-100 rounded transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Data Preview */}
      {parsedData && (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <p className="text-green-700 font-medium">CSV Parsed Successfully!</p>
              <p className="text-green-600 text-sm">
                Found {parsedData.totalRows} rows with {parsedData.headers.length} columns
              </p>
            </div>
          </div>

          {/* Headers */}
          <div>
            <h4 className="font-semibold text-navy mb-2">Detected Columns:</h4>
            <div className="flex flex-wrap gap-2">
              {parsedData.headers.map((header, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-coral-100 text-coral-700 rounded-full text-sm font-medium"
                >
                  {header}
                </span>
              ))}
            </div>
          </div>

          {/* Data Preview */}
          <div>
            <h4 className="font-semibold text-navy mb-2">Data Preview (First 5 rows):</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    {parsedData.headers.map((header, index) => (
                      <th key={index} className="px-3 py-2 text-left font-medium text-gray-700 border-b">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.preview.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-gray-100">
                      {parsedData.headers.map((header, colIndex) => (
                        <td key={colIndex} className="px-3 py-2 text-gray-600">
                          {row[header] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleConfirmUpload}
              className="flex-1 px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors font-medium"
            >
              Import {parsedData.totalRows} Records
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Choose Different File
            </button>
          </div>
        </div>
      )}

      {/* Expected Format Guide */}
      {!parsedData && !isProcessing && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Expected CSV Format:</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Client columns:</strong> name, email, phone, address</p>
            <p><strong>Pet columns:</strong> pet_name, pet_breed, pet_age, pet_notes</p>
            <p><strong>Optional:</strong> last_visit, next_appointment, services</p>
          </div>
        </div>
      )}
    </div>
  )
}
