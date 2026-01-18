interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'color' | 'monochrome';
}

export function Logo({ className = "", size = 280, variant = 'color' }: LogoProps) {
  // Color palette based on design system
  const primaryColor = variant === 'color' ? 'hsl(200, 98%, 50%)' : 'currentColor';
  const secondaryColor = variant === 'color' ? 'hsl(200, 98%, 65%)' : 'currentColor';
  const tertiaryColor = variant === 'color' ? 'hsl(200, 98%, 80%)' : 'currentColor';
  
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
      role="presentation"
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer guidance ring - represents awareness/environment scanning */}
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke={tertiaryColor}
          strokeWidth="2"
          strokeDasharray="8 4"
          opacity="0.4"
        />
        
        {/* Middle guidance ring */}
        <circle
          cx="100"
          cy="100"
          r="70"
          stroke={secondaryColor}
          strokeWidth="2.5"
          strokeDasharray="12 6"
          opacity="0.6"
        />
        
        {/* Inner solid ring - core guidance */}
        <circle
          cx="100"
          cy="100"
          r="50"
          stroke={primaryColor}
          strokeWidth="3"
          opacity="0.8"
        />
        
        {/* Central flowing path - abstract doorway/passage */}
        <path
          d="M100 40
             C75 55, 65 75, 65 100
             C65 125, 75 145, 100 160
             C125 145, 135 125, 135 100
             C135 75, 125 55, 100 40Z"
          fill="none"
          stroke={primaryColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Inner path detail - suggests forward movement */}
        <path
          d="M100 60
             C85 70, 80 85, 80 100
             C80 115, 85 130, 100 140
             C115 130, 120 115, 120 100
             C120 85, 115 70, 100 60Z"
          fill={primaryColor}
          opacity="0.15"
        />
        
        {/* Central beacon/core - the guiding point */}
        <circle
          cx="100"
          cy="100"
          r="12"
          fill={primaryColor}
        />
        
        {/* Inner beacon highlight */}
        <circle
          cx="100"
          cy="96"
          r="4"
          fill="white"
          opacity="0.6"
        />
        
        {/* Sound/voice wave lines emanating upward - subtle voice integration */}
        <path
          d="M85 70 Q100 55, 115 70"
          stroke={secondaryColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M78 55 Q100 35, 122 55"
          stroke={tertiaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        
        {/* Directional indicator - forward arrow suggestion */}
        <path
          d="M100 140 L100 165 M90 155 L100 165 L110 155"
          stroke={primaryColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
