interface StatusOrbProps {
  className?: string;
  size?: number;
}

export function StatusOrb({ className = "", size = 60 }: StatusOrbProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(
            circle at 30% 30%,
            hsl(200, 98%, 75%) 0%,
            hsl(200, 98%, 50%) 30%,
            hsl(200, 98%, 39%) 60%,
            hsl(200, 98%, 28%) 100%
          )`,
          boxShadow: `
            0 4px 20px hsl(200, 98%, 39% / 0.4),
            inset 0 -3px 8px hsl(200, 98%, 20% / 0.3),
            inset 0 2px 4px hsl(0, 0%, 100% / 0.2)
          `,
        }}
      />
    </div>
  );
}
