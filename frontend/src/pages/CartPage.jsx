import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock cart data for now
    setCartItems([
      {
        _id: '1',
        productId: {
          _id: '1',
          name: 'Sample Product 1',
          price: 29.99,
          images: [{ url: 'https://via.placeholder.com/100', alt: 'Product 1' }]
        },
        quantity: 2
      },
      {
        _id: '2',
        productId: {
          _id: '2',
          name: 'Sample Product 2',
          price: 49.99,
          images: [{ url: 'https://via.placeholder.com/100', alt: 'Product 2' }]
        },
        quantity: 1
      }
    ]);
    setLoading(false);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.productId.price * item.quantity), 0
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading cart...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart - Walmart SenseEase</title>
        <meta name="description" content="Review your cart items and proceed to checkout." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some products to get started!</p>
              <Link to="/products" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Cart Items ({cartItems.length})
                  </h2>
                  
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.productId.images[0]?.url}
                          alt={item.productId.images[0]?.alt}
                          className="w-16 h-16 object-cover rounded"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.productId.name}</h3>
                          <p className="text-gray-600">${item.productId.price}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-1 rounded-full hover:bg-gray-100">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button className="p-1 rounded-full hover:bg-gray-100">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${(item.productId.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${(subtotal * 0.08).toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${(subtotal * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Link to="/checkout" className="btn btn-primary w-full flex items-center justify-center">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
