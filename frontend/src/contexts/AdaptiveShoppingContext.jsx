import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdaptiveShoppingContext = createContext();

export const useAdaptiveShopping = () => {
  const context = useContext(AdaptiveShoppingContext);
  if (!context) {
    throw new Error('useAdaptiveShopping must be used within an AdaptiveShoppingProvider');
  }
  return context;
};

export const AdaptiveShoppingProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [stressLevel, setStressLevel] = useState(0);
  
  // Neurodiversity profile
  const [profile, setProfile] = useState({
    adhd: false,
    autism: false,
    dyslexia: false,
    anxiety: false,
    cognitiveLoad: false,
    sensoryOverload: false
  });

  // Adaptive settings
  const [adaptiveSettings, setAdaptiveSettings] = useState({
    simplifiedLayout: false,
    reducedAnimations: false,
    focusMode: false,
    highContrast: false,
    largeText: false,
    reducedColors: false,
    calmingMode: false,
    distractionFree: false,
    autoAdapt: true,
    reducedMotion: false,
    voiceNavigation: false,
    colorBlindSupport: false,
    slowMode: false,
    darkMode: false,
    dyslexiaFont: false,
    audioFeedback: false,
    hapticFeedback: false,
    screenReader: false,
    keyboardNav: false,
    stepByStep: false,
    progressIndicators: false,
    smartSuggestions: false,
    errorPrevention: false,
    confirmationPrompts: false
  });

  // Apply accessibility settings to document
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    // Remove all adaptive classes first
    body.classList.remove(
      'adaptive-high-contrast',
      'adaptive-large-text',
      'adaptive-reduced-animations',
      'adaptive-focus-mode',
      'adaptive-calming-mode',
      'adaptive-simplified',
      'adaptive-reduced-colors',
      'adaptive-dark-mode',
      'adaptive-dyslexia-font',
      'adaptive-reduced-motion'
    );

    // Apply active settings
    if (adaptiveSettings.highContrast) {
      body.classList.add('adaptive-high-contrast');
    }
    if (adaptiveSettings.largeText) {
      body.classList.add('adaptive-large-text');
    }
    if (adaptiveSettings.reducedAnimations || adaptiveSettings.reducedMotion) {
      body.classList.add('adaptive-reduced-animations');
    }
    if (adaptiveSettings.focusMode) {
      body.classList.add('adaptive-focus-mode');
    }
    if (adaptiveSettings.calmingMode) {
      body.classList.add('adaptive-calming-mode');
    }
    if (adaptiveSettings.simplifiedLayout) {
      body.classList.add('adaptive-simplified');
    }
    if (adaptiveSettings.reducedColors) {
      body.classList.add('adaptive-reduced-colors');
    }
    if (adaptiveSettings.darkMode) {
      body.classList.add('adaptive-dark-mode');
    }
    if (adaptiveSettings.dyslexiaFont) {
      body.classList.add('adaptive-dyslexia-font');
    }

    // Apply font family changes
    if (adaptiveSettings.dyslexiaFont) {
      html.style.fontFamily = 'OpenDyslexic, Arial, sans-serif';
    } else {
      html.style.fontFamily = '';
    }

    // Apply motion preferences
    if (adaptiveSettings.reducedMotion || adaptiveSettings.reducedAnimations) {
      html.style.setProperty('--animation-duration', '0.01ms');
      html.style.setProperty('--transition-duration', '0.01ms');
    } else {
      html.style.removeProperty('--animation-duration');
      html.style.removeProperty('--transition-duration');
    }

  }, [adaptiveSettings]);

  // Stress detection algorithm
  const calculateStressLevel = useCallback(() => {
    if (!isEnabled || interactions.length < 5) return 0;

    const now = Date.now();
    const recentInteractions = interactions.filter(
      interaction => now - interaction.timestamp < 60000 // Last minute
    );

    let stress = 0;

    // Rapid clicking/tapping
    const clicksPerMinute = recentInteractions.filter(i => i.type === 'click').length;
    if (clicksPerMinute > 20) stress += 3;
    else if (clicksPerMinute > 10) stress += 1;

    // Backtracking behavior
    const navigationEvents = recentInteractions.filter(i => i.type === 'navigation');
    const uniquePages = new Set(navigationEvents.map(i => i.data?.page));
    if (navigationEvents.length > uniquePages.size * 2) stress += 2;

    // Hesitation patterns
    const avgTimeBetweenInteractions = recentInteractions.length > 1 
      ? recentInteractions.reduce((sum, interaction, index) => {
          if (index === 0) return 0;
          return sum + (interaction.timestamp - recentInteractions[index - 1].timestamp);
        }, 0) / (recentInteractions.length - 1)
      : 0;

    if (avgTimeBetweenInteractions > 15000) stress += 2; // Long pauses
    if (avgTimeBetweenInteractions > 30000) stress += 3; // Very long pauses

    // Form errors
    const formErrors = recentInteractions.filter(i => i.type === 'form_error').length;
    stress += Math.min(formErrors * 2, 4);

    // Excessive scrolling
    const scrollEvents = recentInteractions.filter(i => i.type === 'scroll');
    if (scrollEvents.length > 30) stress += 1;

    // Mouse movement patterns (erratic)
    const mouseMovements = recentInteractions.filter(i => i.type === 'mouse_move');
    const erraticMovements = mouseMovements.filter(m => m.data?.speed > 100);
    if (erraticMovements.length > mouseMovements.length * 0.3) stress += 2;

    return Math.min(stress, 10); // Cap at 10
  }, [interactions, isEnabled]);

  // Auto-adapt based on stress level and profile
  useEffect(() => {
    if (!isEnabled || !adaptiveSettings.autoAdapt) return;

    const newStressLevel = calculateStressLevel();
    setStressLevel(newStressLevel);

    // Auto-enable adaptive features based on stress level
    if (newStressLevel >= 7) {
      setAdaptiveSettings(prev => ({
        ...prev,
        calmingMode: true,
        simplifiedLayout: true,
        reducedAnimations: true
      }));
    } else if (newStressLevel >= 5) {
      setAdaptiveSettings(prev => ({
        ...prev,
        focusMode: true,
        distractionFree: true
      }));
    }

    // Profile-specific adaptations
    if (profile.adhd && newStressLevel >= 4) {
      setAdaptiveSettings(prev => ({
        ...prev,
        distractionFree: true,
        focusMode: true,
        reducedAnimations: true
      }));
    }

    if (profile.autism && newStressLevel >= 3) {
      setAdaptiveSettings(prev => ({
        ...prev,
        reducedColors: true,
        calmingMode: true,
        simplifiedLayout: true
      }));
    }

    if (profile.anxiety && newStressLevel >= 3) {
      setAdaptiveSettings(prev => ({
        ...prev,
        calmingMode: true,
        reducedAnimations: true
      }));
    }

    if (profile.dyslexia) {
      setAdaptiveSettings(prev => ({
        ...prev,
        largeText: true,
        simplifiedLayout: true
      }));
    }
  }, [calculateStressLevel, isEnabled, profile, adaptiveSettings.autoAdapt]);

  const trackInteraction = useCallback((type, data) => {
    if (!isEnabled) return;

    const interaction = {
      type,
      timestamp: Date.now(),
      data
    };
    
    setInteractions(prev => [...prev.slice(-199), interaction]); // Keep last 200 interactions
  }, [isEnabled]);

  // Apply adaptive settings to DOM
  useEffect(() => {
    const body = document.body;
    
    // Remove all adaptive classes
    body.classList.remove(
      'adaptive-simplified',
      'adaptive-reduced-animations',
      'adaptive-focus-mode',
      'adaptive-high-contrast',
      'adaptive-large-text',
      'adaptive-reduced-colors',
      'adaptive-calming-mode',
      'adaptive-distraction-free'
    );

    if (!isEnabled) return;

    // Apply adaptive classes based on settings
    if (adaptiveSettings.simplifiedLayout) body.classList.add('adaptive-simplified');
    if (adaptiveSettings.reducedAnimations) body.classList.add('adaptive-reduced-animations');
    if (adaptiveSettings.focusMode) body.classList.add('adaptive-focus-mode');
    if (adaptiveSettings.highContrast) body.classList.add('adaptive-high-contrast');
    if (adaptiveSettings.largeText) body.classList.add('adaptive-large-text');
    if (adaptiveSettings.reducedColors) body.classList.add('adaptive-reduced-colors');
    if (adaptiveSettings.calmingMode) body.classList.add('adaptive-calming-mode');
    if (adaptiveSettings.distractionFree) body.classList.add('adaptive-distraction-free');
  }, [isEnabled, adaptiveSettings]);

  const value = {
    isEnabled,
    setIsEnabled,
    interactions,
    stressLevel,
    profile,
    setProfile,
    adaptiveSettings,
    setAdaptiveSettings,
    trackInteraction,
    calculateStressLevel
  };

  return (
    <AdaptiveShoppingContext.Provider value={value}>
      {children}
    </AdaptiveShoppingContext.Provider>
  );
};
