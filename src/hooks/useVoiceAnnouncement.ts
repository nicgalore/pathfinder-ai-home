import { useEffect, useCallback } from "react";

export function useVoiceAnnouncement() {
  const speak = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    // Cancel any ongoing speech
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Use a clear, accessible voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (voice) => voice.lang.startsWith("en") && voice.localService
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    }

    // Also update ARIA live region for screen readers
    const liveRegion = document.getElementById("aria-live-region");
    if (liveRegion) {
      liveRegion.setAttribute("aria-live", priority);
      liveRegion.textContent = message;
    }
  }, []);

  const announceOnLoad = useCallback((message: string) => {
    // Wait for voices to load, then speak
    if ("speechSynthesis" in window) {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        speak(message, "assertive");
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          speak(message, "assertive");
        };
      }
    }
  }, [speak]);

  return { speak, announceOnLoad };
}
