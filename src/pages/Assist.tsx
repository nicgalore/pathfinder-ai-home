import { useEffect, useState, useCallback } from "react";
import { Mic, MicOff, Camera, CameraOff } from "lucide-react";
import { Layout } from "@/components/Layout";
import { StatusOrb } from "@/components/StatusOrb";
import { useVoiceAnnouncement } from "@/hooks/useVoiceAnnouncement";
import { useMediaDevices } from "@/hooks/useMediaDevices";

const Assist = () => {
  const { announceOnLoad, speak } = useVoiceAnnouncement();
  const [caption, setCaption] = useState<string>("");
  const [captionKey, setCaptionKey] = useState(0);
  
  const showCaption = useCallback((text: string) => {
    setCaption(text);
    setCaptionKey((prev) => prev + 1);
  }, []);

  const {
    videoRef,
    isCameraActive,
    isMicActive,
    cameraError,
    micError,
    toggleCamera,
    toggleMicrophone,
  } = useMediaDevices({
    onError: (error) => {
      speak(error, "assertive");
      showCaption(error);
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const msg = "Assist mode active. Press the camera or microphone button to start.";
      announceOnLoad(msg);
      showCaption(msg);
    }, 500);

    return () => clearTimeout(timer);
  }, [announceOnLoad, showCaption]);

  const handleCameraToggle = async () => {
    const started = await toggleCamera();
    if (started) {
      const msg = "Camera activated.";
      speak(msg, "polite");
      showCaption(msg);
    } else if (!cameraError) {
      const msg = "Camera stopped.";
      speak(msg, "polite");
      showCaption(msg);
    }
  };

  const handleMicToggle = async () => {
    const started = await toggleMicrophone();
    if (started) {
      const msg = "Microphone activated. Listening.";
      speak(msg, "polite");
      showCaption(msg);
    } else if (!micError) {
      const msg = "Microphone stopped.";
      speak(msg, "polite");
      showCaption(msg);
    }
  };

  return (
    <Layout>
      {/* Full viewport container - mobile first */}
      <div className="fixed inset-0 flex flex-col pb-20">
        {/* Status Orb - Top center, transparent background */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
          style={{ paddingTop: "max(env(safe-area-inset-top, 0px) + 16px, 24px)" }}
        >
          <StatusOrb size={60} />
        </div>

        {/* Camera Feed Container - Dominant element */}
        <div 
          className="relative flex-1 bg-background overflow-hidden"
          role="img"
          aria-label={
            isCameraActive
              ? "Live camera feed showing your surroundings"
              : "Camera feed inactive"
          }
        >
          {/* Video element - fills container while maintaining aspect ratio */}
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover ${isCameraActive ? "block" : "hidden"}`}
            playsInline
            muted
            aria-hidden={!isCameraActive}
          />
          
          {/* Inactive state placeholder */}
          {!isCameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30 text-muted-foreground">
              <CameraOff className="mb-4 h-20 w-20 sm:h-24 sm:w-24" aria-hidden="true" />
              <span className="text-xl sm:text-2xl font-medium">Camera inactive</span>
              <span className="mt-2 text-base sm:text-lg text-muted-foreground/80">
                Tap the camera button to start
              </span>
            </div>
          )}


          {/* Error overlay */}
          {(cameraError || micError) && (
            <div 
              className="absolute top-20 inset-x-4 z-20 mx-auto max-w-md"
              style={{ top: "max(env(safe-area-inset-top, 0px) + 80px, 80px)" }}
            >
              <div
                role="alert"
                className="rounded-xl bg-destructive/95 backdrop-blur-sm p-4 text-center text-destructive-foreground shadow-lg"
              >
                {cameraError && <p className="font-medium">{cameraError}</p>}
                {micError && <p className="font-medium">{micError}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Caption display - lower-middle of screen, above control buttons */}
        {caption && (
          <div 
            className="absolute inset-x-0 z-10 flex justify-center px-4 pointer-events-none"
            style={{ bottom: "max(env(safe-area-inset-bottom, 0px) + 234px, 254px)" }}
          >
            <div 
              key={captionKey}
              className="max-w-xs sm:max-w-sm rounded-full bg-black/65 backdrop-blur-sm px-5 py-2 shadow-xl animate-caption-enter"
              role="status"
              aria-live="polite"
            >
              <p className="text-base sm:text-lg font-bold text-white text-center font-sans tracking-tight drop-shadow-sm">
                {caption}
              </p>
            </div>
          </div>
        )}

        {/* Control buttons overlay - bottom, above nav */}
        <div 
          className="absolute bottom-20 inset-x-0 z-10 pb-4"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px) + 16px, 16px)" }}
        >
          <div className="flex justify-center gap-6 sm:gap-8">
            {/* Camera toggle button */}
            <button
              type="button"
              onClick={handleCameraToggle}
              className={`flex h-18 w-18 sm:h-20 sm:w-20 flex-col items-center justify-center rounded-full text-sm font-semibold shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-ring focus:ring-offset-2 focus:ring-offset-transparent active:scale-95 ${
                isCameraActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/90 backdrop-blur-sm text-foreground hover:bg-background"
              }`}
              style={{ 
                minWidth: "72px", 
                minHeight: "72px",
                width: "clamp(72px, 18vw, 80px)",
                height: "clamp(72px, 18vw, 80px)"
              }}
              aria-pressed={isCameraActive}
              aria-label={isCameraActive ? "Stop camera" : "Start camera"}
            >
              {isCameraActive ? (
                <Camera className="h-8 w-8 sm:h-9 sm:w-9" aria-hidden="true" />
              ) : (
                <CameraOff className="h-8 w-8 sm:h-9 sm:w-9" aria-hidden="true" />
              )}
              <span className="mt-1 text-xs sm:text-sm">{isCameraActive ? "On" : "Off"}</span>
            </button>

            {/* Microphone toggle button */}
            <button
              type="button"
              onClick={handleMicToggle}
              className={`flex h-18 w-18 sm:h-20 sm:w-20 flex-col items-center justify-center rounded-full text-sm font-semibold shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-ring focus:ring-offset-2 focus:ring-offset-transparent active:scale-95 ${
                isMicActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/90 backdrop-blur-sm text-foreground hover:bg-background"
              }`}
              style={{ 
                minWidth: "72px", 
                minHeight: "72px",
                width: "clamp(72px, 18vw, 80px)",
                height: "clamp(72px, 18vw, 80px)"
              }}
              aria-pressed={isMicActive}
              aria-label={isMicActive ? "Stop microphone" : "Start microphone"}
            >
              {isMicActive ? (
                <Mic className="h-8 w-8 sm:h-9 sm:w-9" aria-hidden="true" />
              ) : (
                <MicOff className="h-8 w-8 sm:h-9 sm:w-9" aria-hidden="true" />
              )}
              <span className="mt-1 text-xs sm:text-sm">{isMicActive ? "On" : "Off"}</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Assist;
