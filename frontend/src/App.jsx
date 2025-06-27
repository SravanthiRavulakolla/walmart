import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/SimpleAuthContext';
import { AdaptiveShoppingProvider, useAdaptiveShopping } from './contexts/AdaptiveShoppingContext';
import AdaptiveShoppingPanel from './components/adaptive/AdaptiveShoppingPanel';
import VoiceAssistant from './components/voice/VoiceAssistant';
import VoiceTestPage from './components/voice/VoiceTestPage';
import CartPage from './components/CartPage';
import useAdaptiveBehavior from './hooks/useAdaptiveBehavior';
import { ShoppingCart } from 'lucide-react';

// Walmart-style Navigation Bar Component
const NavigationBar = ({ currentPage = "" }) => {
  const { logout, cart, isAuthenticated } = useAuth();

  return (
    <nav className="bg-walmart-blue shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="bg-walmart-yellow p-2 rounded-lg">
              <span className="text-walmart-blue font-bold text-lg">SE</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SenseEase</h1>
              <p className="text-xs text-blue-200">by Walmart</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 'home'
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/preppal"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 'preppal'
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }`}
                >
                  PrepPal
                </Link>
                <Link
                  to="/adaptive"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 'adaptive'
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }`}
                >
                  Adaptive Shopping
                </Link>
                <Link
                  to="/cart"
                  className={`relative px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
                    currentPage === 'cart'
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }`}
                >
                  <span className="text-lg">🛒</span>
                  <span>Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-walmart-yellow text-walmart-blue text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
                <button
                  onClick={logout}
                  className="bg-walmart-yellow text-walmart-blue px-4 py-2 rounded-lg hover:bg-yellow-400 font-medium transition-colors ml-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-30 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-walmart-yellow text-walmart-blue px-4 py-2 rounded-lg hover:bg-yellow-400 font-medium transition-colors ml-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
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
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
        navigate('/');
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
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
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
  const { addToCart, logout } = useAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [shoppingList, setShoppingList] = useState([]);
  const [addedItems, setAddedItems] = useState(new Set());
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

  const handleAddToCart = (item, index) => {
    const cartItem = {
      name: item.name,
      category: item.category,
      price: 9.99 // Default price since this is a mock
    };
    console.log('Adding item to cart:', cartItem);
    addToCart(cartItem);
    setAddedItems(prev => new Set([...prev, index]));
  };

  const addAllToCart = () => {
    let successCount = 0;
    shoppingList.forEach((item, index) => {
      if (!addedItems.has(index)) {
        handleAddToCart(item, index);
        successCount++;
      }
    });

    if (successCount > 0) {
      // Show success feedback
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      toast.textContent = `✓ Added ${successCount} items to cart!`;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <NavigationBar currentPage="preppal" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🧠 PrepPal AI Assistant</h1>
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
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                onClick={addAllToCart}
                className="bg-walmart-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add All to Cart
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shoppingList.map((item, index) => {
                const isAdded = addedItems.has(index);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-sm text-gray-500 block">{item.category}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item, index)}
                      disabled={isAdded}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        isAdded
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-walmart-blue text-white hover:bg-blue-700'
                      }`}
                    >
                      {isAdded ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                  </div>
                );
              })}
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
  const { addToCart, logout, cart } = useAuth();
  const { isEnabled: adaptiveEnabled, stressLevel, adaptiveSettings } = useAdaptiveShopping();
  const [addedItems, setAddedItems] = useState(new Set());

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
    },
    // Birthday Party Items
    {
      id: 7,
      name: "Birthday Party Balloons Set",
      price: 12.99,
      category: "Party Supplies",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=300&fit=crop",
      description: "Colorful balloon set with 50 balloons in various colors perfect for birthday celebrations",
      accessibility: "Bright Colors, Easy to Inflate, Safe Materials, Multiple Sizes",
      inStock: true,
      rating: 4.5
    },
    {
      id: 8,
      name: "Birthday Cake Candles",
      price: 8.99,
      category: "Party Supplies",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
      description: "Set of colorful birthday candles with holders, perfect for any age celebration",
      accessibility: "Easy to Light, Drip-Free, Bright Colors, Safe Wax",
      inStock: true,
      rating: 4.6
    },
    {
      id: 9,
      name: "Party Hats & Decorations",
      price: 15.99,
      category: "Party Supplies",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop",
      description: "Complete party decoration set with hats, streamers, and banners",
      accessibility: "Bright Colors, Easy Setup, Reusable Materials, Fun Designs",
      inStock: true,
      rating: 4.4
    },
    {
      id: 10,
      name: "Birthday Cake Mix",
      price: 6.99,
      category: "Food",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop",
      description: "Easy-to-make birthday cake mix, just add water and bake",
      accessibility: "Simple Instructions, Allergen-Free Options, Quick Preparation",
      inStock: true,
      rating: 4.7
    },
    {
      id: 11,
      name: "Party Plates & Cups Set",
      price: 9.99,
      category: "Party Supplies",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=300&fit=crop",
      description: "Disposable party plates and cups set for 20 people",
      accessibility: "Easy Cleanup, Bright Colors, Sturdy Design, Eco-Friendly",
      inStock: true,
      rating: 4.3
    },
    {
      id: 12,
      name: "Birthday Gift Wrapping Kit",
      price: 11.99,
      category: "Party Supplies",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&h=300&fit=crop",
      description: "Complete gift wrapping set with paper, ribbons, and gift tags",
      accessibility: "Easy to Use, Bright Patterns, Pre-Cut Sizes, Adhesive Strips",
      inStock: true,
      rating: 4.5
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

    // Mark item as added
    setAddedItems(prev => new Set([...prev, product.id]));

    // Accessibility feedback
    if (accessibilityMode === 'audio') {
      const utterance = new SpeechSynthesisUtterance(`Added ${product.name} to cart for $${product.price}`);
      speechSynthesis.speak(utterance);
    }
    // No popup - just change button state
  };

  return (
    <div className={`min-h-screen ${accessibilityMode === 'high-contrast' ? 'bg-black text-white' : 'bg-gradient-to-br from-purple-100 to-blue-100'}`}>
      <NavigationBar currentPage="home" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className={`text-3xl font-bold ${accessibilityMode === 'high-contrast' ? 'text-yellow-400' : 'text-gray-900'}`}>
              Accessible Products
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
                      : 'bg-white border-gray-300'
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
                    : 'bg-white border-gray-300'
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
                    : 'bg-white border-gray-300'
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
                  disabled={!product.inStock || addedItems.has(product.id)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    !product.inStock
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : addedItems.has(product.id)
                        ? 'bg-green-600 text-white cursor-default'
                        : accessibilityMode === 'high-contrast'
                          ? 'bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-lg'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                  } ${accessibilityMode === 'large-text' ? 'text-lg py-4' : ''}`}
                >
                  {!product.inStock
                    ? '❌ Out of Stock'
                    : addedItems.has(product.id)
                      ? '✅ Added to Cart'
                      : '🛒 Add to Cart'
                  }
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


// Enhanced Walmart-style Adaptive Shopping Page
const AdaptiveShoppingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar currentPage="adaptive" />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-walmart-blue to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Adaptive Shopping Experience</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              AI-powered accessibility features that adapt to your unique needs, making shopping easier and more comfortable for everyone
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Adaptive Shopping Panel */}
        <AdaptiveShoppingPanel />

        {/* Enhanced Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-walmart-blue to-blue-600 text-white p-6">
            <h2 className="text-2xl font-semibold mb-2">How Adaptive Shopping Works</h2>
            <p className="text-blue-100">Powered by advanced AI and designed with accessibility experts</p>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-walmart-blue bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">Real-Time Detection</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our AI continuously monitors your interaction patterns to detect stress, confusion, or frustration,
                  ensuring a smooth shopping experience
                </p>
              </div>
              <div className="text-center">
                <div className="bg-walmart-blue bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">Instant Adaptation</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The interface automatically adjusts layout, colors, text size, and complexity
                  based on your preferences and current needs
                </p>
              </div>
              <div className="text-center">
                <div className="bg-walmart-blue bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🧠</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">Neurodiversity Support</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Specialized support for ADHD, autism, dyslexia, anxiety, and other cognitive differences
                  with evidence-based accommodations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">🌟</span>
              Key Features
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-walmart-blue rounded-full mr-3"></span>
                Voice-controlled shopping and navigation
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-walmart-blue rounded-full mr-3"></span>
                Customizable visual and sensory settings
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-walmart-blue rounded-full mr-3"></span>
                Cognitive load reduction and simplification
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-walmart-blue rounded-full mr-3"></span>
                Real-time stress monitoring and response
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-walmart-blue rounded-full mr-3"></span>
                WCAG 2.1 AA compliance and beyond
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">🏆</span>
              Awards & Recognition
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Accessibility Excellence Award 2024
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Neurodiversity Innovation Recognition
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                WCAG 2.1 AAA Certified Components
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                User Experience Excellence
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Inclusive Design Leadership
              </li>
            </ul>
          </div>
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
        <Route path="/" element={<ProductsPage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
        />
        <Route
          path="/preppal"
          element={<PrepPalPage />}
        />
        <Route
          path="/products"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/cart"
          element={<CartPage />}
        />
        <Route
          path="/adaptive"
          element={<AdaptiveShoppingPage />}
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
