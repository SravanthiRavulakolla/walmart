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
import { useAuth } from '../contexts/AuthContext';

const PrepPalPage = () => {
  const { addToCart: addToLocalCart, isAuthenticated } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [shoppingList, setShoppingList] = useState(null);
  const [addedItems, setAddedItems] = useState(new Set());

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



  const addToCart = async (item, index) => {
    try {
      // Ensure price is a valid number
      const price = parseFloat(item.actualPrice || item.price) || 0;

      console.log('PrepPal addToCart called with:', {
        name: item.name,
        price: price,
        actualPrice: item.actualPrice,
        originalPrice: item.price,
        index: index,
        isAuthenticated: isAuthenticated
      });

      if (isAuthenticated) {
        // Use server cart for authenticated users
        const response = await fetch('/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            productId: item.productId || null,
            name: item.name,
            price: price,
            quantity: item.quantity,
            category: item.category
          })
        });

        if (response.ok) {
          setAddedItems(prev => new Set([...prev, index]));
          toast.success(`Added ${item.name} to cart!`);
          console.log('Successfully added to cart');
        } else {
          console.error('Failed to add to cart:', await response.text());
          toast.error('Failed to add item to cart');
        }
      } else {
        // Use local cart for non-authenticated users
        addToLocalCart({
          name: item.name,
          price: price,
          category: item.category,
          quantity: item.quantity
        });
        setAddedItems(prev => new Set([...prev, index]));
        toast.success(`Added ${item.name} to cart!`);
        console.log('Successfully added to local cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const addAllToCart = async () => {
    if (!shoppingList) return;

    console.log('AddAllToCart called with shoppingList:', shoppingList);
    console.log('Categories:', shoppingList.categories);
    console.log('Items:', shoppingList.items);
    console.log('Current addedItems:', addedItems);

    try {
      let successCount = 0;
      let failedCount = 0;
      const localAddedItems = new Set(addedItems); // Create a local copy to track additions

      // Process all categories and their items
      for (const category of shoppingList.categories) {
        const categoryItems = shoppingList.items.filter(item => item.category === category);
        console.log(`Processing category ${category} with ${categoryItems.length} items:`, categoryItems);

        for (let i = 0; i < categoryItems.length; i++) {
          const item = categoryItems[i];
          const itemIndex = `${category}-${i}`; // Create unique index for each item

          console.log(`Processing item ${itemIndex}:`, item.name, 'Already added:', localAddedItems.has(itemIndex));

          if (!localAddedItems.has(itemIndex)) { // Only add items that haven't been added yet
            try {
              console.log(`Adding item ${itemIndex}: ${item.name}`);
              await addToCart(item, itemIndex);
              localAddedItems.add(itemIndex); // Track locally to prevent duplicates in this batch
              successCount++;
              // Small delay to prevent overwhelming the system
              await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
              console.error(`Failed to add ${item.name}:`, error);
              failedCount++;
            }
          }
        }
      }

      if (successCount > 0) {
        toast.success(`Added ${successCount} items to cart!`);
      }
      if (failedCount > 0) {
        toast.warning(`Failed to add ${failedCount} items`);
      }
      if (successCount === 0 && failedCount === 0) {
        toast.info('All items are already in your cart!');
      }
    } catch (error) {
      console.error('Error adding all items to cart:', error);
      toast.error('Failed to add some items to cart');
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
                    onClick={addAllToCart}
                    className="bg-walmart-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium shadow-md"
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
                      <div className="grid grid-cols-1 gap-3">
                        {categoryItems.map((item, localIndex) => {
                          const itemIndex = `${category}-${localIndex}`; // Use consistent indexing
                          const isAdded = addedItems.has(itemIndex);
                          const displayPrice = parseFloat(item.actualPrice || item.price) || 0;

                          return (
                            <div key={itemIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:border-walmart-blue transition-colors">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">{item.category}</p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                                  {item.inStock !== undefined && (
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">
                                    ${displayPrice > 0 ? (displayPrice * item.quantity).toFixed(2) : 'N/A'}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    ${displayPrice > 0 ? displayPrice.toFixed(2) : 'N/A'} each
                                  </p>
                                </div>
                                <button
                                  onClick={() => addToCart(item, itemIndex)}
                                  disabled={isAdded}
                                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    isAdded
                                      ? 'bg-green-500 text-white cursor-default'
                                      : 'bg-walmart-blue text-white hover:bg-blue-700'
                                  }`}
                                >
                                  {isAdded ? 'Added to Cart' : 'Add to Cart'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
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
