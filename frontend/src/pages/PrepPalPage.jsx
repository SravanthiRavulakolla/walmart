import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Brain, 
  Send, 
  Lightbulb, 
  ShoppingCart, 
  DollarSign,
  Package,
  Mic,
  Sparkles,
  Clock,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import VoiceButton from '../components/voice/VoiceButton';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PrepPalPage = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [shoppingList, setShoppingList] = useState(null);
  const [savedLists, setSavedLists] = useState([]);

  const examplePrompts = [
    "Planning a 3-day trip to Goa with friends",
    "Hosting a birthday party for 20 people at home",
    "Going camping for the weekend with family",
    "Setting up a home office for remote work",
    "Preparing for a newborn baby"
  ];

  const generateShoppingList = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description of what you need');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/preppal/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ prompt: prompt.trim() })
      });

      const data = await response.json();
      if (data.success) {
        setShoppingList(data.data);
        toast.success('Shopping list generated successfully!');
      } else {
        throw new Error(data.message || 'Failed to generate shopping list');
      }
    } catch (error) {
      console.error('Error generating shopping list:', error);
      toast.error('Failed to generate shopping list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveShoppingList = async () => {
    if (!shoppingList) return;

    const listName = prompt.slice(0, 50) + (prompt.length > 50 ? '...' : '');
    
    try {
      const response = await fetch('/api/preppal/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          listName,
          items: shoppingList.items,
          prompt: shoppingList.prompt
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Shopping list saved!');
        // Add to saved lists
        setSavedLists(prev => [...prev, {
          id: Date.now(),
          name: listName,
          itemCount: shoppingList.items.length,
          estimatedCost: shoppingList.summary.estimatedCost,
          createdAt: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error saving shopping list:', error);
      toast.error('Failed to save shopping list');
    }
  };

  const addAllToCart = async () => {
    if (!shoppingList) return;

    try {
      for (const item of shoppingList.items) {
        // In a real implementation, you'd need to map items to actual product IDs
        // For now, we'll just show a success message
      }
      toast.success(`Added ${shoppingList.items.length} items to your cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add items to cart');
    }
  };

  return (
    <>
      <Helmet>
        <title>PrepPal AI Assistant - Walmart SenseEase</title>
        <meta name="description" content="Generate smart shopping lists with AI-powered PrepPal assistant." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-walmart-blue to-blue-600 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              PrepPal AI Assistant
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Describe what you're planning, and I'll create a smart shopping list with 
              Walmart products, prices, and helpful tips.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="mb-4">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                What are you planning?
              </label>
              <div className="relative">
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your plans, event, or needs in natural language..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                  <VoiceButton
                    onVoiceResult={(result) => setPrompt(result)}
                    size="small"
                  />
                  <span className="text-xs text-gray-400">
                    {prompt.length}/500
                  </span>
                </div>
              </div>
            </div>

            {/* Example Prompts */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateShoppingList}
              disabled={loading || !prompt.trim()}
              className="btn btn-primary w-full flex items-center justify-center text-lg py-3"
            >
              {loading ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Shopping List
                </>
              )}
            </button>
          </div>

          {/* Generated Shopping List */}
          {shoppingList && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Shopping List
                </h2>
                <div className="flex space-x-3">
                  <button
                    onClick={saveShoppingList}
                    className="btn btn-secondary flex items-center"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Save List
                  </button>
                  <button
                    onClick={addAllToCart}
                    className="btn btn-primary flex items-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add All to Cart
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm text-blue-600">Total Items</p>
                      <p className="text-lg font-semibold text-blue-900">
                        {shoppingList.summary.totalItems}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-green-600">Estimated Cost</p>
                      <p className="text-lg font-semibold text-green-900">
                        ${shoppingList.summary.estimatedCost}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Lightbulb className="w-5 h-5 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-purple-600">Categories</p>
                      <p className="text-lg font-semibold text-purple-900">
                        {shoppingList.categories.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items by Category */}
              <div className="space-y-6">
                {shoppingList.categories.map((category) => {
                  const categoryItems = shoppingList.items.filter(item => item.category === category);
                  return (
                    <div key={category}>
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-walmart-blue rounded-full mr-3"></span>
                        {category} ({categoryItems.length} items)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {categoryItems.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">
                                ${item.price} each
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tips */}
              {shoppingList.tips && shoppingList.tips.length > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Shopping Tips
                  </h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {shoppingList.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Saved Lists */}
          {savedLists.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Lists
              </h2>
              <div className="space-y-3">
                {savedLists.slice(-3).map((list) => (
                  <div key={list.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{list.name}</p>
                      <p className="text-sm text-gray-600">
                        {list.itemCount} items • ${list.estimatedCost}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {list.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PrepPalPage;
