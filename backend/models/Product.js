const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  },
  helpful: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  
  // Product details
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      'Electronics',
      'Clothing',
      'Home & Garden',
      'Health & Beauty',
      'Sports & Outdoors',
      'Toys & Games',
      'Food & Grocery',
      'Books & Media',
      'Automotive',
      'Office Supplies',
      'Pet Supplies',
      'Baby & Kids'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true
  },
  
  // Images and media
  images: [{
    url: { type: String, required: true },
    alt: { type: String, required: true },
    isPrimary: { type: Boolean, default: false }
  }],
  videos: [{
    url: String,
    title: String,
    duration: Number
  }],
  
  // Inventory
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  
  // Specifications
  specifications: [{
    name: { type: String, required: true },
    value: { type: String, required: true }
  }],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: { type: String, default: 'inches' }
  },
  
  // Reviews and ratings
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Accessibility features
  accessibilityFeatures: [{
    type: String,
    enum: [
      'Large Print',
      'Audio Description',
      'Braille Compatible',
      'Easy Grip',
      'Voice Control',
      'Simple Interface',
      'High Contrast',
      'Tactile Feedback'
    ]
  }],
  
  // SEO and search
  tags: [String],
  searchKeywords: [String],
  
  // Status and visibility
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
    return;
  }
  
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
  this.totalReviews = this.reviews.length;
};

// Check if product is in stock
productSchema.methods.isInStock = function() {
  return this.stock > 0;
};

// Check if product is low stock
productSchema.methods.isLowStock = function() {
  return this.stock <= this.lowStockThreshold && this.stock > 0;
};

// Get discounted price
productSchema.methods.getDiscountedPrice = function() {
  if (this.discount > 0) {
    return Math.round((this.price * (1 - this.discount / 100)) * 100) / 100;
  }
  return this.price;
};

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isActive: 1, isFeatured: -1 });

module.exports = mongoose.model('Product', productSchema);
