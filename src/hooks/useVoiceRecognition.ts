import { useEffect, useRef, useCallback, useState } from "react";

interface UseVoiceRecognitionOptions {
  commands: { phrases: string[]; action: () => void }[];
  onCommandDetected?: (phrase: string) => void;
  enabled?: boolean;
}

export function useVoiceRecognition({
  commands,
  onCommandDetected,
  enabled = true,
}: UseVoiceRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<InstanceType<NonNullable<typeof window.SpeechRecognition>> | null>(null);
  const isProcessingRef = useRef(false);

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      console.warn("Speech recognition not supported in this browser");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      if (isProcessingRef.current) return;

      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript.toLowerCase().trim();

      // Check if any command phrase matches
      for (const command of commands) {
        for (const phrase of command.phrases) {
          if (transcript.includes(phrase.toLowerCase())) {
            isProcessingRef.current = true;
            onCommandDetected?.(phrase);
            
            // Stop listening before executing action
            recognition.stop();
            
            // Small delay to allow voice feedback
            setTimeout(() => {
              command.action();
              isProcessingRef.current = false;
            }, 1500);
            
            return;
          }
        }
      }
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      if (event.error !== "aborted" && event.error !== "no-speech") {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Restart if not processing a command and still enabled
      if (!isProcessingRef.current && enabled) {
        setTimeout(() => {
          if (!isProcessingRef.current) {
            startListening();
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [commands, onCommandDetected, enabled]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    if (enabled) {
      // Delay start to allow initial voice announcement to complete
      const timer = setTimeout(() => {
        startListening();
      }, 3000);
      return () => {
        clearTimeout(timer);
        stopListening();
      };
    } else {
      stopListening();
    }
  }, [enabled, startListening, stopListening]);

  return { isListening, startListening, stopListening };
}
