interface BarkBookLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
}

export default function BarkBookLogo({ className = "", size = 'md' }: BarkBookLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 sm:h-8 sm:w-8',
    md: 'h-8 w-8 sm:h-10 sm:w-10',
    lg: 'h-10 w-10 sm:h-12 sm:w-12',
    xl: 'h-12 w-12 sm:h-16 sm:w-16',
    hero: 'h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] md:h-[800px] md:w-[800px]'
  };

  const textSizeClasses = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    hero: 'text-2xl sm:text-3xl md:text-4xl'
  };

  // Extract text color from className if provided
  const textColorClass = className.includes('text-white') ? 'text-white' : 'text-primary-800';

  return (
    <div className={`flex flex-col items-center space-y-1 sm:space-y-2 ${className}`}>
      <img 
        src="/barkbook-logo.svg"
        alt="BarkBook Logo"
        className={sizeClasses[size]}
      />
      <span className={`font-bold ${textSizeClasses[size]} ${textColorClass}`}>BarkBook</span>
    </div>
  );
}
