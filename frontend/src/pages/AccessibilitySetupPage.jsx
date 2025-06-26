import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Eye, 
  Ear, 
  Hand, 
  Heart,
  Save,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Lightbulb
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AccessibilitySetupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    // Cognitive preferences
    focusMode: false,
    reducedMotion: false,
    simplifiedLayout: false,
    extendedTimeouts: false,
    
    // Visual preferences
    colorScheme: 'default',
    fontSize: 'medium',
    fontFamily: 'inter',
    
    // Interaction preferences
    keyboardNavigation: false,
    screenReader: false,
    voiceCommands: false,
    textToSpeech: false,
    
    // Sensory preferences
    soundEnabled: true,
    vibrationsEnabled: true,
    animationsEnabled: true,
    
    // Shopping preferences
    gridView: true,
    showPrices: true,
    showReviews: true,
    autoSave: true
  });

  const { user } = useAuth();
  const accessibility = useAccessibility();
  const navigate = useNavigate();

  const totalSteps = 4;

  // Load existing profile on mount
  useEffect(() => {
    if (user?.neurodiverseProfile) {
      setProfile(prev => ({ ...prev, ...user.neurodiverseProfile }));
    }
  }, [user]);

  // Apply preview changes to accessibility context
  useEffect(() => {
    if (profile.colorScheme !== accessibility.theme) {
      accessibility.setTheme(profile.colorScheme);
    }
    if (profile.fontSize !== accessibility.fontSize) {
      accessibility.setFontSize(profile.fontSize);
    }
    if (profile.fontFamily !== accessibility.fontFamily) {
      accessibility.setFontFamily(profile.fontFamily);
    }
  }, [profile.colorScheme, profile.fontSize, profile.fontFamily]);

  const updateProfile = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const saveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/neurodiverse-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        toast.success('Profile saved successfully!');
        navigate('/dashboard');
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetProfile = () => {
    setProfile({
      focusMode: false,
      reducedMotion: false,
      simplifiedLayout: false,
      extendedTimeouts: false,
      colorScheme: 'default',
      fontSize: 'medium',
      fontFamily: 'inter',
      keyboardNavigation: false,
      screenReader: false,
      voiceCommands: false,
      textToSpeech: false,
      soundEnabled: true,
      vibrationsEnabled: true,
      animationsEnabled: true,
      gridView: true,
      showPrices: true,
      showReviews: true,
      autoSave: true
    });
    toast.success('Profile reset to defaults');
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Brain className="w-16 h-16 text-walmart-blue mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cognitive Preferences</h2>
              <p className="text-gray-600">Help us understand how your mind works best</p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.focusMode}
                    onChange={(e) => updateProfile('focusMode', e.target.checked)}
                    className="mt-1 w-5 h-5 text-walmart-blue focus:ring-walmart-blue border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">I get easily distracted</div>
                    <div className="text-sm text-gray-600">Enable focus mode to reduce visual clutter and highlight important elements</div>
                  </div>
                </label>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.reducedMotion}
                    onChange={(e) => updateProfile('reducedMotion', e.target.checked)}
                    className="mt-1 w-5 h-5 text-walmart-blue focus:ring-walmart-blue border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Motion and animations bother me</div>
                    <div className="text-sm text-gray-600">Reduce or eliminate animations and moving elements</div>
                  </div>
                </label>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.simplifiedLayout}
                    onChange={(e) => updateProfile('simplifiedLayout', e.target.checked)}
                    className="mt-1 w-5 h-5 text-walmart-blue focus:ring-walmart-blue border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">I prefer simpler layouts</div>
                    <div className="text-sm text-gray-600">Show fewer elements per page and use cleaner designs</div>
                  </div>
                </label>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.extendedTimeouts}
                    onChange={(e) => updateProfile('extendedTimeouts', e.target.checked)}
                    className="mt-1 w-5 h-5 text-walmart-blue focus:ring-walmart-blue border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">I need more time to read and process</div>
                    <div className="text-sm text-gray-600">Extend timeouts and provide more time for interactions</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Eye className="w-16 h-16 text-walmart-blue mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Visual Preferences</h2>
              <p className="text-gray-600">Customize colors, fonts, and visual elements</p>
            </div>

            <div className="space-y-6">
              {/* Color Scheme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Color Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'default', label: 'Default', preview: 'bg-blue-500' },
                    { value: 'high-contrast', label: 'High Contrast', preview: 'bg-black' },
                    { value: 'low-stimulation', label: 'Low Stimulation', preview: 'bg-gray-400' },
                    { value: 'grayscale', label: 'Grayscale', preview: 'bg-gray-600' }
                  ].map((theme) => (
                    <label key={theme.value} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="colorScheme"
                        value={theme.value}
                        checked={profile.colorScheme === theme.value}
                        onChange={(e) => updateProfile('colorScheme', e.target.value)}
                        className="w-4 h-4 text-walmart-blue focus:ring-walmart-blue"
                      />
                      <div className={`w-6 h-6 rounded ${theme.preview}`}></div>
                      <span className="text-sm font-medium">{theme.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Font Size</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' },
                    { value: 'extra-large', label: 'Extra Large' }
                  ].map((size) => (
                    <label key={size.value} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="fontSize"
                        value={size.value}
                        checked={profile.fontSize === size.value}
                        onChange={(e) => updateProfile('fontSize', e.target.value)}
                        className="w-4 h-4 text-walmart-blue focus:ring-walmart-blue"
                      />
                      <span className={`font-medium ${
                        size.value === 'small' ? 'text-sm' :
                        size.value === 'medium' ? 'text-base' :
                        size.value === 'large' ? 'text-lg' : 'text-xl'
                      }`}>{size.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Font Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="fontFamily"
                      value="inter"
                      checked={profile.fontFamily === 'inter'}
                      onChange={(e) => updateProfile('fontFamily', e.target.value)}
                      className="w-4 h-4 text-walmart-blue focus:ring-walmart-blue"
                    />
                    <span className="font-medium">Standard Font</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="fontFamily"
                      value="dyslexic"
                      checked={profile.fontFamily === 'dyslexic'}
                      onChange={(e) => updateProfile('fontFamily', e.target.value)}
                      className="w-4 h-4 text-walmart-blue focus:ring-walmart-blue"
                    />
                    <span className="font-medium font-dyslexic">Dyslexia-Friendly</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Hand className="w-16 h-16 text-walmart-blue mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Interaction Preferences</h2>
              <p className="text-gray-600">Choose how you prefer to navigate and interact</p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.keyboardNavigation}
                    onChange={(e) => updateProfile('keyboardNavigation', e.target.checked)}
                    className="mt-1 w-5 h-5 text-walmart-blue focus:ring-walmart-blue border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">I prefer keyboard navigation</div>
                    <div className="text-sm text-gray-600">Enhanced keyboard shortcuts and tab navigation</div>
                  </div>
                </label>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.screenReader}
                    onChange={(e) => updateProfile('screenReader', e.target.checked)}
                    className="mt-1 w-5 h-5 text-walmart-blue focus:ring-walmart-blue border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">I use a screen reader</div>
                    <div className="text-sm text-gray-600">Optimized for screen reader compatibility</div>
                  </div>
                </label>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.voiceCommands}
                    onChange={(e) => updateProfile('voiceCommands', e.target.checked)}
                    className="mt-1 w-5 h-5 text-walmart-blue focus:ring-walmart-blue border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">I want to use voice commands</div>
                    <div className="text-sm text-gray-600">Enable voice-controlled shopping and navigation</div>
                  </div>
                </label>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.textToSpeech}
                    onChange={(e) => updateProfile('textToSpeech', e.target.checked)}
                    className="mt-1 w-5 h-5 text-walmart-blue focus:ring-walmart-blue border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">I want text read aloud</div>
                    <div className="text-sm text-gray-600">Enable text-to-speech for product descriptions and content</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heart className="w-16 h-16 text-walmart-blue mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Shopping Preferences</h2>
              <p className="text-gray-600">Customize your shopping experience</p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.gridView}
                    onChange={(e) => updateProfile('gridView', e.target.checked)}
                    className="mt-1 w-5 h-5 text-walmart-blue focus:ring-walmart-blue border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">I prefer grid view for products</div>
                    <div className="text-sm text-gray-600">Show products in a grid layout instead of list view</div>
                  </div>
                </label>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.showPrices}
                    onChange={(e) => updateProfile('showPrices', e.target.checked)}
                    className="mt-1 w-5 h-5 text-walmart-blue focus:ring-walmart-blue border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Always show prices prominently</div>
                    <div className="text-sm text-gray-600">Display prices clearly and prominently on all products</div>
                  </div>
                </label>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.showReviews}
                    onChange={(e) => updateProfile('showReviews', e.target.checked)}
                    className="mt-1 w-5 h-5 text-walmart-blue focus:ring-walmart-blue border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Show customer reviews</div>
                    <div className="text-sm text-gray-600">Display customer reviews and ratings on product pages</div>
                  </div>
                </label>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.autoSave}
                    onChange={(e) => updateProfile('autoSave', e.target.checked)}
                    className="mt-1 w-5 h-5 text-walmart-blue focus:ring-walmart-blue border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Auto-save my cart and preferences</div>
                    <div className="text-sm text-gray-600">Automatically save cart items and settings</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                Your Personalized Experience
              </h3>
              <p className="text-sm text-gray-600">
                Based on your preferences, we'll customize the interface to provide a more comfortable and accessible shopping experience. 
                You can always adjust these settings later from your profile.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Accessibility Setup - Walmart SenseEase</title>
        <meta name="description" content="Customize your shopping experience with personalized accessibility settings." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-walmart-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="btn btn-secondary flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </button>
                )}
                
                <button
                  onClick={resetProfile}
                  className="btn btn-secondary flex items-center text-gray-600"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </button>
              </div>

              <div className="flex space-x-3">
                {currentStep < totalSteps ? (
                  <button
                    onClick={nextStep}
                    className="btn btn-primary flex items-center"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={saveProfile}
                    disabled={isLoading}
                    className="btn btn-primary flex items-center"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="small" className="mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessibilitySetupPage;
