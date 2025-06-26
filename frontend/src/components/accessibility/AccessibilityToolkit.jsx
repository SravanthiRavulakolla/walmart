import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  Eye, 
  Type, 
  Palette, 
  Volume2, 
  Keyboard, 
  Focus,
  RotateCcw,
  Grid,
  List,
  Mic
} from 'lucide-react';

import { useAccessibility } from '../../contexts/AccessibilityContext';

const AccessibilityToolkit = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    theme,
    fontSize,
    fontFamily,
    focusMode,
    reducedMotion,
    keyboardNavigation,
    screenReader,
    textToSpeech,
    voiceCommands,
    layoutMode,
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
    resetToDefaults
  } = useAccessibility();

  const toggleToolkit = () => {
    setIsOpen(!isOpen);
  };

  const themeOptions = [
    { value: 'default', label: 'Default', icon: '🌟' },
    { value: 'high-contrast', label: 'High Contrast', icon: '⚫' },
    { value: 'low-stimulation', label: 'Low Stimulation', icon: '🌫️' },
    { value: 'grayscale', label: 'Grayscale', icon: '⚪' }
  ];

  const fontSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'extra-large', label: 'Extra Large' }
  ];

  return (
    <>
      {/* Floating Accessibility Button */}
      <button
        onClick={toggleToolkit}
        className={`
          fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg
          bg-walmart-blue text-white hover:bg-blue-700 transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-blue-300
          ${isOpen ? 'rotate-180' : ''}
        `}
        aria-label={isOpen ? 'Close accessibility toolkit' : 'Open accessibility toolkit'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6 mx-auto" aria-hidden="true" />
        ) : (
          <Settings className="w-6 h-6 mx-auto" aria-hidden="true" />
        )}
      </button>

      {/* Accessibility Toolkit Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Settings className="w-5 h-5 mr-2" aria-hidden="true" />
              Accessibility Toolkit
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Customize your experience
            </p>
          </div>

          <div className="p-4 space-y-6">
            {/* Theme Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Palette className="w-4 h-4 mr-2" aria-hidden="true" />
                Color Theme
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`
                      p-2 text-xs rounded-md border transition-colors focus-ring
                      ${theme === option.value
                        ? 'bg-walmart-blue text-white border-walmart-blue'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }
                    `}
                    aria-pressed={theme === option.value}
                  >
                    <span className="block text-base mb-1">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Type className="w-4 h-4 mr-2" aria-hidden="true" />
                Text Settings
              </h3>
              
              {/* Font Size */}
              <div className="mb-3">
                <label className="block text-xs text-gray-600 mb-2">Font Size</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus-ring"
                >
                  {fontSizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">Font Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFontFamily('inter')}
                    className={`
                      p-2 text-xs rounded-md border transition-colors focus-ring
                      ${fontFamily === 'inter'
                        ? 'bg-walmart-blue text-white border-walmart-blue'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }
                    `}
                    aria-pressed={fontFamily === 'inter'}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setFontFamily('dyslexic')}
                    className={`
                      p-2 text-xs rounded-md border transition-colors focus-ring font-dyslexic
                      ${fontFamily === 'dyslexic'
                        ? 'bg-walmart-blue text-white border-walmart-blue'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }
                    `}
                    aria-pressed={fontFamily === 'dyslexic'}
                  >
                    Dyslexic
                  </button>
                </div>
              </div>
            </div>

            {/* Layout Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
                Layout
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`
                    p-2 text-xs rounded-md border transition-colors focus-ring flex items-center justify-center
                    ${layoutMode === 'grid'
                      ? 'bg-walmart-blue text-white border-walmart-blue'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }
                  `}
                  aria-pressed={layoutMode === 'grid'}
                >
                  <Grid className="w-4 h-4 mr-1" aria-hidden="true" />
                  Grid
                </button>
                <button
                  onClick={() => setLayoutMode('list')}
                  className={`
                    p-2 text-xs rounded-md border transition-colors focus-ring flex items-center justify-center
                    ${layoutMode === 'list'
                      ? 'bg-walmart-blue text-white border-walmart-blue'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }
                  `}
                  aria-pressed={layoutMode === 'list'}
                >
                  <List className="w-4 h-4 mr-1" aria-hidden="true" />
                  List
                </button>
              </div>
            </div>

            {/* Toggle Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Interaction Settings
              </h3>
              <div className="space-y-2">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 flex items-center">
                    <Focus className="w-4 h-4 mr-2" aria-hidden="true" />
                    Focus Mode
                  </span>
                  <button
                    onClick={toggleFocusMode}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-ring
                      ${focusMode ? 'bg-walmart-blue' : 'bg-gray-200'}
                    `}
                    role="switch"
                    aria-checked={focusMode}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${focusMode ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 flex items-center">
                    <Keyboard className="w-4 h-4 mr-2" aria-hidden="true" />
                    Keyboard Navigation
                  </span>
                  <button
                    onClick={toggleKeyboardNavigation}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-ring
                      ${keyboardNavigation ? 'bg-walmart-blue' : 'bg-gray-200'}
                    `}
                    role="switch"
                    aria-checked={keyboardNavigation}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${keyboardNavigation ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 flex items-center">
                    <Volume2 className="w-4 h-4 mr-2" aria-hidden="true" />
                    Text-to-Speech
                  </span>
                  <button
                    onClick={toggleTextToSpeech}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-ring
                      ${textToSpeech ? 'bg-walmart-blue' : 'bg-gray-200'}
                    `}
                    role="switch"
                    aria-checked={textToSpeech}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${textToSpeech ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 flex items-center">
                    <Mic className="w-4 h-4 mr-2" aria-hidden="true" />
                    Voice Commands
                  </span>
                  <button
                    onClick={toggleVoiceCommands}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-ring
                      ${voiceCommands ? 'bg-walmart-blue' : 'bg-gray-200'}
                    `}
                    role="switch"
                    aria-checked={voiceCommands}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${voiceCommands ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </label>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={resetToDefaults}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors focus-ring"
              >
                <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close toolkit when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default AccessibilityToolkit;
