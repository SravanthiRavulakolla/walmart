const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('cart.productId', 'name price images stock isActive');
    
    // Filter out inactive products and format items
    const activeCartItems = user.cart.filter(item => {
      if (item.productId) {
        return item.productId.isActive;
      } else {
        // PrepPal items are always active
        return true;
      }
    }).map(item => {
      if (item.productId) {
        // Regular product
        return {
          _id: item._id,
          productId: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.images[0]?.url || null,
          category: item.productId.category,
          quantity: item.quantity,
          addedAt: item.addedAt
        };
      } else {
        // PrepPal item
        return {
          _id: item._id,
          productId: null,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          quantity: item.quantity,
          addedAt: item.addedAt
        };
      }
    });

    // Calculate totals
    const subtotal = activeCartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    res.json({
      success: true,
      data: {
        items: activeCartItems,
        itemCount: activeCartItems.length,
        subtotal: Math.round(subtotal * 100) / 100
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart'
    });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1, name, price, category } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    console.log('Cart add request:', { productId, name, price, quantity, category });

    let product = null;
    let itemData = {};

    if (productId) {
      // Regular product from catalog
      product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check stock availability
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock available'
        });
      }

      itemData = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || null,
        category: product.category
      };
    } else if (name && price !== undefined) {
      // PrepPal item without productId
      const parsedPrice = parseFloat(price) || 0;
      console.log('PrepPal item price parsing:', { originalPrice: price, parsedPrice });
      itemData = {
        productId: null,
        name: name,
        price: parsedPrice,
        image: null,
        category: category || 'Other'
      };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either productId or name and price are required'
      });
    }
    
    const user = await User.findById(req.user.id);

    // Check if item already exists in cart
    let existingItemIndex = -1;
    if (productId) {
      existingItemIndex = user.cart.findIndex(
        item => item.productId && item.productId.toString() === productId
      );
    } else {
      // For PrepPal items, check by name
      existingItemIndex = user.cart.findIndex(
        item => !item.productId && item.name === itemData.name
      );
    }

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = user.cart[existingItemIndex].quantity + quantity;

      if (product && newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: 'Cannot add more items than available stock'
        });
      }

      user.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      user.cart.push({
        productId: itemData.productId,
        name: itemData.name,
        price: itemData.price,
        image: itemData.image,
        category: itemData.category,
        quantity
      });
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Item added to cart successfully'
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to cart'
    });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
router.put('/update', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and valid quantity are required'
      });
    }
    
    // Check product stock
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: 'Quantity exceeds available stock'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    const cartItemIndex = user.cart.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    user.cart[cartItemIndex].quantity = quantity;
    await user.save();
    
    res.json({
      success: true,
      message: 'Cart updated successfully'
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart'
    });
  }
});

// @desc    Update cart item quantity by item ID
// @route   PUT /api/cart/update-item
// @access  Private
router.put('/update-item', protect, async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    if (!itemId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and valid quantity are required'
      });
    }

    const user = await User.findById(req.user.id);

    // Find the cart item by its _id
    const cartItemIndex = user.cart.findIndex(
      item => item._id.toString() === itemId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    const cartItem = user.cart[cartItemIndex];

    // Check stock for products with productId
    if (cartItem.productId) {
      const product = await Product.findById(cartItem.productId);
      if (product && quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock available'
        });
      }
    }

    // Update quantity
    user.cart[cartItemIndex].quantity = quantity;
    await user.save();

    res.json({
      success: true,
      message: 'Cart updated successfully'
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart'
    });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.user.id);
    
    user.cart = user.cart.filter(
      item => item.productId.toString() !== productId
    );
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from cart'
    });
  }
});

// @desc    Remove item from cart by item ID
// @route   DELETE /api/cart/remove-item/:itemId
// @access  Private
router.delete('/remove-item/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;

    const user = await User.findById(req.user.id);

    // Find and remove the cart item by its _id
    const initialLength = user.cart.length;
    user.cart = user.cart.filter(
      item => item._id.toString() !== itemId
    );

    if (user.cart.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from cart'
    });
  }
});

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
router.delete('/clear', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    
    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart'
    });
  }
});

module.exports = router;
