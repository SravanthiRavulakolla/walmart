const express = require('express');
const Product = require('../models/Product');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Build query
    let query = { isActive: true };
    
    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    // Search query
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Rating filter
    if (req.query.minRating) {
      query.averageRating = { $gte: parseFloat(req.query.minRating) };
    }
    
    // Accessibility features filter
    if (req.query.accessibilityFeatures) {
      const features = req.query.accessibilityFeatures.split(',');
      query.accessibilityFeatures = { $in: features };
    }
    
    // Sort options
    let sort = {};
    switch (req.query.sort) {
      case 'price_low':
        sort.price = 1;
        break;
      case 'price_high':
        sort.price = -1;
        break;
      case 'rating':
        sort.averageRating = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'featured':
        sort.isFeatured = -1;
        break;
      default:
        sort.createdAt = -1;
    }
    
    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-reviews'); // Exclude reviews for list view
    
    // Get total count for pagination
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'firstName lastName avatar');
    
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured/list
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-reviews');
    
    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured products'
    });
  }
});

// @desc    Get product categories
// @route   GET /api/products/categories/list
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    
    // Get category counts
    const categoryCounts = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const categoriesWithCounts = categories.map(category => {
      const countData = categoryCounts.find(c => c._id === category);
      return {
        name: category,
        count: countData ? countData.count : 0
      };
    });
    
    res.json({
      success: true,
      data: categoriesWithCounts
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required'
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    );
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }
    
    // Add review
    const review = {
      user: req.user.id,
      rating: parseInt(rating),
      comment: comment.trim()
    };
    
    product.reviews.push(review);
    product.calculateAverageRating();
    
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
});

module.exports = router;
