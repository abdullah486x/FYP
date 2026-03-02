import { useState, useEffect, useRef, useCallback } from 'react';
import Voice from '@react-native-voice/voice';

export default function useVoiceRecognition({ scriptWords, locale, onWordMatch }) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const matchIndexRef = useRef(0);
  const isListeningRef = useRef(false);
  const restartTimerRef = useRef(null);

  // Keep ref in sync so callbacks always have the latest value
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Normalize a word — lowercase, strip punctuation
  // Works for Latin, Arabic, and Devanagari scripts
  function normalize(word) {
    return word.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff\u0900-\u097f]/g, '');
  }

  // Match recognized words against the script from the current position
  function matchWords(recognizedWords) {
    let localIndex = matchIndexRef.current;

    for (const spokenWord of recognizedWords) {
      const spoken = normalize(spokenWord);
      if (!spoken) continue;

      // Look ahead up to 8 words to handle skips or mumbled words
      for (let lookahead = 0; lookahead < 8; lookahead++) {
        const scriptIndex = localIndex + lookahead;
        if (scriptIndex >= scriptWords.length) break;

        const scriptWord = normalize(scriptWords[scriptIndex]);
        if (spoken === scriptWord) {
          localIndex = scriptIndex + 1;
          onWordMatch(scriptIndex);
          break;
        }
      }
    }

    matchIndexRef.current = localIndex;

    // If we've reached the end of the script, stop listening
    if (matchIndexRef.current >= scriptWords.length) {
      stopListening();
    }
  }

  const startListening = useCallback(async () => {
    try {
      await Voice.start(locale);
      setIsListening(true);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [locale]);

  const stopListening = useCallback(async () => {
    try {
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const resetPosition = useCallback(() => {
    matchIndexRef.current = 0;
  }, []);

  useEffect(() => {
    // Partial results fire continuously as you speak — best for real-time highlighting
    Voice.onSpeechPartialResults = (e) => {
      if (e.value && e.value.length > 0) {
        const recognizedWords = e.value[0].split(/\s+/);
        matchWords(recognizedWords);
      }
    };

    // Final result fires at the end of each sentence
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        const recognizedWords = e.value[0].split(/\s+/);
        matchWords(recognizedWords);
      }
      // Restart automatically so it keeps listening for the next sentence
      if (isListeningRef.current) {
        restartTimerRef.current = setTimeout(() => {
          startListening();
        }, 150);
      }
    };

    Voice.onSpeechError = (e) => {
      const errorMsg = e.error?.message ?? '';
      // Code 7 = "No match" — harmless, just restart
      if (isListeningRef.current) {
        restartTimerRef.current = setTimeout(() => {
          startListening();
        }, 300);
      } else {
        setError(errorMsg);
      }
    };

    Voice.onSpeechEnd = () => {
      // Don't set isListening false here — we handle restarts ourselves
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    };
  }, [startListening]);

  return { isListening, error, startListening, stopListening, resetPosition };
}
