import { useEffect } from "react";
import { Mic, Camera } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useVoiceAnnouncement } from "@/hooks/useVoiceAnnouncement";

const Assist = () => {
  const { announceOnLoad } = useVoiceAnnouncement();

  useEffect(() => {
    const timer = setTimeout(() => {
      announceOnLoad(
        "Assist mode active. Camera and voice assistance are ready. Describe what you need help with."
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [announceOnLoad]);

  return (
    <Layout>
      <div
        id="aria-live-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6">
        <header className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Assistance Mode
          </h1>
          <p className="text-lg text-muted-foreground">
            Voice and camera assistance is active.
          </p>
        </header>

        <div className="mb-8 flex items-center justify-center gap-6">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
            aria-hidden="true"
          >
            <Camera className="h-12 w-12 text-primary" />
          </div>
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
            aria-hidden="true"
          >
            <Mic className="h-12 w-12 text-primary" />
          </div>
        </div>

        <p className="max-w-md text-center text-muted-foreground">
          Speak naturally to describe what you need help with. Point your camera at your surroundings for visual assistance.
        </p>
      </div>
    </Layout>
  );
};

export default Assist;
