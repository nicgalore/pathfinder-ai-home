import { useEffect } from "react";
import { Mic, MicOff, Camera, CameraOff } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SpeechWave } from "@/components/SpeechWave";
import { useVoiceAnnouncement } from "@/hooks/useVoiceAnnouncement";
import { useMediaDevices } from "@/hooks/useMediaDevices";

const Assist = () => {
  const { announceOnLoad, speak } = useVoiceAnnouncement();
  const {
    videoRef,
    isCameraActive,
    isMicActive,
    cameraError,
    micError,
    toggleCamera,
    toggleMicrophone,
  } = useMediaDevices({
    onError: (error) => speak(error, "assertive"),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      announceOnLoad(
        "Assist mode active. Press the camera or microphone button to start."
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [announceOnLoad]);

  const handleCameraToggle = async () => {
    const started = await toggleCamera();
    if (started) {
      speak("Camera activated.", "polite");
    } else if (!cameraError) {
      speak("Camera stopped.", "polite");
    }
  };

  const handleMicToggle = async () => {
    const started = await toggleMicrophone();
    if (started) {
      speak("Microphone activated. Listening.", "polite");
    } else if (!micError) {
      speak("Microphone stopped.", "polite");
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-80px)] flex-col px-6 py-8">
        <header className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Assistance Mode
          </h1>
          <p className="text-lg text-muted-foreground">
            {isCameraActive || isMicActive
              ? "Assistance is active"
              : "Tap camera or microphone to begin"}
          </p>
        </header>

        {/* Camera Feed */}
        <div
          className="relative mx-auto mb-6 w-full max-w-md overflow-hidden rounded-2xl bg-muted"
          style={{ aspectRatio: "4/3" }}
          role="img"
          aria-label={
            isCameraActive
              ? "Live camera feed showing your surroundings"
              : "Camera feed inactive"
          }
        >
          <video
            ref={videoRef}
            className={`h-full w-full object-cover ${isCameraActive ? "block" : "hidden"}`}
            playsInline
            muted
            aria-hidden={!isCameraActive}
          />
          {!isCameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <CameraOff className="mb-2 h-16 w-16" aria-hidden="true" />
              <span className="text-lg">Camera inactive</span>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-6">
          <button
            type="button"
            onClick={handleCameraToggle}
            className={`flex h-20 w-20 flex-col items-center justify-center rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-ring focus:ring-offset-2 ${
              isCameraActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            aria-pressed={isCameraActive}
            aria-label={isCameraActive ? "Stop camera" : "Start camera"}
          >
            {isCameraActive ? (
              <Camera className="h-8 w-8" aria-hidden="true" />
            ) : (
              <CameraOff className="h-8 w-8" aria-hidden="true" />
            )}
            <span className="mt-1">{isCameraActive ? "On" : "Off"}</span>
          </button>

          <button
            type="button"
            onClick={handleMicToggle}
            className={`flex h-20 w-20 flex-col items-center justify-center rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-ring focus:ring-offset-2 ${
              isMicActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            aria-pressed={isMicActive}
            aria-label={isMicActive ? "Stop microphone" : "Start microphone"}
          >
            {isMicActive ? (
              <Mic className="h-8 w-8" aria-hidden="true" />
            ) : (
              <MicOff className="h-8 w-8" aria-hidden="true" />
            )}
            <span className="mt-1">{isMicActive ? "On" : "Off"}</span>
          </button>
        </div>

        {/* Error Messages */}
        {(cameraError || micError) && (
          <div
            role="alert"
            className="mx-auto mt-6 max-w-md rounded-lg bg-destructive/10 p-4 text-center text-destructive"
          >
            {cameraError && <p>{cameraError}</p>}
            {micError && <p>{micError}</p>}
          </div>
        )}

        {/* Status Text */}
        <p className="mx-auto mt-6 max-w-md text-center text-muted-foreground">
          {isCameraActive && isMicActive
            ? "Camera and microphone are active. Point your camera at your surroundings and speak naturally."
            : isCameraActive
              ? "Camera is active. Tap microphone to enable voice input."
              : isMicActive
                ? "Microphone is active. Tap camera to see your surroundings."
                : "Tap the buttons above to activate camera or microphone assistance."}
        </p>

        {/* Speech Wave Visualization - Top center, respects safe areas */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-10 pt-[env(safe-area-inset-top,12px)] mt-3">
          <SpeechWave enabled={isMicActive} className="h-8" />
        </div>
      </div>
    </Layout>
  );
};

export default Assist;
