import { cn } from "@/lib/utils"

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'hero'
  className?: string
  showText?: boolean
}

export function Logo({ size = 'md', className, showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
    '2xl': 'h-16 w-16',
    '3xl': 'h-20 w-20',
    '4xl': 'h-24 w-24',
    'hero': 'h-48 w-48 md:h-64 md:w-64'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl',
    '3xl': 'text-5xl',
    '4xl': 'text-6xl',
    'hero': 'text-7xl md:text-8xl'
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* Logo Icon */}
      <div className={cn(
        "relative rounded-lg overflow-hidden",
        sizeClasses[size]
      )}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream-100 to-accent-500" />
        
        {/* Dog silhouette */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="absolute inset-0 w-full h-full"
        >
          {/* Dog head silhouette */}
          <path
            d="M6 8C6 6.89543 6.89543 6 8 6H16C17.1046 6 18 6.89543 18 8V12C18 13.1046 17.1046 14 16 14H8C6.89543 14 6 13.1046 6 12V8Z"
            fill="#19253d"
          />
          {/* Dog ear */}
          <path
            d="M7 7C7 6.44772 7.44772 6 8 6H9C9.55228 6 10 6.44772 10 7V9C10 9.55228 9.55228 10 9 10H8C7.44772 10 7 9.55228 7 9V7Z"
            fill="#19253d"
          />
          {/* Dog ear highlight */}
          <path
            d="M7.5 7.5C7.5 7.22386 7.72386 7 8 7H8.5C8.77614 7 9 7.22386 9 7.5V8.5C9 8.77614 8.77614 9 8.5 9H8C7.72386 9 7.5 8.77614 7.5 8.5V7.5Z"
            fill="#f8eee4"
          />
          {/* Dog snout */}
          <path
            d="M10 10C10 9.44772 10.4477 9 11 9H13C13.5523 9 14 9.44772 14 10V12C14 12.5523 13.5523 13 13 13H11C10.4477 13 10 12.5523 10 12V10Z"
            fill="#19253d"
          />
          {/* Dog eye */}
          <circle cx="9" cy="10" r="0.5" fill="#f8eee4" />
          <circle cx="15" cy="10" r="0.5" fill="#f8eee4" />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <span className={cn(
          "font-bold text-primary",
          textSizes[size]
        )}>
          BarkBook
        </span>
      )}
    </div>
  )
}
