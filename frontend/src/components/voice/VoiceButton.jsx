import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const VoiceButton = ({ 
  onVoiceResult, 
  onVoiceStart, 
  onVoiceEnd, 
  className = '', 
  size = 'medium',
  disabled = false 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      // Configure recognition
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;

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

      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
      console.warn('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

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
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${isListening 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
          : 'bg-walmart-blue hover:bg-blue-700'
        }
        text-white rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title={isListening ? 'Stop listening' : 'Start voice command'}
      aria-label={isListening ? 'Stop voice recognition' : 'Start voice recognition'}
      aria-pressed={isListening}
    >
      {isListening ? (
        <Volume2 className={`${iconSizes[size]} animate-pulse`} aria-hidden="true" />
      ) : (
        <Mic className={iconSizes[size]} aria-hidden="true" />
      )}
    </button>
  );
};

export default VoiceButton;
