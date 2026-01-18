interface PhoneSonarAnimationProps {
  className?: string;
  size?: number;
}

export function PhoneSonarAnimation({ className = "", size = 280 }: PhoneSonarAnimationProps) {
  return (
    <div 
      className={`relative ${className}`} 
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Sonar waves emanating from camera */}
        <g>
          {[1, 2, 3].map((i) => (
            <path
              key={i}
              d="M100 55 Q120 35, 140 55"
              stroke="hsl(200, 98%, 39%)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              className="sonar-wave"
              style={{
                animationDelay: `${(i - 1) * 0.4}s`,
                transformOrigin: "100px 55px",
              }}
            />
          ))}
        </g>

        {/* Subtle glow behind phone */}
        <ellipse
          cx="100"
          cy="120"
          rx="35"
          ry="55"
          fill="hsl(200, 98%, 39%)"
          opacity="0.08"
          className="phone-glow"
        />

        {/* Phone body */}
        <rect
          x="70"
          y="65"
          width="60"
          height="110"
          rx="8"
          stroke="hsl(200, 98%, 39%)"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Phone screen */}
        <rect
          x="75"
          y="75"
          width="50"
          height="85"
          rx="4"
          stroke="hsl(200, 98%, 39%)"
          strokeWidth="1.5"
          fill="hsl(200, 98%, 39%)"
          fillOpacity="0.1"
        />

        {/* Camera notch/dot */}
        <circle
          cx="100"
          cy="70"
          r="3"
          fill="hsl(200, 98%, 39%)"
          className="camera-pulse"
        />

        {/* Screen content - scanning lines */}
        <g stroke="hsl(200, 98%, 39%)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5">
          <line x1="82" y1="95" x2="118" y2="95" className="scan-line scan-line-1" />
          <line x1="82" y1="110" x2="118" y2="110" className="scan-line scan-line-2" />
          <line x1="82" y1="125" x2="110" y2="125" className="scan-line scan-line-3" />
          <line x1="82" y1="140" x2="105" y2="140" className="scan-line scan-line-4" />
        </g>

        {/* Home indicator */}
        <rect
          x="90"
          y="165"
          width="20"
          height="3"
          rx="1.5"
          fill="hsl(200, 98%, 39%)"
          opacity="0.6"
        />
      </svg>

      <style>{`
        @keyframes sonar-expand {
          0% {
            opacity: 0.8;
            transform: scale(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(1.8) translateY(-15px);
          }
        }
        
        @keyframes camera-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.85);
          }
        }
        
        @keyframes phone-glow {
          0%, 100% {
            opacity: 0.08;
            transform: scale(1);
          }
          50% {
            opacity: 0.12;
            transform: scale(1.05);
          }
        }
        
        @keyframes scan-line {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .sonar-wave {
          animation: sonar-expand 1.2s ease-out infinite;
        }
        
        .camera-pulse {
          animation: camera-pulse 1.5s ease-in-out infinite;
        }
        
        .phone-glow {
          animation: phone-glow 2s ease-in-out infinite;
        }
        
        .scan-line {
          animation: scan-line 2s ease-in-out infinite;
        }
        
        .scan-line-1 { animation-delay: 0s; }
        .scan-line-2 { animation-delay: 0.2s; }
        .scan-line-3 { animation-delay: 0.4s; }
        .scan-line-4 { animation-delay: 0.6s; }
      `}</style>
    </div>
  );
}