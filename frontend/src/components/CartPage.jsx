import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/SimpleAuthContext';
import { Trash2, Plus, Minus, ShoppingBag, Truck, ArrowLeft, CreditCard, Shield } from 'lucide-react';

// Navigation Bar Component (copied from App.jsx)
const NavigationBar = ({ currentPage = "" }) => {
  const { logout, cart, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">🛒 SenseEase</h1>
          </div>
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`font-medium ${currentPage === 'home' ? 'text-gray-500' : 'text-blue-600 hover:text-blue-800'}`}
                >
                  Home
                </Link>
                <Link
                  to="/preppal"
                  className={`font-medium ${currentPage === 'preppal' ? 'text-gray-500' : 'text-blue-600 hover:text-blue-800'}`}
                >
                  PrepPal
                </Link>
                <Link
                  to="/adaptive"
                  className={`font-medium ${currentPage === 'adaptive' ? 'text-gray-500' : 'text-blue-600 hover:text-blue-800'}`}
                >
                  Adaptive Shopping
                </Link>
                <Link
                  to="/cart"
                  className={`relative font-medium flex items-center space-x-1 ${currentPage === 'cart' ? 'text-gray-500' : 'text-blue-600 hover:text-blue-800'}`}
                >
                  <span>🛒</span>
                  <span>Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-blue-600 px-4 py-2 rounded hover:bg-yellow-300 font-medium transition-colors ml-2"
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

const CartPage = () => {
  const navigate = useNavigate();
  const { logout, token, isAuthenticated, cart, updateQuantity: updateLocalQuantity, removeFromCart: removeFromLocalCart, clearCart: clearLocalCart, addToCart } = useAuth();
  const [serverCart, setServerCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingLocalCart, setUsingLocalCart] = useState(!isAuthenticated);

  // Initialize cart based on authentication status
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      console.log('Not authenticated, using local cart:', cart);
      setUsingLocalCart(true);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Watch for changes in the local cart
  useEffect(() => {
    console.log('Cart useEffect triggered - cart:', cart, 'isAuthenticated:', isAuthenticated);
    if (!isAuthenticated) {
      console.log('Local cart updated:', cart);
      setUsingLocalCart(true);
      setLoading(false);
    }
  }, [cart, isAuthenticated]);

  // Force re-render when cart changes
  useEffect(() => {
    console.log('Cart state changed, forcing re-render');
  }, [cart]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      if (!isAuthenticated || !token) {
        // Use local cart for non-authenticated users
        console.log('Using local cart for non-authenticated user:', cart);
        setUsingLocalCart(true);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Cart API response:', data); // Debug log

        // Handle different possible response structures
        if (data.success && data.data && data.data.items) {
          setServerCart(data.data.items);
        } else if (data.success && Array.isArray(data.data)) {
          setServerCart(data.data);
        } else if (Array.isArray(data)) {
          setServerCart(data);
        } else {
          setServerCart([]);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch cart`);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);

      // Fallback to local cart if API fails
      if (cart && cart.length > 0) {
        console.log('Using local cart as fallback');
        setUsingLocalCart(true);
        setError(null);
      } else {
        setError(error.message || 'Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  };

  // Price mapping for items that might not have correct prices
  const getItemPrice = (item) => {
    // If item already has a valid price, use it
    if (item.price && !isNaN(item.price) && item.price > 0) {
      return parseFloat(item.price);
    }

    // Default prices based on item names (fallback)
    const priceMap = {
      'Ice cream': 4.99,
      'Chips and dips': 6.99,
      'Soda variety pack': 8.99,
      'Wireless Headphones': 79.99,
      'Apple iPhone 15 Pro': 999.99,
      'Sony WH-1000XM5 Headphones': 349.99,
      'Ergonomic Office Chair': 299.99,
      'Large Button Phone': 79.99,
      'Weighted Blanket': 89.99,
      'Fidget Stress Relief Kit': 24.99,
      'Birthday Party Balloons Set': 12.99,
      'Birthday Cake Candles': 8.99,
      'Party Hats & Decorations': 15.99,
      'Birthday Cake Mix': 6.99,
      'Party Plates & Cups Set': 9.99,
      'Birthday Gift Wrapping Kit': 11.99
    };

    return priceMap[item.name] || 9.99; // Default fallback price
  };

  const formatPrice = (price) => {
    if (isNaN(price) || price === null || price === undefined) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Cart manipulation functions
  const removeFromCart = async (itemId) => {
    if (usingLocalCart) {
      removeFromLocalCart(itemId);
      // The useEffect will handle updating the cart state
    } else {
      try {
        const response = await fetch(`/api/cart/remove-item/${itemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchCart(); // Refresh cart
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    if (usingLocalCart) {
      updateLocalQuantity(itemId, newQuantity);
      // The useEffect will handle updating the cart state
    } else {
      try {
        const response = await fetch('/api/cart/update-item', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ itemId, quantity: newQuantity })
        });

        if (response.ok) {
          fetchCart(); // Refresh cart
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }
  };

  const clearCart = async () => {
    if (usingLocalCart) {
      clearLocalCart();
      setCart([]);
    } else {
      try {
        const response = await fetch('/api/cart/clear', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setCart([]);
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  // Determine which cart to display
  const displayCart = usingLocalCart ? cart : serverCart;

  // Calculate totals
  const getCartTotal = () => {
    return displayCart.reduce((total, item) => {
      const price = getItemPrice(item);
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return displayCart.reduce((count, item) => count + item.quantity, 0);
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 35 ? 0 : 5.99; // Free shipping over $35
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
        <NavigationBar currentPage="cart" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
        <NavigationBar currentPage="cart" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchCart}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('CartPage render - displayCart:', displayCart, 'cart.length:', displayCart.length, 'loading:', loading, 'usingLocalCart:', usingLocalCart);
  console.log('Raw cart from context:', cart);
  console.log('ServerCart:', serverCart);
  console.log('isAuthenticated:', isAuthenticated);

  if (displayCart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
        <NavigationBar currentPage="cart" />

        {/* Empty Cart */}
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            {/* Debug Info */}
            <div className="bg-gray-100 p-4 rounded-lg text-left text-sm mb-4">
              <p><strong>Debug Info:</strong></p>
              <p>Cart length: {cart?.length || 0}</p>
              <p>Display cart length: {displayCart?.length || 0}</p>
              <p>Using local cart: {usingLocalCart.toString()}</p>
              <p>Is authenticated: {isAuthenticated.toString()}</p>
              <p>Loading: {loading.toString()}</p>
              <pre>{JSON.stringify(cart, null, 2)}</pre>
            </div>
            {/* Test Button */}
            <button
              onClick={() => {
                console.log('Test button clicked');
                addToCart({
                  name: 'Test Item',
                  price: 9.99,
                  category: 'Test',
                  quantity: 1
                });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Test Item
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <NavigationBar currentPage="cart" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🛒 Shopping Cart ({getCartCount()} {getCartCount() === 1 ? 'item' : 'items'})
          </h1>
          {displayCart.length > 0 && (
            <button
              onClick={usingLocalCart ? clearLocalCart : clearCart}
              className="text-red-600 hover:text-red-700 font-medium px-4 py-2 border border-red-300 rounded hover:bg-red-50"
            >
              Clear Cart
            </button>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Items in your cart</h2>
                {usingLocalCart && (
                  <p className="text-sm text-yellow-600 mt-2">
                    ⚠️ Using local cart (API unavailable)
                  </p>
                )}
              </div>
              
              <div className="divide-y divide-gray-200">
                {displayCart.map((item) => {
                  const itemId = item._id || item.id;
                  return (
                  <div key={itemId} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      {/* Product Image Placeholder */}
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-blue-600" />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-gray-600">{item.category}</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                          {formatPrice(getItemPrice(item))}
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(itemId, Math.max(1, item.quantity - 1))}
                          className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity + 1)}
                          className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({getCartCount()} items)</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">{formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-blue-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Banner */}
              {subtotal < 35 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">
                      Add {formatPrice(35 - subtotal)} more for FREE shipping!
                    </span>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl mb-4">
                <CreditCard className="w-5 h-5 inline mr-2" />
                Proceed to Checkout
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center text-gray-500 text-sm">
                <Shield className="w-4 h-4 mr-1" />
                Secure checkout powered by Walmart
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
