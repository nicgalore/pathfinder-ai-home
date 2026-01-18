import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";

interface SpeechWaveProps {
  enabled?: boolean;
  className?: string;
}

export const SpeechWave = ({ enabled = false, className = "" }: SpeechWaveProps) => {
  const { isSpeaking, frequencyData, isListening } = useAudioAnalyzer({
    enabled,
    silenceThreshold: 0.04,
  });

  // Don't render anything if not listening or not speaking
  if (!isListening || !isSpeaking) {
    return (
      <>
        {/* Hidden status for screen readers */}
        <div className="sr-only" role="status" aria-live="polite">
          {isListening ? "Voice detection ready" : ""}
        </div>
      </>
    );
  }

  return (
    <div
      className={`flex items-end justify-center gap-1 ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      {/* Hidden status message for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        Listening to your voice
      </div>

      {/* Wave bars */}
      {frequencyData.map((level, index) => {
        const height = Math.max(4, Math.min(32, level * 64 + 4));
        const delay = index * 0.05;

        return (
          <div
            key={index}
            className="w-1 rounded-full bg-primary transition-all duration-75 ease-out"
            style={{
              height: `${height}px`,
              opacity: 0.6 + level * 0.4,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
};
