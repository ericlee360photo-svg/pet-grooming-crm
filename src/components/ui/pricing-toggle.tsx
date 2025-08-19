'use client'

import { useState } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface PricingToggleProps {
  onToggle: (isAnnual: boolean) => void
  className?: string
}

export function PricingToggle({ onToggle, className }: PricingToggleProps) {
  const [isAnnual, setIsAnnual] = useState(false)

  const handleToggle = (newValue: boolean) => {
    setIsAnnual(newValue)
    onToggle(newValue)
  }

  return (
    <div className={cn("flex items-center justify-center space-x-4", className)}>
      <span className={cn(
        "text-sm font-medium transition-colors",
        !isAnnual ? "text-primary" : "text-gray-500"
      )}>
        Monthly
      </span>
      <Button
        variant="outline"
        size="sm"
        className="relative w-16 h-8 rounded-full p-1"
        onClick={() => handleToggle(!isAnnual)}
      >
        <div
          className={cn(
            "absolute top-1 w-6 h-6 bg-accent rounded-full transition-transform duration-200 ease-in-out",
            isAnnual ? "translate-x-8" : "translate-x-0"
          )}
        />
      </Button>
      <div className="flex items-center space-x-2">
        <span className={cn(
          "text-sm font-medium transition-colors",
          isAnnual ? "text-primary" : "text-gray-500"
        )}>
          Annual
        </span>
        <span className="bg-accent text-white text-xs px-2 py-1 rounded-full font-medium">
          Save 17%
        </span>
      </div>
    </div>
  )
}
