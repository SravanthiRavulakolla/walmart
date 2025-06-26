import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/SimpleAuthContext';
import { AdaptiveShoppingProvider, useAdaptiveShopping } from './contexts/AdaptiveShoppingContext';
import AdaptiveShoppingPanel from './components/adaptive/AdaptiveShoppingPanel';
import VoiceAssistant from './components/voice/VoiceAssistant';
import VoiceTestPage from './components/voice/VoiceTestPage';
import CartPage from './components/CartPage';
import useAdaptiveBehavior from './hooks/useAdaptiveBehavior';

// Homepage
const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SE</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">SenseEase</span>
                <span className="ml-2 text-sm text-gray-500">by Walmart</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">Hello, {user?.firstName || 'User'}!</span>
                  <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-gray-900">Sign In</Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Shop Smart.<br />
                <span className="text-yellow-300">Shop Calm.</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                An adaptive Walmart shopping experience tailored for cognitive and sensory needs.
              </p>

              {/* Feature highlights */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
                  <span className="text-2xl mr-2">🧠</span>
                  <span className="text-sm font-medium">AI-Powered Adaptation</span>
                </div>
                <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
                  <span className="text-2xl mr-2">🎯</span>
                  <span className="text-sm font-medium">Focus Mode</span>
                </div>
                <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
                  <span className="text-2xl mr-2">🎤</span>
                  <span className="text-sm font-medium">Voice Search</span>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register" className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors text-center">
                    Start Shopping Today
                  </Link>
                  <Link to="/login" className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center">
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Adaptive Shopping Interface</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-700">🎯 Focus Mode</span>
                      <div className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-700">🌓 High Contrast</span>
                      <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-700">🔍 Large Text</span>
                      <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-pink-400 rounded-full opacity-60 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Designed for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our adaptive technology creates a personalized shopping experience that understands and responds to your unique needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🧠</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">ADHD Support</h3>
              <p className="text-gray-600">
                Distraction-free interface with focus mode and simplified layouts to help you stay on track.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🎯</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-400 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Autism Friendly</h3>
              <p className="text-gray-600">
                Predictable layouts, reduced sensory overload, and calming color schemes for comfortable shopping.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">👁️</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Visual Accessibility</h3>
              <p className="text-gray-600">
                High contrast modes, large text options, and dyslexia-friendly fonts for better readability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">15%</div>
              <div className="text-gray-600">of people are neurodiverse</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-gray-600">report better shopping experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">3x</div>
              <div className="text-gray-600">faster task completion</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">adaptive support available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Showcase */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Accessibility-First Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover products specifically chosen for their accessibility features and neurodiverse-friendly design.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Devices</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Voice-controlled devices with accessibility features
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Voice Control</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Large Display</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🪑</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ergonomic Furniture</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Sensory-friendly seating and workspace solutions
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Sensory Friendly</span>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Adjustable</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🎧</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Audio Equipment</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Noise-canceling and sensory regulation tools
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Noise Canceling</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Adaptive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Adaptive Shopping?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of users who have discovered a more comfortable and accessible way to shop online.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
              Get Started Free
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SE</span>
                </div>
                <span className="ml-2 text-xl font-bold">SenseEase</span>
              </div>
              <p className="text-gray-400">
                Making online shopping accessible and comfortable for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Adaptive Interface</li>
                <li>Voice Search</li>
                <li>Focus Mode</li>
                <li>Accessibility Tools</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>ADHD Resources</li>
                <li>Autism Support</li>
                <li>Visual Accessibility</li>
                <li>Help Center</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SenseEase by Walmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Login Page
const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setFormData({email: 'demo@senseease.com', password: 'demo123'})}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Use Demo Account
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">← Back to Home</Link>
          {' | '}
          <Link to="/register" className="text-blue-600 hover:text-blue-800 text-sm">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

// Register Page
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">← Back to Home</Link>
          {' | '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 text-sm">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

// PrepPal Page
const PrepPalPage = () => {
  const { addToCart } = useAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [shoppingList, setShoppingList] = useState([]);
  const [conversation, setConversation] = useState([
    {
      type: 'assistant',
      message: "Hi! I'm PrepPal, your AI shopping assistant. Tell me what you're planning to cook or what occasion you're preparing for, and I'll create a smart shopping list for you!"
    }
  ]);

  const generateShoppingList = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const userMessage = input.trim();
    setInput('');

    // Add user message to conversation
    setConversation(prev => [...prev, { type: 'user', message: userMessage }]);

    // Simulate AI processing
    setTimeout(() => {
      let generatedList = [];
      let response = '';

      // Simple AI logic based on keywords
      const lowerInput = userMessage.toLowerCase();

      if (lowerInput.includes('pasta') || lowerInput.includes('spaghetti') || lowerInput.includes('italian')) {
        generatedList = [
          { name: 'Spaghetti pasta', category: 'Pantry' },
          { name: 'Marinara sauce', category: 'Pantry' },
          { name: 'Ground beef', category: 'Meat' },
          { name: 'Parmesan cheese', category: 'Dairy' },
          { name: 'Garlic', category: 'Produce' },
          { name: 'Onion', category: 'Produce' },
          { name: 'Fresh basil', category: 'Produce' }
        ];
        response = "Great choice! I've created a shopping list for a delicious pasta dinner. This should serve 4 people.";
      } else if (lowerInput.includes('breakfast') || lowerInput.includes('morning')) {
        generatedList = [
          { name: 'Eggs', category: 'Dairy' },
          { name: 'Whole wheat bread', category: 'Bakery' },
          { name: 'Butter', category: 'Dairy' },
          { name: 'Orange juice', category: 'Beverages' },
          { name: 'Bananas', category: 'Produce' },
          { name: 'Greek yogurt', category: 'Dairy' },
          { name: 'Granola', category: 'Pantry' }
        ];
        response = "Perfect for a healthy breakfast! I've included protein, fruits, and whole grains to start your day right.";
      } else if (lowerInput.includes('party') || lowerInput.includes('celebration') || lowerInput.includes('birthday')) {
        generatedList = [
          { name: 'Chips and dips', category: 'Snacks' },
          { name: 'Soda variety pack', category: 'Beverages' },
          { name: 'Pizza ingredients', category: 'Various' },
          { name: 'Ice cream', category: 'Frozen' },
          { name: 'Paper plates', category: 'Household' },
          { name: 'Napkins', category: 'Household' },
          { name: 'Birthday cake', category: 'Bakery' }
        ];
        response = "Party time! I've created a list for a fun celebration with snacks, drinks, and party essentials.";
      } else {
        generatedList = [
          { name: 'Milk', category: 'Dairy' },
          { name: 'Bread', category: 'Bakery' },
          { name: 'Eggs', category: 'Dairy' },
          { name: 'Bananas', category: 'Produce' },
          { name: 'Chicken breast', category: 'Meat' },
          { name: 'Rice', category: 'Pantry' }
        ];
        response = "I've created a basic shopping list with essential items. Feel free to describe what you're planning in more detail for a customized list!";
      }

      setShoppingList(generatedList);
      setConversation(prev => [...prev, { type: 'assistant', message: response }]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🧠 PrepPal AI Assistant</h1>
          <div className="space-x-4">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
            <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          </div>
        </div>

        {/* Conversation */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Conversation</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">PrepPal is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateShoppingList()}
              placeholder="e.g., 'I'm making pasta for 4 people' or 'Planning a birthday party'"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
            <button
              onClick={generateShoppingList}
              disabled={loading || !input.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate List'}
            </button>
          </div>
        </div>

        {/* Shopping List */}
        {shoppingList.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Shopping List</h2>
              <button
                onClick={() => alert('Shopping list saved!')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
              >
                Save List
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shoppingList.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <span className="text-sm text-gray-500 block">{item.category}</span>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(item);
                      alert(`Added ${item.name} to cart!`);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Example Prompts */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Try these examples:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "I'm making spaghetti for 4 people",
              "Planning a healthy breakfast",
              "Birthday party for 10 kids",
              "Quick lunch for work",
              "Romantic dinner for two",
              "Healthy meal prep for the week"
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setInput(example)}
                className="text-left p-3 bg-white rounded-lg hover:bg-gray-50 text-blue-700 text-sm"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Products Page - Main USP Feature
const ProductsPage = () => {
  const { addToCart } = useAuth();
  const { isEnabled: adaptiveEnabled, stressLevel, adaptiveSettings } = useAdaptiveShopping();

  // Enable behavior tracking for this page
  useAdaptiveBehavior();
  const [products] = useState([
    {
      id: 1,
      name: "Apple iPhone 15 Pro",
      price: 999.99,
      originalPrice: 1099.99,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
      description: "Latest iPhone with advanced accessibility features including VoiceOver, Switch Control, and AssistiveTouch",
      accessibility: "Voice Control, Large Print, High Contrast, Switch Control",
      inStock: true,
      rating: 4.8,
      discount: 9
    },
    {
      id: 2,
      name: "Sony WH-1000XM5 Headphones",
      price: 349.99,
      originalPrice: 399.99,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
      description: "Premium noise-canceling headphones with adaptive sound control for sensory sensitivities",
      accessibility: "Noise Canceling, Touch Controls, Voice Assistant, Adaptive Sound",
      inStock: true,
      rating: 4.7,
      discount: 12
    },
    {
      id: 3,
      name: "Ergonomic Office Chair",
      price: 299.99,
      category: "Furniture",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
      description: "Specially designed chair with lumbar support, perfect for users with ADHD or autism",
      accessibility: "Sensory-Friendly Fabric, Adjustable Height, Lumbar Support, Quiet Movement",
      inStock: true,
      rating: 4.6
    },
    {
      id: 4,
      name: "Large Button Phone",
      price: 79.99,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
      description: "Senior-friendly phone with large, high-contrast buttons and amplified sound",
      accessibility: "Large Buttons, High Contrast Display, Amplified Sound, Simple Interface",
      inStock: true,
      rating: 4.5
    },
    {
      id: 5,
      name: "Weighted Blanket",
      price: 89.99,
      category: "Home",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=300&fit=crop",
      description: "Therapeutic weighted blanket for anxiety relief and better sleep",
      accessibility: "Sensory Regulation, Anxiety Relief, Breathable Fabric, Multiple Weights",
      inStock: true,
      rating: 4.9
    },
    {
      id: 6,
      name: "Fidget Stress Relief Kit",
      price: 24.99,
      category: "Health",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop",
      description: "Complete fidget kit with various textures and tools for focus and stress relief",
      accessibility: "Tactile Stimulation, Focus Enhancement, Quiet Operation, Portable Design",
      inStock: true,
      rating: 4.8
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [isListening, setIsListening] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState('default');

  // Voice Search Functionality
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        alert('Voice search not available. Please type your search.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Voice search is not supported in your browser.');
    }
  };

  // Filter and sort products
  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return a.name.localeCompare(b.name);
      }
    });

  const handleAddToCart = (product) => {
    addToCart({
      name: product.name,
      category: product.category,
      price: product.price
    });

    // Accessibility feedback
    if (accessibilityMode === 'audio') {
      const utterance = new SpeechSynthesisUtterance(`Added ${product.name} to cart for $${product.price}`);
      speechSynthesis.speak(utterance);
    } else {
      alert(`Added ${product.name} to cart!`);
    }
  };

  return (
    <div className={`min-h-screen py-8 ${accessibilityMode === 'high-contrast' ? 'bg-black text-white' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className={`text-3xl font-bold ${accessibilityMode === 'high-contrast' ? 'text-yellow-400' : 'text-gray-900'}`}>
              🛒 Accessible Products
            </h1>
            {adaptiveEnabled && (
              <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full">
                <span className="text-purple-600 text-sm">🧠 Adaptive Mode</span>
                {stressLevel > 5 && (
                  <span className="text-orange-600 text-xs">⚠️ High Stress</span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {adaptiveEnabled && (
              <Link to="/adaptive" className="text-purple-600 hover:text-purple-800 text-sm">
                ⚙️ Adaptive Settings
              </Link>
            )}
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
            <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          </div>
        </div>

        {/* Accessibility Controls */}
        <div className={`rounded-lg shadow p-4 mb-6 ${accessibilityMode === 'high-contrast' ? 'bg-gray-900 border-2 border-yellow-400' : 'bg-white'}`}>
          <h2 className={`text-lg font-semibold mb-3 ${accessibilityMode === 'high-contrast' ? 'text-yellow-400' : 'text-gray-900'}`}>
            ♿ Accessibility Settings
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setAccessibilityMode('default')}
              className={`px-4 py-2 rounded ${accessibilityMode === 'default' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Default View
            </button>
            <button
              onClick={() => setAccessibilityMode('high-contrast')}
              className={`px-4 py-2 rounded ${accessibilityMode === 'high-contrast' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700'}`}
            >
              High Contrast
            </button>
            <button
              onClick={() => setAccessibilityMode('large-text')}
              className={`px-4 py-2 rounded ${accessibilityMode === 'large-text' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Large Text
            </button>
            <button
              onClick={() => setAccessibilityMode('audio')}
              className={`px-4 py-2 rounded ${accessibilityMode === 'audio' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Audio Feedback
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`rounded-lg shadow p-6 mb-6 ${accessibilityMode === 'high-contrast' ? 'bg-gray-900 border-2 border-yellow-400' : 'bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Voice Search */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${accessibilityMode === 'high-contrast' ? 'text-yellow-400' : 'text-gray-700'}`}>
                🎤 Search Products (Voice or Text)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for products..."
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    accessibilityMode === 'high-contrast'
                      ? 'bg-black text-yellow-400 border-yellow-400'
                      : 'border-gray-300'
                  } ${accessibilityMode === 'large-text' ? 'text-lg' : ''}`}
                />
                <button
                  onClick={startVoiceSearch}
                  disabled={isListening}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isListening ? '🎤 Listening...' : '🎤 Voice'}
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${accessibilityMode === 'high-contrast' ? 'text-yellow-400' : 'text-gray-700'}`}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  accessibilityMode === 'high-contrast'
                    ? 'bg-black text-yellow-400 border-yellow-400'
                    : 'border-gray-300'
                } ${accessibilityMode === 'large-text' ? 'text-lg' : ''}`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${accessibilityMode === 'high-contrast' ? 'text-yellow-400' : 'text-gray-700'}`}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  accessibilityMode === 'high-contrast'
                    ? 'bg-black text-yellow-400 border-yellow-400'
                    : 'border-gray-300'
                } ${accessibilityMode === 'large-text' ? 'text-lg' : ''}`}
              >
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                accessibilityMode === 'high-contrast'
                  ? 'bg-gray-900 border-2 border-yellow-400'
                  : 'bg-white'
              } ${!product.inStock ? 'opacity-60' : ''}`}
            >
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center">
                  <span className="text-6xl">🛍️</span>
                </div>

                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{product.discount}%
                  </div>
                )}

                {/* Stock Status */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-bold ${
                    accessibilityMode === 'high-contrast' ? 'text-yellow-400' : 'text-gray-900'
                  } ${accessibilityMode === 'large-text' ? 'text-xl' : 'text-lg'}`}>
                    {product.name}
                  </h3>
                  <div className="flex items-center ml-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className={`ml-1 text-sm font-medium ${
                      accessibilityMode === 'high-contrast' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {product.rating}
                    </span>
                  </div>
                </div>

                <p className={`text-sm mb-3 line-clamp-2 ${
                  accessibilityMode === 'high-contrast' ? 'text-gray-300' : 'text-gray-600'
                } ${accessibilityMode === 'large-text' ? 'text-base' : ''}`}>
                  {product.description}
                </p>

                <div className={`text-xs mb-4 p-3 rounded-lg ${
                  accessibilityMode === 'high-contrast' ? 'bg-gray-800 text-green-400' : 'bg-green-50 text-green-700'
                } ${accessibilityMode === 'large-text' ? 'text-sm' : ''}`}>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">♿</span>
                    <span className="font-medium">Accessibility Features:</span>
                  </div>
                  <div className="mt-1 text-xs opacity-90">
                    {product.accessibility}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold text-xl ${
                      accessibilityMode === 'high-contrast' ? 'text-yellow-400' : 'text-green-600'
                    } ${accessibilityMode === 'large-text' ? 'text-2xl' : ''}`}>
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-gray-500 line-through text-sm">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    accessibilityMode === 'high-contrast' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {product.category}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    product.inStock
                      ? accessibilityMode === 'high-contrast'
                        ? 'bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-lg'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  } ${accessibilityMode === 'large-text' ? 'text-lg py-4' : ''}`}
                >
                  {product.inStock ? '🛒 Add to Cart' : '❌ Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className={`text-center py-12 ${accessibilityMode === 'high-contrast' ? 'text-gray-300' : 'text-gray-500'}`}>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Adaptive Shopping Page
const AdaptiveShoppingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Adaptive Shopping Experience</h1>
            <p className="text-gray-600 mt-2">Configure your personalized shopping interface</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
            <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          </div>
        </div>

        {/* Adaptive Shopping Panel */}
        <AdaptiveShoppingPanel />

        {/* Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How Adaptive Shopping Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-Time Detection</h3>
              <p className="text-sm text-gray-600">
                Our AI monitors your interaction patterns to detect stress, confusion, or frustration
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Adaptation</h3>
              <p className="text-sm text-gray-600">
                The interface automatically adjusts layout, colors, and complexity based on your needs
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-semibold text-gray-900 mb-2">Neurodiversity Support</h3>
              <p className="text-sm text-gray-600">
                Specialized support for ADHD, autism, dyslexia, and other cognitive differences
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-blue-600 text-xl mr-3">🔒</div>
            <div>
              <h4 className="font-semibold text-blue-900">Privacy & Data</h4>
              <p className="text-sm text-blue-700 mt-1">
                All behavioral data is processed locally in your browser. No personal interaction data is sent to our servers.
                Your privacy and autonomy are our top priorities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Page
const DashboardPage = () => {
  const { user, logout, cart, removeFromCart, clearCart } = useAuth();
  const [showCart, setShowCart] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
            >
              <span>🛒</span>
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.firstName}!</h2>
          <p className="text-gray-600 mb-4">Email: {user?.email}</p>
          <p className="text-gray-600">You are successfully logged in with JWT authentication!</p>
        </div>

        {/* Cart Display */}
        {showCart && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Cart ({cart.length} items)</h2>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty. Add items from PrepPal!</p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <div className="text-sm text-gray-500">
                        {item.category} • Quantity: {item.quantity}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-300 rounded hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t">
                  <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium">
                    Proceed to Checkout ({cart.reduce((total, item) => total + item.quantity, 0)} items)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/preppal" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">PrepPal AI Assistant</h3>
            <p className="text-gray-600">Generate smart shopping lists from natural language descriptions. Just tell PrepPal what you're planning!</p>
            <div className="mt-4 text-blue-600 font-medium">Try PrepPal →</div>
          </Link>

          <Link to="/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Accessible Products</h3>
            <p className="text-gray-600">Browse our accessible product catalog with voice search, adaptive UI, and accessibility features.</p>
            <div className="mt-4 text-blue-600 font-medium">Shop Now →</div>
          </Link>

          <Link to="/adaptive" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-2 border-purple-200">
            <div className="text-4xl mb-4">🧠✨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Adaptive Shopping</h3>
            <p className="text-gray-600">AI-powered interface that adapts to your cognitive and sensory needs in real-time.</p>
            <div className="mt-4 text-purple-600 font-medium">Configure Now →</div>
            <div className="mt-2 text-xs text-purple-500 bg-purple-50 px-2 py-1 rounded">🌟 NEW FEATURE</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Main App
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <AdaptiveShoppingProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/preppal"
          element={isAuthenticated ? <PrepPalPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/products"
          element={isAuthenticated ? <ProductsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/cart"
          element={isAuthenticated ? <CartPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/adaptive"
          element={isAuthenticated ? <AdaptiveShoppingPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/voice-test"
          element={<VoiceTestPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Voice Assistant - Available globally when authenticated */}
      {isAuthenticated && <VoiceAssistant />}
    </AdaptiveShoppingProvider>
  );
}

export default App;
