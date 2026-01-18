import { useEffect, useState } from "react";

interface WalkingRadarAnimationProps {
  className?: string;
  size?: number;
}

export function WalkingRadarAnimation({ className = "", size = 300 }: WalkingRadarAnimationProps) {
  const [walkFrame, setWalkFrame] = useState(0);

  // Walking animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setWalkFrame((prev) => (prev + 1) % 4);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  // Leg positions for walking animation
  const legPositions = [
    { left: { x1: 150, y1: 180, x2: 140, y2: 220 }, right: { x1: 150, y1: 180, x2: 160, y2: 220 } },
    { left: { x1: 150, y1: 180, x2: 135, y2: 218 }, right: { x1: 150, y1: 180, x2: 165, y2: 222 } },
    { left: { x1: 150, y1: 180, x2: 145, y2: 220 }, right: { x1: 150, y1: 180, x2: 155, y2: 220 } },
    { left: { x1: 150, y1: 180, x2: 155, y2: 222 }, right: { x1: 150, y1: 180, x2: 145, y2: 218 } },
  ];

  const currentLegs = legPositions[walkFrame];

  return (
    <div 
      className={`relative ${className}`} 
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Radar pulses emanating from phone */}
        <g className="origin-center">
          {[1, 2, 3].map((i) => (
            <circle
              key={i}
              cx="175"
              cy="140"
              r="20"
              stroke="hsl(200, 98%, 39%)"
              strokeWidth="2"
              fill="none"
              opacity="0"
              className="animate-radar-pulse"
              style={{
                animationDelay: `${i * 0.6}s`,
              }}
            />
          ))}
        </g>

        {/* Ground shadow */}
        <ellipse
          cx="150"
          cy="235"
          rx="30"
          ry="8"
          fill="hsl(200, 98%, 39%)"
          opacity="0.15"
          className="animate-shadow-pulse"
        />

        {/* Character - minimalist line art */}
        <g stroke="hsl(222, 47%, 20%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* Head */}
          <circle cx="150" cy="95" r="20" fill="none" />
          
          {/* Body */}
          <line x1="150" y1="115" x2="150" y2="180" />
          
          {/* Left arm - holding phone */}
          <path d="M150 130 L170 145 L175 140" fill="none" />
          
          {/* Right arm - swinging */}
          <line 
            x1="150" 
            y1="130" 
            x2={walkFrame % 2 === 0 ? 125 : 130} 
            y2={walkFrame % 2 === 0 ? 155 : 150}
          />
          
          {/* Left leg - animated */}
          <line 
            x1={currentLegs.left.x1} 
            y1={currentLegs.left.y1} 
            x2={currentLegs.left.x2} 
            y2={currentLegs.left.y2}
          />
          
          {/* Right leg - animated */}
          <line 
            x1={currentLegs.right.x1} 
            y1={currentLegs.right.y1} 
            x2={currentLegs.right.x2} 
            y2={currentLegs.right.y2}
          />
        </g>

        {/* Phone in hand */}
        <rect
          x="168"
          y="132"
          width="14"
          height="22"
          rx="2"
          stroke="hsl(200, 98%, 39%)"
          strokeWidth="2"
          fill="hsl(200, 98%, 39%)"
          fillOpacity="0.2"
        />
        
        {/* Phone screen glow */}
        <rect
          x="170"
          y="135"
          width="10"
          height="16"
          rx="1"
          fill="hsl(200, 98%, 60%)"
          className="animate-screen-glow"
        />

        {/* Small scanning dots */}
        {[0, 1, 2].map((i) => (
          <circle
            key={`dot-${i}`}
            cx={185 + i * 15}
            cy={140 - i * 5}
            r="3"
            fill="hsl(200, 98%, 39%)"
            className="animate-scan-dot"
            style={{
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </svg>

      <style>{`
        @keyframes radar-pulse {
          0% {
            r: 20;
            opacity: 0.6;
          }
          100% {
            r: 80;
            opacity: 0;
          }
        }
        
        @keyframes shadow-pulse {
          0%, 100% {
            rx: 30;
            opacity: 0.15;
          }
          50% {
            rx: 35;
            opacity: 0.1;
          }
        }
        
        @keyframes screen-glow {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }
        
        @keyframes scan-dot {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        .animate-radar-pulse {
          animation: radar-pulse 1.8s ease-out infinite;
        }
        
        .animate-shadow-pulse {
          animation: shadow-pulse 0.5s ease-in-out infinite;
        }
        
        .animate-screen-glow {
          animation: screen-glow 1.5s ease-in-out infinite;
        }
        
        .animate-scan-dot {
          animation: scan-dot 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}