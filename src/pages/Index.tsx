import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useVoiceAnnouncement } from "@/hooks/useVoiceAnnouncement";

const Index = () => {
  const navigate = useNavigate();
  const { announceOnLoad } = useVoiceAnnouncement();

  useEffect(() => {
    // Announce readiness on page load
    const timer = setTimeout(() => {
      announceOnLoad(
        "PathFinder AI is ready. Say 'Start assistance' or press the Start Assistance button."
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [announceOnLoad]);

  const handleStartAssistance = () => {
    navigate("/assist");
  };

  return (
    <Layout>
      {/* ARIA Live Region for screen reader announcements */}
      <div
        id="aria-live-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            PathFinder AI
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Voice-guided assistance to help you understand and navigate your surroundings.
          </p>
        </header>

        {/* Primary Action */}
        <div className="mb-10">
          <button
            onClick={handleStartAssistance}
            className="btn-primary-large"
            aria-describedby="start-description"
          >
            <Mic className="h-8 w-8" aria-hidden="true" />
            <span>Start Assistance</span>
          </button>
        </div>

        {/* Supporting Text */}
        <p
          id="start-description"
          className="max-w-md text-center text-base text-muted-foreground sm:text-lg"
        >
          Use your camera and voice to receive real-time guidance, object descriptions, and obstacle awareness.
        </p>
      </div>
    </Layout>
  );
};

export default Index;
