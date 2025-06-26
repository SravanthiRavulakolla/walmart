import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Package, Calendar, DollarSign, Truck } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock orders data
    setOrders([
      {
        _id: '1',
        orderNumber: 'WM-2024-001',
        status: 'delivered',
        total: 86.38,
        createdAt: new Date('2024-01-15'),
        items: [
          { name: 'Sample Product 1', quantity: 2, price: 29.99 },
          { name: 'Sample Product 2', quantity: 1, price: 49.99 }
        ]
      },
      {
        _id: '2',
        orderNumber: 'WM-2024-002',
        status: 'shipped',
        total: 124.99,
        createdAt: new Date('2024-01-20'),
        items: [
          { name: 'Sample Product 3', quantity: 1, price: 124.99 }
        ]
      }
    ]);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading orders...</div>;
  }

  return (
    <>
      <Helmet>
        <title>My Orders - Walmart SenseEase</title>
        <meta name="description" content="View your order history and track shipments." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
              <a href="/products" className="btn btn-primary">
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {order.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Items ({order.items.length})</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-4">
                      <button className="btn btn-secondary text-sm">
                        <Package className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                      {order.status === 'shipped' && (
                        <button className="btn btn-secondary text-sm">
                          <Truck className="w-4 h-4 mr-1" />
                          Track Package
                        </button>
                      )}
                    </div>
                    
                    {order.status === 'delivered' && (
                      <button className="btn btn-primary text-sm">
                        Reorder Items
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
