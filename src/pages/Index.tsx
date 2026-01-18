import { useEffect, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SpeechWave } from "@/components/SpeechWave";
import { useVoiceAnnouncement } from "@/hooks/useVoiceAnnouncement";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import illustrationHero from "@/assets/illustration-home-hero.png";
import illustrationLamp from "@/assets/illustration-lamp.png";

const Index = () => {
  const navigate = useNavigate();
  const { announceOnLoad, speak } = useVoiceAnnouncement();
  const [commandStatus, setCommandStatus] = useState("");

  const handleStartAssistance = useCallback(() => {
    navigate("/assist");
  }, [navigate]);

  const handleCommandDetected = useCallback((phrase: string) => {
    setCommandStatus(`Voice command detected: ${phrase}. Starting assistance.`);
    speak("Starting assistance.", "assertive");
  }, [speak]);

  const voiceCommands = useMemo(
    () => [
      {
        phrases: [
          "start assistance",
          "begin assistance", 
          "help me navigate",
          "start"
        ],
        action: handleStartAssistance,
      },
    ],
    [handleStartAssistance]
  );

  const { isListening } = useVoiceRecognition({
    commands: voiceCommands,
    onCommandDetected: handleCommandDetected,
    enabled: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      announceOnLoad(
        "PathFinder AI is ready. You can say 'Start assistance' to begin."
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [announceOnLoad]);

  return (
    <Layout>
      {/* Hidden live region for voice command status */}
      <div className="sr-only" role="status" aria-live="assertive" aria-atomic="true">
        {commandStatus}
      </div>

      {/* Decorative illustrations - hidden from screen readers */}
      <div 
        className="fixed bottom-20 left-4 opacity-40 pointer-events-none hidden sm:block"
        aria-hidden="true"
        role="presentation"
      >
        <img 
          src={illustrationLamp} 
          alt="" 
          className="w-24 md:w-32 lg:w-40"
          loading="lazy"
        />
      </div>

      <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6">
        {/* Hero illustration - subtle background */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none z-0"
          aria-hidden="true"
          role="presentation"
        >
          <img 
            src={illustrationHero} 
            alt="" 
            className="w-72 sm:w-96 md:w-[28rem]"
            loading="lazy"
          />
        </div>

        <header className="relative z-10 mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            PathFinder AI
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Voice-guided assistance to help you understand and navigate your
            surroundings.
          </p>
        </header>

        <div className="relative z-10 mb-10" role="group" aria-labelledby="action-heading">
          <h2 id="action-heading" className="sr-only">
            Primary action
          </h2>
          <button
            type="button"
            onClick={handleStartAssistance}
            className="btn-primary-large"
            aria-describedby="start-description"
          >
            <Mic className="h-8 w-8" aria-hidden="true" />
            <span>Start Assistance</span>
          </button>
        </div>

        <p
          id="start-description"
          className="relative z-10 max-w-md text-center text-base text-muted-foreground sm:text-lg"
        >
          Use your camera and voice to receive real-time guidance, object
          descriptions, and obstacle awareness.
        </p>

        {/* Speech Wave Visualization */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-10 pt-[env(safe-area-inset-top,12px)] mt-3">
          <SpeechWave enabled={isListening} className="h-8" />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
