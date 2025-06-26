import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AccessibilityContext = createContext();

// Accessibility reducer
const accessibilityReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.payload };
    case 'SET_FONT_FAMILY':
      return { ...state, fontFamily: action.payload };
    case 'TOGGLE_FOCUS_MODE':
      return { ...state, focusMode: !state.focusMode };
    case 'TOGGLE_REDUCED_MOTION':
      return { ...state, reducedMotion: !state.reducedMotion };
    case 'TOGGLE_KEYBOARD_NAV':
      return { ...state, keyboardNavigation: !state.keyboardNavigation };
    case 'TOGGLE_SCREEN_READER':
      return { ...state, screenReader: !state.screenReader };
    case 'TOGGLE_TEXT_TO_SPEECH':
      return { ...state, textToSpeech: !state.textToSpeech };
    case 'TOGGLE_VOICE_COMMANDS':
      return { ...state, voiceCommands: !state.voiceCommands };
    case 'SET_LAYOUT_MODE':
      return { ...state, layoutMode: action.payload };
    case 'LOAD_PREFERENCES':
      return { ...state, ...action.payload };
    case 'RESET_TO_DEFAULTS':
      return { ...initialState };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  theme: 'default', // default, high-contrast, low-stimulation, grayscale
  fontSize: 'medium', // small, medium, large, extra-large
  fontFamily: 'inter', // inter, dyslexic
  focusMode: false,
  reducedMotion: false,
  keyboardNavigation: false,
  screenReader: false,
  textToSpeech: false,
  voiceCommands: false,
  layoutMode: 'grid', // grid, list
  soundEnabled: true,
  animationsEnabled: true,
};

export const AccessibilityProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accessibilityReducer, initialState);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('accessibility-preferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        dispatch({ type: 'LOAD_PREFERENCES', payload: preferences });
      } catch (error) {
        console.error('Failed to load accessibility preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('accessibility-preferences', JSON.stringify(state));
    applyAccessibilitySettings(state);
  }, [state]);

  // Apply accessibility settings to DOM
  const applyAccessibilitySettings = (settings) => {
    const root = document.documentElement;
    
    // Apply theme
    root.setAttribute('data-theme', settings.theme);
    
    // Apply font size
    root.setAttribute('data-font-size', settings.fontSize);
    
    // Apply font family
    root.setAttribute('data-font-family', settings.fontFamily);
    
    // Apply focus mode
    if (settings.focusMode) {
      root.classList.add('focus-mode');
    } else {
      root.classList.remove('focus-mode');
    }
    
    // Apply reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
    
    // Apply keyboard navigation styles
    if (settings.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }
  };

  // Action creators
  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    toast.success(`Theme changed to ${theme.replace('-', ' ')}`);
  };

  const setFontSize = (fontSize) => {
    dispatch({ type: 'SET_FONT_SIZE', payload: fontSize });
    toast.success(`Font size changed to ${fontSize}`);
  };

  const setFontFamily = (fontFamily) => {
    dispatch({ type: 'SET_FONT_FAMILY', payload: fontFamily });
    const familyName = fontFamily === 'dyslexic' ? 'dyslexia-friendly' : 'standard';
    toast.success(`Font changed to ${familyName}`);
  };

  const toggleFocusMode = () => {
    dispatch({ type: 'TOGGLE_FOCUS_MODE' });
    const newState = !state.focusMode;
    toast.success(`Focus mode ${newState ? 'enabled' : 'disabled'}`);
  };

  const toggleReducedMotion = () => {
    dispatch({ type: 'TOGGLE_REDUCED_MOTION' });
    const newState = !state.reducedMotion;
    toast.success(`Reduced motion ${newState ? 'enabled' : 'disabled'}`);
  };

  const toggleKeyboardNavigation = () => {
    dispatch({ type: 'TOGGLE_KEYBOARD_NAV' });
    const newState = !state.keyboardNavigation;
    toast.success(`Keyboard navigation ${newState ? 'enabled' : 'disabled'}`);
  };

  const toggleScreenReader = () => {
    dispatch({ type: 'TOGGLE_SCREEN_READER' });
    const newState = !state.screenReader;
    toast.success(`Screen reader support ${newState ? 'enabled' : 'disabled'}`);
  };

  const toggleTextToSpeech = () => {
    dispatch({ type: 'TOGGLE_TEXT_TO_SPEECH' });
    const newState = !state.textToSpeech;
    toast.success(`Text-to-speech ${newState ? 'enabled' : 'disabled'}`);
  };

  const toggleVoiceCommands = () => {
    dispatch({ type: 'TOGGLE_VOICE_COMMANDS' });
    const newState = !state.voiceCommands;
    toast.success(`Voice commands ${newState ? 'enabled' : 'disabled'}`);
  };

  const setLayoutMode = (mode) => {
    dispatch({ type: 'SET_LAYOUT_MODE', payload: mode });
    toast.success(`Layout changed to ${mode} view`);
  };

  const resetToDefaults = () => {
    dispatch({ type: 'RESET_TO_DEFAULTS' });
    toast.success('Accessibility settings reset to defaults');
  };

  // Utility functions
  const isHighContrast = () => state.theme === 'high-contrast';
  const isLowStimulation = () => state.theme === 'low-stimulation';
  const isDyslexicFont = () => state.fontFamily === 'dyslexic';
  const isLargeText = () => ['large', 'extra-large'].includes(state.fontSize);

  const value = {
    ...state,
    setTheme,
    setFontSize,
    setFontFamily,
    toggleFocusMode,
    toggleReducedMotion,
    toggleKeyboardNavigation,
    toggleScreenReader,
    toggleTextToSpeech,
    toggleVoiceCommands,
    setLayoutMode,
    resetToDefaults,
    isHighContrast,
    isLowStimulation,
    isDyslexicFont,
    isLargeText,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook to use accessibility context
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityContext;
