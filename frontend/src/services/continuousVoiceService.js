/**
 * Continuous Voice Listening Service
 * Provides always-on voice detection without interrupting conversations
 */

import VoiceCommandProcessor from './voiceCommandProcessor.js';

class ContinuousVoiceService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isActive = false;
    this.commandProcessor = new VoiceCommandProcessor();
    this.callbacks = {
      onCommand: null,
      onWakeWord: null,
      onError: null,
      onStatusChange: null,
      onTranscript: null
    };
    
    // Configuration
    this.config = {
      continuous: true,
      interimResults: true,
      maxAlternatives: 3,
      lang: 'en-US',
      silenceTimeout: 3000, // 3 seconds of silence before stopping
      wakeWordTimeout: 10000, // 10 seconds to give command after wake word
      confidenceThreshold: 0.7
    };

    // State management
    this.state = {
      lastActivity: Date.now(),
      wakeWordDetected: false,
      commandMode: false,
      silenceTimer: null,
      wakeWordTimer: null,
      currentTranscript: '',
      interimTranscript: ''
    };

    this.initializeRecognition();
  }

  /**
   * Initialize speech recognition
   */
  initializeRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      this.callbacks.onError?.('Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.setupRecognitionConfig();
    this.setupRecognitionEvents();
  }

  /**
   * Configure speech recognition settings
   */
  setupRecognitionConfig() {
    if (!this.recognition) return;

    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = this.config.maxAlternatives;
    this.recognition.lang = this.config.lang;
  }

  /**
   * Setup speech recognition event handlers
   */
  setupRecognitionEvents() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      console.log('Voice recognition started');
      this.isListening = true;
      this.state.lastActivity = Date.now();
      this.callbacks.onStatusChange?.({ listening: true, active: this.isActive });
    };

    this.recognition.onresult = (event) => {
      this.handleRecognitionResult(event);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      // Handle specific errors
      if (event.error === 'not-allowed') {
        this.callbacks.onError?.('Microphone access denied. Please enable microphone permissions.');
      } else if (event.error === 'no-speech') {
        // Restart listening after no speech
        this.restartListening();
      } else {
        this.callbacks.onError?.(event.error);
      }
    };

    this.recognition.onend = () => {
      console.log('Voice recognition ended');
      this.isListening = false;
      this.callbacks.onStatusChange?.({ listening: false, active: this.isActive });

      // Auto-restart if service is active
      if (this.isActive) {
        console.log('Restarting voice recognition...');
        setTimeout(() => this.restartListening(), 100);
      }
    };
  }

  /**
   * Handle speech recognition results
   */
  handleRecognitionResult(event) {
    let interimTranscript = '';
    let finalTranscript = '';

    // Process all results
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;

      if (result.isFinal) {
        if (confidence >= this.config.confidenceThreshold) {
          finalTranscript += transcript;
        }
      } else {
        interimTranscript += transcript;
      }
    }

    // Update state
    this.state.interimTranscript = interimTranscript;
    this.state.lastActivity = Date.now();

    // Send real-time transcript to UI
    if (interimTranscript || finalTranscript) {
      const transcript = interimTranscript || finalTranscript;
      const isInterim = !!interimTranscript;
      console.log('Sending transcript to UI:', transcript, 'isInterim:', isInterim);
      this.callbacks.onTranscript?.(transcript, isInterim);
    }

    // Process final transcript
    if (finalTranscript) {
      this.processFinalTranscript(finalTranscript.trim());
    }

    // Handle interim results for wake word detection
    if (interimTranscript && !this.state.commandMode) {
      this.checkForWakeWord(interimTranscript);
    }
  }

  /**
   * Check for wake words in transcript
   */
  checkForWakeWord(transcript) {
    console.log('Checking for wake word in:', transcript);
    const isWakeWordDetected = this.commandProcessor.isWakeWordDetected(transcript);
    console.log('Wake word detected:', isWakeWordDetected);

    if (isWakeWordDetected && !this.state.wakeWordDetected) {
      console.log('Activating command mode');
      this.state.wakeWordDetected = true;
      this.state.commandMode = true;
      this.callbacks.onWakeWord?.();
      this.callbacks.onStatusChange?.({
        listening: this.isListening,
        active: this.isActive,
        commandMode: true
      });

      // Set timeout for command mode
      this.state.wakeWordTimer = setTimeout(() => {
        console.log('Command mode timeout');
        this.exitCommandMode();
      }, this.config.wakeWordTimeout);
    }
  }

  /**
   * Process final transcript
   */
  processFinalTranscript(transcript) {
    if (!transcript) return;

    console.log('Processing final transcript:', transcript);
    console.log('Command mode:', this.state.commandMode);

    // Check for wake word in final transcript too
    if (!this.state.commandMode) {
      this.checkForWakeWord(transcript);
    }

    // Get current page context
    const context = {
      currentPage: window.location.pathname,
      isActive: this.state.commandMode,
      timestamp: Date.now()
    };

    // Process command if in command mode or if transcript contains wake word
    const containsWakeWord = this.commandProcessor.isWakeWordDetected(transcript);
    if (this.state.commandMode || containsWakeWord) {
      console.log('Processing command:', transcript);
      const result = this.commandProcessor.processCommand(transcript, context);
      console.log('Command result:', result);

      // Handle result
      if (result.type !== 'wake_word_needed') {
        this.callbacks.onCommand?.(result, transcript);

        // Provide voice feedback if requested
        if (result.speak) {
          this.speak(result.speak);
        }

        // Exit command mode after processing
        if (this.state.commandMode) {
          setTimeout(() => this.exitCommandMode(), 1000);
        }
      }
    } else {
      console.log('No wake word detected, ignoring transcript');
    }
  }

  /**
   * Exit command mode
   */
  exitCommandMode() {
    console.log('Exiting command mode');
    this.state.wakeWordDetected = false;
    this.state.commandMode = false;

    if (this.state.wakeWordTimer) {
      clearTimeout(this.state.wakeWordTimer);
      this.state.wakeWordTimer = null;
    }

    // Notify UI of status change
    this.callbacks.onStatusChange?.({
      listening: this.isListening,
      active: this.isActive,
      commandMode: false
    });
  }

  /**
   * Speak text using speech synthesis
   */
  speak(text, options = {}) {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = options.volume || 0.8;
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.lang = options.lang || 'en-US';

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Start continuous listening
   */
  async start() {
    console.log('Starting voice service...');
    if (!this.recognition) {
      console.error('Speech recognition not available');
      throw new Error('Speech recognition not available');
    }

    try {
      // Request microphone permission
      console.log('Requesting microphone permission...');
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone permission granted');

      this.isActive = true;
      this.startListening();

      return true;
    } catch (error) {
      console.error('Failed to start voice service:', error);
      this.callbacks.onError?.(`Failed to access microphone: ${error.message}`);
      return false;
    }
  }

  /**
   * Stop continuous listening
   */
  stop() {
    this.isActive = false;
    this.exitCommandMode();
    
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    
    // Clear timers
    if (this.state.silenceTimer) {
      clearTimeout(this.state.silenceTimer);
      this.state.silenceTimer = null;
    }
  }

  /**
   * Start listening
   */
  startListening() {
    if (!this.recognition || this.isListening) return;

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      // Try to restart after a delay
      setTimeout(() => this.restartListening(), 1000);
    }
  }

  /**
   * Restart listening
   */
  restartListening() {
    console.log('Restart listening called, isActive:', this.isActive);
    if (!this.isActive) return;

    // Stop current recognition
    if (this.recognition && this.isListening) {
      console.log('Stopping current recognition before restart');
      this.recognition.stop();
    }

    // Start new recognition after a brief delay
    setTimeout(() => {
      if (this.isActive) {
        console.log('Restarting recognition after delay');
        this.startListening();
      } else {
        console.log('Service became inactive, cancelling restart');
      }
    }, 100);
  }

  /**
   * Set callback functions
   */
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Get current state
   */
  getState() {
    return {
      isListening: this.isListening,
      isActive: this.isActive,
      commandMode: this.state.commandMode,
      wakeWordDetected: this.state.wakeWordDetected
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    if (this.recognition) {
      this.setupRecognitionConfig();
    }
  }

  /**
   * Check if service is supported
   */
  static isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Get available voices
   */
  getAvailableVoices() {
    if (!window.speechSynthesis) return [];
    return window.speechSynthesis.getVoices();
  }

  /**
   * Test microphone access
   */
  async testMicrophone() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default ContinuousVoiceService;
