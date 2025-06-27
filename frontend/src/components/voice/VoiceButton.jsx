import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const VoiceButton = ({
  onVoiceResult,
  onVoiceStart,
  onVoiceEnd,
  className = '',
  size = 'medium',
  disabled = false,
  enableWakeWord = true
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [wakeWordRecognition, setWakeWordRecognition] = useState(null);
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);

  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);

      // Main recognition instance for commands
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;

      // Wake word recognition instance (always listening)
      const wakeWordInstance = new SpeechRecognition();
      wakeWordInstance.continuous = true;
      wakeWordInstance.interimResults = true;
      wakeWordInstance.lang = 'en-US';
      wakeWordInstance.maxAlternatives = 1;

      // Event handlers
      recognitionInstance.onstart = () => {
        setIsListening(true);
        onVoiceStart?.();
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        
        onVoiceResult?.(transcript, confidence);
        
        // Provide audio feedback
        if (window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(`I heard: ${transcript}`);
          utterance.volume = 0.5;
          utterance.rate = 1.2;
          window.speechSynthesis.speak(utterance);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = 'Voice recognition failed';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not accessible. Please check permissions.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please enable microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your connection.';
            break;
          default:
            errorMessage = `Voice recognition error: ${event.error}`;
        }
        
        toast.error(errorMessage);
        onVoiceEnd?.(false, errorMessage);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        onVoiceEnd?.(true);
      };

      // Wake word recognition handlers
      wakeWordInstance.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();

        if (transcript.includes('hey senseease') || transcript.includes('hey sense ease')) {
          console.log('Wake word detected:', transcript);

          // Stop wake word recognition temporarily
          wakeWordInstance.stop();

          // Provide audio feedback
          if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance('Yes, how can I help you?');
            utterance.volume = 0.7;
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
          }

          // Start main voice recognition
          setTimeout(() => {
            startListening();
          }, 1000);
        }
      };

      wakeWordInstance.onerror = (event) => {
        console.log('Wake word recognition error:', event.error);
        // Restart wake word recognition on error
        if (enableWakeWord && event.error !== 'not-allowed') {
          setTimeout(() => {
            try {
              wakeWordInstance.start();
            } catch (e) {
              console.log('Failed to restart wake word recognition:', e);
            }
          }, 1000);
        }
      };

      wakeWordInstance.onend = () => {
        // Restart wake word recognition if it's enabled
        if (enableWakeWord && isWakeWordActive) {
          setTimeout(() => {
            try {
              wakeWordInstance.start();
            } catch (e) {
              console.log('Failed to restart wake word recognition:', e);
            }
          }, 100);
        }
      };

      setRecognition(recognitionInstance);
      setWakeWordRecognition(wakeWordInstance);
    } else {
      setIsSupported(false);
      console.warn('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
      if (wakeWordRecognition) {
        wakeWordRecognition.abort();
      }
    };
  }, []);

  // Start wake word recognition when component mounts
  useEffect(() => {
    if (enableWakeWord && wakeWordRecognition && isSupported) {
      const startWakeWord = async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          setIsWakeWordActive(true);
          wakeWordRecognition.start();
          console.log('Wake word recognition started');
        } catch (error) {
          console.log('Wake word recognition failed to start:', error);
        }
      };

      startWakeWord();
    }

    return () => {
      if (wakeWordRecognition) {
        setIsWakeWordActive(false);
        wakeWordRecognition.stop();
      }
    };
  }, [enableWakeWord, wakeWordRecognition, isSupported]);

  const startListening = async () => {
    if (!recognition || !isSupported || disabled) return;

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Stop any ongoing recognition
      recognition.stop();
      
      // Start new recognition
      setTimeout(() => {
        recognition.start();
      }, 100);
      
    } catch (error) {
      console.error('Microphone access error:', error);
      toast.error('Microphone access denied. Please enable microphone permissions.');
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }

    // Restart wake word recognition after stopping main recognition
    if (enableWakeWord && wakeWordRecognition && !isListening) {
      setTimeout(() => {
        try {
          wakeWordRecognition.start();
        } catch (e) {
          console.log('Failed to restart wake word recognition:', e);
        }
      }, 500);
    }
  };

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Size classes
  const sizeClasses = {
    small: 'w-8 h-8 p-1',
    medium: 'w-10 h-10 p-2',
    large: 'w-12 h-12 p-3'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  if (!isSupported) {
    return (
      <button
        disabled
        className={`
          ${sizeClasses[size]} 
          bg-gray-300 text-gray-500 rounded-full cursor-not-allowed
          ${className}
        `}
        title="Voice recognition not supported in this browser"
        aria-label="Voice recognition not supported"
      >
        <MicOff className={iconSizes[size]} aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          ${sizeClasses[size]}
          ${isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : isWakeWordActive
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-walmart-blue hover:bg-blue-700'
          }
          text-white rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        title={
          isListening
            ? 'Stop listening'
            : isWakeWordActive
              ? 'Voice ready - Say "Hey SenseEase" or click to start'
              : 'Start voice command'
        }
        aria-label={
          isListening
            ? 'Stop voice recognition'
            : isWakeWordActive
              ? 'Voice ready - Say "Hey SenseEase" or click to start'
              : 'Start voice recognition'
        }
        aria-pressed={isListening}
      >
        {isListening ? (
          <Volume2 className={`${iconSizes[size]} animate-pulse`} aria-hidden="true" />
        ) : (
          <Mic className={iconSizes[size]} aria-hidden="true" />
        )}
      </button>

      {/* Wake word indicator */}
      {isWakeWordActive && !isListening && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"
             title="Wake word active - Say 'Hey SenseEase'">
        </div>
      )}
    </div>
  );
};

export default VoiceButton;
