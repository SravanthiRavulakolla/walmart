import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, ShoppingCart, Heart, Share2 } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock product data for now
    setProduct({
      _id: id,
      name: 'Sample Product',
      description: 'This is a sample product description.',
      price: 99.99,
      images: [{ url: 'https://via.placeholder.com/400', alt: 'Sample Product' }],
      averageRating: 4.5,
      totalReviews: 123
    });
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  return (
    <>
      <Helmet>
        <title>{product.name} - Walmart SenseEase</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <img
                  src={product.images[0]?.url}
                  alt={product.images[0]?.alt}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({product.totalReviews} reviews)</span>
                </div>
                
                <div className="text-3xl font-bold text-gray-900 mb-6">
                  ${product.price}
                </div>
                
                <p className="text-gray-600 mb-6">{product.description}</p>
                
                <div className="flex space-x-4">
                  <button className="btn btn-primary flex-1 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </button>
                  <button className="btn btn-secondary">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="btn btn-secondary">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
