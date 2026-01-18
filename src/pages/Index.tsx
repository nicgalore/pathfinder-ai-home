import { useEffect, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic } from "lucide-react";
import { Layout } from "@/components/Layout";

import { Logo } from "@/components/Logo";
import { useVoiceAnnouncement } from "@/hooks/useVoiceAnnouncement";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";

const Index = () => {
  const navigate = useNavigate();
  const { announceOnLoad, speak } = useVoiceAnnouncement();
  const [commandStatus, setCommandStatus] = useState("");

  const handleStartAssistance = useCallback(() => {
    navigate("/assist");
  }, [navigate]);

  const handleCommandDetected = useCallback((phrase: string) => {
    setCommandStatus(`Voice command detected: ${phrase}. Navigating to Assist.`);
    speak("Navigating to Assist.", "assertive");
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


      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6">
        {/* Brand Logo - Guidance & Path Finding */}
        <Logo size={200} className="mb-8" />

        <header className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            PathFinder AI
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Voice-guided assistance to help you understand and navigate your
            surroundings.
          </p>
        </header>

        <div className="mb-10" role="group" aria-labelledby="action-heading">
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
          className="max-w-md text-center text-base text-muted-foreground sm:text-lg"
        >
          Use your camera and voice to receive real-time guidance, object
          descriptions, and obstacle awareness.
        </p>
      </div>
    </Layout>
  );
};

export default Index;
