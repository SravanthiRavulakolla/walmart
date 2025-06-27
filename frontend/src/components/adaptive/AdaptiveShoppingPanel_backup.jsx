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
      </div>
    </div>
  );
};

export default AdaptiveShoppingPanel;
