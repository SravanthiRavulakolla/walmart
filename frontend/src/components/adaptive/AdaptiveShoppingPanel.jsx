import React, { useState, useEffect } from 'react';
import { useAdaptiveShopping } from '../../contexts/AdaptiveShoppingContext';

const AdaptiveShoppingPanel = () => {
  const {
    isEnabled,
    setIsEnabled,
    stressLevel,
    profile,
    setProfile,
    adaptiveSettings,
    setAdaptiveSettings,
    trackInteraction,
    interactions
  } = useAdaptiveShopping();

  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Track interactions with this panel
  useEffect(() => {
    trackInteraction('panel_view', { panel: 'adaptive_shopping' });
  }, [trackInteraction]);

  const handleProfileChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    trackInteraction('profile_change', { setting: key, value });
  };

  const handleSettingChange = (key, value) => {
    setAdaptiveSettings(prev => ({ ...prev, [key]: value }));
    trackInteraction('setting_change', { setting: key, value });
  };

  const getStressLevelColor = () => {
    if (stressLevel <= 3) return 'text-green-600';
    if (stressLevel <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStressLevelText = () => {
    if (stressLevel <= 3) return 'Calm';
    if (stressLevel <= 6) return 'Moderate';
    return 'High Stress';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            🧠 Adaptive Shopping Experience
          </h2>
          <p className="text-gray-600 mt-1">
            AI-powered interface that adapts to your cognitive and sensory needs
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {isEnabled && (
            <div className="text-center">
              <div className={`text-lg font-semibold ${getStressLevelColor()}`}>
                {getStressLevelText()}
              </div>
              <div className="text-sm text-gray-500">Stress Level: {stressLevel}/10</div>
            </div>
          )}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="sr-only"
            />
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isEnabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              {isEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>
      </div>

      {isEnabled && (
        <>
          {/* Profile Setup */}
          <div className="mb-6">
            <button
              onClick={() => setShowProfileSetup(!showProfileSetup)}
              className="flex items-center justify-between w-full p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">👤</span>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Neurodiversity Profile</h3>
                  <p className="text-sm text-gray-600">Tell us about your preferences and needs</p>
                </div>
              </div>
              <span className="text-gray-400">
                {showProfileSetup ? '▼' : '▶'}
              </span>
            </button>

            {showProfileSetup && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={profile.adhd}
                      onChange={(e) => handleProfileChange('adhd', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium">ADHD Support</span>
                      <p className="text-sm text-gray-600">I get easily distracted</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={profile.autism}
                      onChange={(e) => handleProfileChange('autism', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium">Autism Support</span>
                      <p className="text-sm text-gray-600">I prefer predictable layouts</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={profile.dyslexia}
                      onChange={(e) => handleProfileChange('dyslexia', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium">Dyslexia Support</span>
                      <p className="text-sm text-gray-600">I need reading assistance</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={profile.anxiety}
                      onChange={(e) => handleProfileChange('anxiety', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium">Anxiety Support</span>
                      <p className="text-sm text-gray-600">I prefer calming interfaces</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={profile.cognitiveLoad}
                      onChange={(e) => handleProfileChange('cognitiveLoad', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium">Cognitive Load</span>
                      <p className="text-sm text-gray-600">I need simplified interfaces</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={profile.sensoryOverload}
                      onChange={(e) => handleProfileChange('sensoryOverload', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium">Sensory Sensitivity</span>
                      <p className="text-sm text-gray-600">I'm sensitive to colors/motion</p>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Quick Accessibility Toggles */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              ⚡ Quick Accessibility Toolkit
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => handleSettingChange('focusMode', !adaptiveSettings.focusMode)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  adaptiveSettings.focusMode
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-sm font-medium">Focus Mode</div>
              </button>

              <button
                onClick={() => handleSettingChange('highContrast', !adaptiveSettings.highContrast)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  adaptiveSettings.highContrast
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">🌓</div>
                <div className="text-sm font-medium">High Contrast</div>
              </button>

              <button
                onClick={() => handleSettingChange('largeText', !adaptiveSettings.largeText)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  adaptiveSettings.largeText
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">🔍</div>
                <div className="text-sm font-medium">Large Text</div>
              </button>

              <button
                onClick={() => handleSettingChange('calmingMode', !adaptiveSettings.calmingMode)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  adaptiveSettings.calmingMode
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">🧘</div>
                <div className="text-sm font-medium">Calming Mode</div>
              </button>
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <button
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚙️</span>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Advanced Settings</h3>
                  <p className="text-sm text-gray-600">Fine-tune your adaptive experience</p>
                </div>
              </div>
              <span className="text-gray-400">
                {showAdvancedSettings ? '▼' : '▶'}
              </span>
            </button>

            {showAdvancedSettings && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Auto-Adaptation</span>
                  <input
                    type="checkbox"
                    checked={adaptiveSettings.autoAdapt}
                    onChange={(e) => handleSettingChange('autoAdapt', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Simplified Layout</span>
                  <input
                    type="checkbox"
                    checked={adaptiveSettings.simplifiedLayout}
                    onChange={(e) => handleSettingChange('simplifiedLayout', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Reduced Animations</span>
                  <input
                    type="checkbox"
                    checked={adaptiveSettings.reducedAnimations}
                    onChange={(e) => handleSettingChange('reducedAnimations', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Reduced Colors</span>
                  <input
                    type="checkbox"
                    checked={adaptiveSettings.reducedColors}
                    onChange={(e) => handleSettingChange('reducedColors', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Distraction-Free Mode</span>
                  <input
                    type="checkbox"
                    checked={adaptiveSettings.distractionFree}
                    onChange={(e) => handleSettingChange('distractionFree', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Demo Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              🎮 Try It Out
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-4">
                Simulate different interaction patterns to see how the adaptive system responds:
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    // Simulate rapid clicking
                    for (let i = 0; i < 15; i++) {
                      setTimeout(() => trackInteraction('click', { simulated: true }), i * 100);
                    }
                  }}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Simulate Rapid Clicking
                </button>
                <button
                  onClick={() => {
                    // Simulate form errors
                    for (let i = 0; i < 3; i++) {
                      setTimeout(() => trackInteraction('form_error', { simulated: true }), i * 500);
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Simulate Form Errors
                </button>
                <button
                  onClick={() => {
                    // Simulate navigation back and forth
                    for (let i = 0; i < 8; i++) {
                      setTimeout(() => trackInteraction('navigation', {
                        page: i % 2 === 0 ? '/products' : '/cart',
                        simulated: true
                      }), i * 300);
                    }
                  }}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Simulate Backtracking
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Current interactions tracked: {interactions.length} | Stress Level: {stressLevel}/10
              </div>
            </div>
          </div>

          {/* Real-time Feedback */}
          {stressLevel > 5 && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <h4 className="font-semibold text-yellow-800">Stress Detected</h4>
                  <p className="text-sm text-yellow-700">
                    We've noticed some signs of frustration. Would you like us to simplify the interface?
                  </p>
                  <button
                    onClick={() => {
                      handleSettingChange('calmingMode', true);
                      handleSettingChange('simplifiedLayout', true);
                    }}
                    className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Yes, Help Me Focus
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdaptiveShoppingPanel;
