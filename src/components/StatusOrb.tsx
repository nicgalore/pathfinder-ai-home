import { useRef, useEffect } from "react";

interface StatusOrbProps {
  className?: string;
  size?: number;
  isListening?: boolean;
  audioLevel?: number; // 0-1 normalized audio level
}

export function StatusOrb({ className = "", size = 60, isListening = false, audioLevel = 0 }: StatusOrbProps) {
  const rotationRef = useRef(0);
  const orbRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Detect reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Scale factor based on audio level (1.0 to 1.3 range)
  const audioScale = prefersReducedMotion ? 1 : 1 + (audioLevel * 0.3);

  // Spin animation based on audio level
  useEffect(() => {
    if (prefersReducedMotion || !isListening) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = () => {
      // Rotation speed: 0.5 to 8 degrees per frame based on audio level
      const rotationSpeed = 0.5 + (audioLevel * 7.5);
      rotationRef.current = (rotationRef.current + rotationSpeed) % 360;
      
      if (orbRef.current) {
        orbRef.current.style.transform = `scale(${audioScale}) rotate(${rotationRef.current}deg)`;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, audioLevel, audioScale, prefersReducedMotion]);

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      {/* SVG Filter for gooey effect with turbulence */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="gooey-voice">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            {/* Turbulence for shake effect when listening */}
            {!prefersReducedMotion && isListening && (
              <feTurbulence
                type="fractalNoise"
                baseFrequency={0.01 + (audioLevel * 0.04)}
                numOctaves="2"
                result="turbulence"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="0.5s"
                  values={`${0.01 + audioLevel * 0.02};${0.02 + audioLevel * 0.04};${0.01 + audioLevel * 0.02}`}
                  repeatCount="indefinite"
                />
              </feTurbulence>
            )}
            {!prefersReducedMotion && isListening && (
              <feDisplacementMap
                in="goo"
                in2="turbulence"
                scale={4 + (audioLevel * 8)}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            )}
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        ref={orbRef}
        className="rounded-full"
        style={{
          width: size,
          height: size,
          transform: prefersReducedMotion ? 'scale(1)' : `scale(${audioScale})`,
          filter: 'url(#gooey-voice)',
          background: `
            radial-gradient(
              circle at 30% 30%,
              hsl(200, 98%, 75%) 0%,
              hsl(200, 98%, 50%) 30%,
              hsl(200, 98%, 39%) 60%,
              hsl(200, 98%, 28%) 100%
            ),
            conic-gradient(
              from 0deg,
              hsl(200, 98%, 60%) 0deg,
              hsl(200, 98%, 40%) 120deg,
              hsl(200, 98%, 55%) 240deg,
              hsl(200, 98%, 60%) 360deg
            )
          `,
          backgroundBlendMode: 'overlay',
          boxShadow: `
            0 4px 20px hsl(200, 98%, 39% / ${0.4 + audioLevel * 0.3}),
            inset 0 -3px 8px hsl(200, 98%, 20% / 0.3),
            inset 0 2px 4px hsl(0, 0%, 100% / 0.2)
          `,
        }}
      />
    </div>
  );
}
