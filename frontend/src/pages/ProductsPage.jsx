import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Filter, 
  Grid, 
  List, 
  SortAsc, 
  Search,
  X,
  ChevronDown,
  Star,
  ShoppingCart
} from 'lucide-react';

import { useAccessibility } from '../contexts/AccessibilityContext';
import { useBehaviorTracking } from '../contexts/BehaviorTrackingContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import VoiceButton from '../components/voice/VoiceButton';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    accessibilityFeatures: []
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const { layoutMode, focusMode, setLayoutMode } = useAccessibility();
  const behaviorTracking = useBehaviorTracking();

  // Categories for filtering
  const categories = [
    'Electronics', 'Clothing', 'Home & Garden', 'Health & Beauty',
    'Sports & Outdoors', 'Toys & Games', 'Food & Grocery', 'Books & Media'
  ];

  const accessibilityFeatures = [
    'Voice Control', 'Large Print', 'High Contrast', 'Simple Interface',
    'Tactile Feedback', 'Audio Description', 'Easy Grip', 'Braille Compatible'
  ];

  // Load products on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy, searchParams]);

  // Initialize search from URL params
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
      setFilters(prev => ({ ...prev, search }));
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (searchQuery) queryParams.append('search', searchQuery);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.minRating) queryParams.append('minRating', filters.minRating);
      if (filters.accessibilityFeatures.length > 0) {
        queryParams.append('accessibilityFeatures', filters.accessibilityFeatures.join(','));
      }
      queryParams.append('sort', sortBy);

      const response = await fetch(`/api/products?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAccessibilityFeatureToggle = (feature) => {
    setFilters(prev => ({
      ...prev,
      accessibilityFeatures: prev.accessibilityFeatures.includes(feature)
        ? prev.accessibilityFeatures.filter(f => f !== feature)
        : [...prev.accessibilityFeatures, feature]
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      accessibilityFeatures: []
    });
    setSearchQuery('');
    setSearchParams({});
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, search: query }));
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (response.ok) {
        // Show success feedback
        const button = document.querySelector(`[data-product-id="${productId}"]`);
        if (button) {
          button.textContent = 'Added!';
          button.classList.add('bg-green-600');
          setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.classList.remove('bg-green-600');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const ProductCard = ({ product }) => (
    <div className={`
      group relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden
      hover:shadow-2xl hover:scale-105 transition-all duration-300
      ${focusMode ? 'focus:ring-4 focus:ring-walmart-blue' : ''}
    `}>
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {product.discount}% OFF
          </span>
        </div>
      )}

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-md">
        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors duration-200" />
      </button>

      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={product.images[0]?.url || '/placeholder-product.jpg'}
          alt={product.images[0]?.alt || product.name}
          className="w-full h-48 object-cover object-center group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.shortDescription || product.description}
        </p>

        {/* Rating */}
        {product.averageRating > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-xs font-medium text-gray-700">
                {product.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="ml-2 text-xs text-gray-500">
              ({product.totalReviews} reviews)
            </span>
          </div>
        )}

        {/* Accessibility Features */}
        {product.accessibilityFeatures && product.accessibilityFeatures.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {product.accessibilityFeatures.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full border border-blue-200"
                >
                  {feature}
                </span>
              ))}
              {product.accessibilityFeatures.length > 2 && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full border border-gray-200">
                  +{product.accessibilityFeatures.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price Section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-right">
                <div className="text-xs text-green-600 font-medium">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product._id)}
          data-product-id={product._id}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );

  const ProductListItem = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 flex items-center space-x-4">
      <img
        src={product.images[0]?.url || '/placeholder-product.jpg'}
        alt={product.images[0]?.alt || product.name}
        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
        loading="lazy"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.shortDescription || product.description}
        </p>
        
        {product.averageRating > 0 && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              ({product.totalReviews})
            </span>
          </div>
        )}
        
        {product.accessibilityFeatures && product.accessibilityFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.accessibilityFeatures.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-end space-y-2">
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            ${product.price}
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="text-sm text-gray-500 line-through">
              ${product.originalPrice}
            </div>
          )}
        </div>
        
        <button
          onClick={() => addToCart(product._id)}
          data-product-id={product._id}
          className="btn btn-primary flex items-center"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Products - Walmart SenseEase</title>
        <meta name="description" content="Browse accessible products with personalized shopping experience." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
              <p className="text-gray-600">
                {products.length} products found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
            
            {/* Search and Voice */}
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue w-64"
                />
              </div>
              
              <VoiceButton
                onVoiceResult={(result) => handleSearch(result)}
                size="medium"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-walmart-blue hover:text-blue-700"
                  >
                    Clear All
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full input"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full input"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full input"
                    />
                  </div>
                </div>

                {/* Accessibility Features */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accessibility Features
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {accessibilityFeatures.map(feature => (
                      <label key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.accessibilityFeatures.includes(feature)}
                          onChange={() => handleAccessibilityFeatureToggle(feature)}
                          className="w-4 h-4 text-walmart-blue focus:ring-walmart-blue border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn btn-secondary flex items-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>

                <div className="flex items-center space-x-4">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input"
                  >
                    <option value="newest">Newest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="featured">Featured</option>
                  </select>

                  {/* Layout Toggle */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setLayoutMode('grid')}
                      className={`p-2 rounded ${
                        layoutMode === 'grid'
                          ? 'bg-walmart-blue text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                      aria-label="Grid view"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setLayoutMode('list')}
                      className={`p-2 rounded ${
                        layoutMode === 'list'
                          ? 'bg-walmart-blue text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                      aria-label="List view"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="large" text="Loading products..." />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 btn btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className={
                  layoutMode === 'grid'
                    ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
                        focusMode ? 'lg:grid-cols-2 xl:grid-cols-3' : ''
                      }`
                    : 'space-y-4'
                }>
                  {products.map(product => (
                    layoutMode === 'grid' ? (
                      <ProductCard key={product._id} product={product} />
                    ) : (
                      <ProductListItem key={product._id} product={product} />
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
