import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useAccessibility } from './contexts/AccessibilityContext';
import toast from 'react-hot-toast';

// Simple Homepage Component
const HomePage = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <div>
                <span className="text-xl font-bold text-blue-600">SenseEase</span>
                <span className="text-xs text-gray-500 block">by Walmart</span>
              </div>
            </div>
            <div className="flex space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register" className="bg-yellow-500 text-blue-900 px-4 py-2 rounded-lg hover:bg-yellow-400 font-medium transition-colors">
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Shop Smart. <br />
              <span className="text-yellow-300">Shop Calm.</span> <br />
              <span className="text-2xl md:text-3xl font-normal">Designed for Every Mind.</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
              An adaptive Walmart shopping experience tailored for cognitive and sensory needs.
              Experience shopping that adapts to you, not the other way around.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                to="/products" 
                className="bg-yellow-500 text-blue-900 hover:bg-yellow-400 text-lg px-8 py-4 rounded-lg font-medium flex items-center transition-colors"
              >
                🛒 Start Shopping
              </Link>
              <Link 
                to="/preppal" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-lg font-medium flex items-center transition-colors"
              >
                🧠 Try PrepPal
              </Link>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mt-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl mb-3">🧠</div>
                <h3 className="font-semibold mb-2">Adaptive Interface</h3>
                <p className="text-sm opacity-80">Real-time UI adjustments based on your behavior</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl mb-3">🎤</div>
                <h3 className="font-semibold mb-2">Voice Shopping</h3>
                <p className="text-sm opacity-80">Shop hands-free with voice commands</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl mb-3">👁️</div>
                <h3 className="font-semibold mb-2">Accessibility First</h3>
                <p className="text-sm opacity-80">WCAG 2.1 AA compliant with multiple themes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2">PrepPal Assistant</h3>
                <p className="text-sm opacity-80">AI-powered shopping lists from descriptions</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Simple Login Page
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const result = await login('demo@senseease.com', 'demo123');
      if (result.success) {
        navigate('/dashboard');
      } else {
        toast.error('Demo login failed');
      }
    } catch (error) {
      toast.error('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">SE</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-blue-600">SenseEase</span>
              <span className="text-sm text-gray-500 block">by Walmart</span>
            </div>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or try demo account</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Try Demo Account
              </button>
              <p className="mt-2 text-xs text-gray-500 text-center">
                Email: demo@senseease.com | Password: demo123
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-blue-600 hover:text-blue-500">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Products Page
const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Back to Home
          </Link>
        </div>
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Products Coming Soon!</h2>
          <p className="text-gray-600">Full product catalog with voice search and AI features.</p>
        </div>
      </div>
    </div>
  );
};

// Simple PrepPal Page
const PrepPalPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🧠 PrepPal AI Assistant</h1>
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Back to Home
          </Link>
        </div>
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">PrepPal Coming Soon!</h2>
          <p className="text-gray-600">AI-powered shopping list generation from natural language.</p>
        </div>
      </div>
    </div>
  );
};

// Simple Dashboard Page
const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome back!</h2>
          <p className="text-gray-600 mb-4">
            Hello {user?.firstName || 'User'}! Your personalized dashboard.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/products" className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors">
              <h3 className="font-medium text-blue-900">Browse Products</h3>
              <p className="text-sm text-blue-700">Explore our accessible catalog</p>
            </Link>
            <Link to="/preppal" className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors">
              <h3 className="font-medium text-green-900">PrepPal Assistant</h3>
              <p className="text-sm text-green-700">Generate smart shopping lists</p>
            </Link>
            <Link to="/" className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors">
              <h3 className="font-medium text-purple-900">Accessibility Settings</h3>
              <p className="text-sm text-purple-700">Customize your experience</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Accessibility Toolkit
const AccessibilityToolkit = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, updateTheme } = useAccessibility();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-colors"
        aria-label="Open accessibility settings"
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Accessibility Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Theme</h3>
              <div className="space-y-2">
                {['default', 'high-contrast', 'dark'].map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => {
                      updateTheme(themeOption);
                      toast.success(`Switched to ${themeOption} theme`);
                    }}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                      theme === themeOption
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {themeOption.charAt(0).toUpperCase() + themeOption.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Main App Component
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/preppal" element={<PrepPalPage />} />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AccessibilityToolkit />
    </div>
  );
}

export default App;
