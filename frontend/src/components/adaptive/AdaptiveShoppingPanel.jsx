import React, { useState, useEffect } from 'react';
import { useAdaptiveShopping } from '../../contexts/AdaptiveShoppingContext';
import { 
  Brain, 
  Eye, 
  Volume2, 
  Palette, 
  MousePointer, 
  Clock, 
  Heart,
  Shield,
  Zap,
  Settings,
  User,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

const AdaptiveShoppingPanel = () => {
  const {
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
  const [showSensorySettings, setShowSensorySettings] = useState(false);
  const [showCognitiveSettings, setShowCognitiveSettings] = useState(false);

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
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-6xl mx-auto">
      {/* Walmart-style Header */}
      <div className="bg-walmart-blue text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Adaptive Shopping Experience</h2>
              <p className="text-blue-100 mt-1">
                AI-powered interface that adapts to your cognitive and sensory needs
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center bg-white bg-opacity-10 p-3 rounded-lg">
              <div className={`text-lg font-semibold ${
                stressLevel <= 3 ? 'text-green-300' : 
                stressLevel <= 6 ? 'text-yellow-300' : 'text-red-300'
              }`}>
                {getStressLevelText()}
              </div>
              <div className="text-sm text-blue-100">Stress Level: {stressLevel}/10</div>
            </div>
            <div className="flex items-center bg-white bg-opacity-10 p-3 rounded-lg">
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </div>
              <span className="ml-2 text-sm font-medium text-white">
                Always Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Enhanced Neurodiversity Profile */}
        <div className="mb-6">
          <button
            onClick={() => setShowProfileSetup(!showProfileSetup)}
            className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-walmart-blue to-blue-600 text-white rounded-lg hover:from-blue-700 hover:to-blue-700 transition-all shadow-md"
          >
            <div className="flex items-center">
              <User className="h-6 w-6 mr-3" />
              <div className="text-left">
                <h3 className="font-semibold text-white">Neurodiversity Profile</h3>
                <p className="text-sm text-blue-100">Configure your personalized accessibility needs</p>
              </div>
            </div>
            <span className="text-blue-100">
              {showProfileSetup ? '▼' : '▶'}
            </span>
          </button>

          {showProfileSetup && (
            <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cognitive Conditions */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-walmart-blue" />
                    Cognitive Conditions
                  </h4>
                  
                  <label className="flex items-start space-x-3 p-3 bg-white rounded-lg border hover:border-walmart-blue transition-colors">
                    <input
                      type="checkbox"
                      checked={profile.adhd}
                      onChange={(e) => handleProfileChange('adhd', e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-walmart-blue focus:ring-walmart-blue"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">ADHD Support</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Reduces distractions, provides focus tools, and simplifies navigation
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3 bg-white rounded-lg border hover:border-walmart-blue transition-colors">
                    <input
                      type="checkbox"
                      checked={profile.autism}
                      onChange={(e) => handleProfileChange('autism', e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-walmart-blue focus:ring-walmart-blue"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Autism Spectrum Support</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Consistent layouts, clear navigation patterns, and reduced sensory input
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3 bg-white rounded-lg border hover:border-walmart-blue transition-colors">
                    <input
                      type="checkbox"
                      checked={profile.dyslexia}
                      onChange={(e) => handleProfileChange('dyslexia', e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-walmart-blue focus:ring-walmart-blue"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Dyslexia Support</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Dyslexia-friendly fonts, increased spacing, and reading assistance
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3 bg-white rounded-lg border hover:border-walmart-blue transition-colors">
                    <input
                      type="checkbox"
                      checked={profile.executiveFunction}
                      onChange={(e) => handleProfileChange('executiveFunction', e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-walmart-blue focus:ring-walmart-blue"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Executive Function Support</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Step-by-step guidance, progress tracking, and decision support
                      </p>
                    </div>
                  </label>
                </div>

                {/* Sensory & Emotional */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-walmart-blue" />
                    Sensory & Emotional Needs
                  </h4>

                  <label className="flex items-start space-x-3 p-3 bg-white rounded-lg border hover:border-walmart-blue transition-colors">
                    <input
                      type="checkbox"
                      checked={profile.anxiety}
                      onChange={(e) => handleProfileChange('anxiety', e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-walmart-blue focus:ring-walmart-blue"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Anxiety Support</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Calming colors, reduced pressure, and stress monitoring
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3 bg-white rounded-lg border hover:border-walmart-blue transition-colors">
                    <input
                      type="checkbox"
                      checked={profile.sensoryOverload}
                      onChange={(e) => handleProfileChange('sensoryOverload', e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-walmart-blue focus:ring-walmart-blue"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Sensory Sensitivity</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Reduced motion, muted colors, and minimal visual noise
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3 bg-white rounded-lg border hover:border-walmart-blue transition-colors">
                    <input
                      type="checkbox"
                      checked={profile.cognitiveLoad}
                      onChange={(e) => handleProfileChange('cognitiveLoad', e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-walmart-blue focus:ring-walmart-blue"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Cognitive Load Reduction</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Simplified interfaces, fewer choices, and clear priorities
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3 bg-white rounded-lg border hover:border-walmart-blue transition-colors">
                    <input
                      type="checkbox"
                      checked={profile.memorySupport}
                      onChange={(e) => handleProfileChange('memorySupport', e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-walmart-blue focus:ring-walmart-blue"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Memory Support</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Visual reminders, saved preferences, and progress indicators
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Quick Accessibility Toolkit */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-walmart-blue" />
            Quick Accessibility Toolkit
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <button
              onClick={() => {
                handleSettingChange('focusMode', !adaptiveSettings.focusMode);
                // Show immediate feedback
                if (!adaptiveSettings.focusMode) {
                  // Show toast notification
                  const toast = document.createElement('div');
                  toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
                  toast.textContent = '✓ Focus Mode Enabled';
                  document.body.appendChild(toast);
                  setTimeout(() => document.body.removeChild(toast), 3000);
                }
              }}
              className={`p-4 rounded-lg border-2 transition-all shadow-sm ${
                adaptiveSettings.focusMode
                  ? 'border-walmart-blue bg-walmart-blue text-white shadow-md transform scale-105'
                  : 'border-gray-200 hover:border-walmart-blue hover:shadow-md bg-white'
              }`}
            >
              <MousePointer className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Focus Mode</div>
              <div className="text-xs mt-1 opacity-75">
                {adaptiveSettings.focusMode ? 'Active' : 'Reduce distractions'}
              </div>
            </button>

            <button
              onClick={() => {
                handleSettingChange('highContrast', !adaptiveSettings.highContrast);
                // Show immediate feedback
                if (!adaptiveSettings.highContrast) {
                  const toast = document.createElement('div');
                  toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
                  toast.textContent = '✓ High Contrast Enabled';
                  document.body.appendChild(toast);
                  setTimeout(() => document.body.removeChild(toast), 3000);
                }
              }}
              className={`p-4 rounded-lg border-2 transition-all shadow-sm ${
                adaptiveSettings.highContrast
                  ? 'border-walmart-blue bg-walmart-blue text-white shadow-md transform scale-105'
                  : 'border-gray-200 hover:border-walmart-blue hover:shadow-md bg-white'
              }`}
            >
              <Eye className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">High Contrast</div>
              <div className="text-xs mt-1 opacity-75">
                {adaptiveSettings.highContrast ? 'Active' : 'Better visibility'}
              </div>
            </button>

            <button
              onClick={() => {
                handleSettingChange('largeText', !adaptiveSettings.largeText);
                // Show immediate feedback
                if (!adaptiveSettings.largeText) {
                  const toast = document.createElement('div');
                  toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
                  toast.textContent = '✓ Large Text Enabled';
                  document.body.appendChild(toast);
                  setTimeout(() => document.body.removeChild(toast), 3000);
                }
              }}
              className={`p-4 rounded-lg border-2 transition-all shadow-sm ${
                adaptiveSettings.largeText
                  ? 'border-walmart-blue bg-walmart-blue text-white shadow-md transform scale-105'
                  : 'border-gray-200 hover:border-walmart-blue hover:shadow-md bg-white'
              }`}
            >
              <div className="text-2xl mb-1">Aa</div>
              <div className="text-sm font-medium">Large Text</div>
              <div className="text-xs mt-1 opacity-75">
                {adaptiveSettings.largeText ? 'Active' : 'Easier reading'}
              </div>
            </button>

            <button
              onClick={() => handleSettingChange('calmingMode', !adaptiveSettings.calmingMode)}
              className={`p-4 rounded-lg border-2 transition-all shadow-sm ${
                adaptiveSettings.calmingMode
                  ? 'border-walmart-blue bg-walmart-blue text-white shadow-md'
                  : 'border-gray-200 hover:border-walmart-blue hover:shadow-md bg-white'
              }`}
            >
              <Heart className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Calming Mode</div>
              <div className="text-xs mt-1 opacity-75">Reduce anxiety</div>
            </button>

            <button
              onClick={() => handleSettingChange('reducedMotion', !adaptiveSettings.reducedMotion)}
              className={`p-4 rounded-lg border-2 transition-all shadow-sm ${
                adaptiveSettings.reducedMotion
                  ? 'border-walmart-blue bg-walmart-blue text-white shadow-md'
                  : 'border-gray-200 hover:border-walmart-blue hover:shadow-md bg-white'
              }`}
            >
              <div className="text-2xl mb-1">⏸️</div>
              <div className="text-sm font-medium">Reduced Motion</div>
              <div className="text-xs mt-1 opacity-75">Less movement</div>
            </button>

            <button
              onClick={() => handleSettingChange('voiceNavigation', !adaptiveSettings.voiceNavigation)}
              className={`p-4 rounded-lg border-2 transition-all shadow-sm ${
                adaptiveSettings.voiceNavigation
                  ? 'border-walmart-blue bg-walmart-blue text-white shadow-md'
                  : 'border-gray-200 hover:border-walmart-blue hover:shadow-md bg-white'
              }`}
            >
              <Volume2 className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Voice Control</div>
              <div className="text-xs mt-1 opacity-75">Hands-free shopping</div>
            </button>

            <button
              onClick={() => handleSettingChange('colorBlindSupport', !adaptiveSettings.colorBlindSupport)}
              className={`p-4 rounded-lg border-2 transition-all shadow-sm ${
                adaptiveSettings.colorBlindSupport
                  ? 'border-walmart-blue bg-walmart-blue text-white shadow-md'
                  : 'border-gray-200 hover:border-walmart-blue hover:shadow-md bg-white'
              }`}
            >
              <Palette className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Color Blind</div>
              <div className="text-xs mt-1 opacity-75">Alternative colors</div>
            </button>

            <button
              onClick={() => handleSettingChange('slowMode', !adaptiveSettings.slowMode)}
              className={`p-4 rounded-lg border-2 transition-all shadow-sm ${
                adaptiveSettings.slowMode
                  ? 'border-walmart-blue bg-walmart-blue text-white shadow-md'
                  : 'border-gray-200 hover:border-walmart-blue hover:shadow-md bg-white'
              }`}
            >
              <Clock className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Slow Mode</div>
              <div className="text-xs mt-1 opacity-75">More time to think</div>
            </button>
          </div>
        </div>

        {/* Enhanced Demo Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="text-2xl mr-2">🎮</div>
            Interactive Demo
          </h3>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <p className="text-sm text-gray-700 mb-4">
              Test how the adaptive system responds to different interaction patterns:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <button
                onClick={() => {
                  // Simulate rapid clicking
                  for (let i = 0; i < 15; i++) {
                    setTimeout(() => trackInteraction('click', { simulated: true }), i * 100);
                  }
                }}
                className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <MousePointer className="h-4 w-4 mr-2" />
                Rapid Clicking
              </button>
              <button
                onClick={() => {
                  // Simulate form errors
                  for (let i = 0; i < 3; i++) {
                    setTimeout(() => trackInteraction('form_error', { simulated: true }), i * 500);
                  }
                }}
                className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Form Errors
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
                className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <div className="text-lg mr-2">↔️</div>
                Backtracking
              </button>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  <strong>Interactions tracked:</strong> {interactions.length}
                </span>
                <span className={`font-semibold ${getStressLevelColor()}`}>
                  <strong>Stress Level:</strong> {stressLevel}/10
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Real-time Feedback */}
        {stressLevel > 5 && (
          <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3 flex-1">
                <h4 className="font-semibold text-yellow-800 mb-2">Stress Detected</h4>
                <p className="text-sm text-yellow-700 mb-4">
                  We've noticed some signs of frustration or difficulty. Would you like us to activate calming features to help you focus?
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      handleSettingChange('calmingMode', true);
                      handleSettingChange('simplifiedLayout', true);
                      handleSettingChange('reducedAnimations', true);
                    }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors shadow-sm flex items-center"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Yes, Help Me Focus
                  </button>
                  <button
                    onClick={() => {
                      // Reset stress level for demo
                      trackInteraction('stress_reset', { manual: true });
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-sm"
                  >
                    I'm Fine, Thanks
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Feedback */}
        {stressLevel <= 3 && interactions.length > 5 && (
          <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-lg shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <h4 className="font-semibold text-green-800 mb-2">Great Job!</h4>
                <p className="text-sm text-green-700">
                  You're navigating smoothly! The adaptive system is working well with your interaction style.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="bg-walmart-blue bg-opacity-5 border border-walmart-blue border-opacity-20 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Shield className="h-6 w-6 text-walmart-blue" />
            </div>
            <div className="ml-3">
              <h4 className="font-semibold text-walmart-blue mb-2">Privacy & Data Protection</h4>
              <p className="text-sm text-gray-700 mb-3">
                All behavioral data is processed locally in your browser. No personal interaction data is sent to our servers.
                Your privacy and autonomy are our top priorities.
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <Info className="h-4 w-4 mr-2" />
                <span>Learn more about our accessibility commitment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveShoppingPanel;
