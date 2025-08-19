import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export const dateUtils = {
  // Format date for display
  formatDate: (date: Date | string, formatStr: string = 'MMM dd, yyyy') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, formatStr)
  },

  // Format time for display
  formatTime: (date: Date | string, formatStr: string = 'h:mm a') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, formatStr)
  },

  // Format date and time
  formatDateTime: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, 'MMM dd, yyyy h:mm a')
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return formatDistanceToNow(dateObj, { addSuffix: true })
  },

  // Check if date is today
  isToday: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return isToday(dateObj)
  },

  // Check if date is tomorrow
  isTomorrow: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return isTomorrow(dateObj)
  },

  // Check if date is yesterday
  isYesterday: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return isYesterday(dateObj)
  },

  // Get friendly date display
  getFriendlyDate: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isToday(dateObj)) return 'Today'
    if (isTomorrow(dateObj)) return 'Tomorrow'
    if (isYesterday(dateObj)) return 'Yesterday'
    
    return format(dateObj, 'MMM dd, yyyy')
  },

  // Get appointment duration in minutes
  getDuration: (start: Date | string, end: Date | string) => {
    const startObj = typeof start === 'string' ? new Date(start) : start
    const endObj = typeof end === 'string' ? new Date(end) : end
    return Math.round((endObj.getTime() - startObj.getTime()) / (1000 * 60))
  },
}

// Currency formatting utilities
export const currencyUtils = {
  // Format cents to dollars
  formatCents: (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100)
  },

  // Format dollars
  formatDollars: (dollars: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(dollars)
  },

  // Convert dollars to cents
  dollarsToCents: (dollars: number) => {
    return Math.round(dollars * 100)
  },

  // Convert cents to dollars
  centsToDollars: (cents: number) => {
    return cents / 100
  },
}

// Phone number formatting
export const phoneUtils = {
  // Format phone number for display
  formatPhone: (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return phone
  },

  // Clean phone number for storage
  cleanPhone: (phone: string) => {
    return phone.replace(/\D/g, '')
  },

  // Validate phone number
  isValidPhone: (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 10
  },
}

// Validation utilities
export const validationUtils = {
  // Validate email
  isValidEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validate required field
  isRequired: (value: any) => {
    return value !== null && value !== undefined && value !== ''
  },

  // Validate minimum length
  minLength: (value: string, min: number) => {
    return value.length >= min
  },

  // Validate maximum length
  maxLength: (value: string, max: number) => {
    return value.length <= max
  },
}

// Array utilities
export const arrayUtils = {
  // Remove duplicates from array
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)]
  },

  // Group array by key
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key])
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    }, {} as Record<string, T[]>)
  },

  // Sort array by key
  sortBy: <T, K extends keyof T>(array: T[], key: K, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
  },
}

// Object utilities
export const objectUtils = {
  // Remove undefined values from object
  removeUndefined: <T extends Record<string, any>>(obj: T): T => {
    const result = { ...obj }
    Object.keys(result).forEach(key => {
      if (result[key] === undefined) {
        delete result[key]
      }
    })
    return result
  },

  // Pick specific keys from object
  pick: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key]
      }
    })
    return result
  },

  // Omit specific keys from object
  omit: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj }
    keys.forEach(key => {
      delete result[key]
    })
    return result
  },
}
