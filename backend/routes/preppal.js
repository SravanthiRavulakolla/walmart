const express = require('express');
const { protect } = require('../middleware/auth');
const Product = require('../models/Product');

const router = express.Router();

// Mock OpenAI integration for PrepPal (replace with actual OpenAI API)
const generateShoppingList = async (prompt) => {
  // This is a mock implementation - replace with actual OpenAI API call
  const mockResponses = {
    'goa trip': {
      categories: ['Health & Beauty', 'Sports & Outdoors', 'Clothing', 'Electronics'],
      items: [
        { name: 'Neutrogena Ultra Sheer Dry-Touch Sunscreen SPF 100+', category: 'Health & Beauty', price: 12.99, quantity: 1, sku: 'NEUTRO-SUN-100-3OZ' },
        { name: 'Coppertone Sport Sunscreen Lotion SPF 50', category: 'Health & Beauty', price: 8.97, quantity: 1, sku: 'COPPER-SPORT-SPF50' },
        { name: 'Dock & Bay Quick Dry Beach Towel', category: 'Sports & Outdoors', price: 19.99, quantity: 2, sku: 'DOCK-TOWEL-LG-BLUE' },
        { name: 'Havaianas Brazil Flip Flops', category: 'Clothing', price: 15.99, quantity: 1, sku: 'HAVA-BRAZIL-M9-NAVY' },
        { name: 'JOTO Waterproof Phone Case', category: 'Electronics', price: 9.99, quantity: 1, sku: 'JOTO-WP-CASE-CLEAR' },
        { name: 'Anker PowerCore 10000 Portable Charger', category: 'Electronics', price: 24.99, quantity: 1, sku: 'ANKER-PC10K-BLACK' },
        { name: 'Johnson & Johnson First Aid Kit', category: 'Health & Beauty', price: 16.99, quantity: 1, sku: 'JJ-FIRSTAID-140PC' },
        { name: 'Igloo Playmate Cooler 16 Qt', category: 'Sports & Outdoors', price: 24.88, quantity: 1, sku: 'IGLOO-PLAYMATE-16QT' },
        { name: 'Banana Boat Aloe After Sun Lotion', category: 'Health & Beauty', price: 4.97, quantity: 1, sku: 'BB-ALOE-AFTERSUN' }
      ]
    },
    'birthday party': {
      categories: ['Home & Garden', 'Food & Grocery'],
      items: [
        { name: 'Lay\'s Classic Potato Chips', category: 'Food & Grocery', price: 3.98, quantity: 1, sku: 'LAYS-CLASSIC-CHIPS' },
        { name: 'Tostitos Chunky Salsa', category: 'Food & Grocery', price: 2.98, quantity: 1, sku: 'TOSTITOS-SALSA-CHUNKY' },
        { name: 'Coca-Cola Soda Variety Pack 12 Cans', category: 'Food & Grocery', price: 12.99, quantity: 1, sku: 'COKE-VARIETY-12CT-12OZ' },
        { name: 'Hefty Disposable Paper Plates 50 Count', category: 'Home & Garden', price: 6.99, quantity: 1, sku: 'HEFTY-PLATES-50CT-9IN' },
        { name: 'Great Value Chocolate Ice Cream', category: 'Food & Grocery', price: 3.98, quantity: 1, sku: 'GV-ICE-CREAM-CHOC' },
        { name: 'DiGiorno Rising Crust Pizza', category: 'Food & Grocery', price: 5.98, quantity: 2, sku: 'DIGIORNO-PIZZA-PEPPERONI' },
        { name: 'Great Value Paper Napkins', category: 'Home & Garden', price: 1.98, quantity: 1, sku: 'GV-NAPKINS-200CT' },
        { name: 'Great Value Birthday Cake Mix', category: 'Food & Grocery', price: 1.98, quantity: 1, sku: 'GV-CAKE-MIX-VANILLA' }
      ]
    },
    'camping': {
      categories: ['Sports & Outdoors', 'Home & Garden'],
      items: [
        { name: 'Coleman Sundome 4-Person Tent', category: 'Sports & Outdoors', price: 89.99, quantity: 1, sku: 'COLEMAN-SUNDOME-4P' },
        { name: 'TETON Sports Celsius Sleeping Bag', category: 'Sports & Outdoors', price: 34.99, quantity: 2, sku: 'TETON-CELSIUS-REG' },
        { name: 'Coleman Portable Camping Stove', category: 'Home & Garden', price: 45.99, quantity: 1, sku: 'COLEMAN-STOVE-2BURN' },
        { name: 'Energizer LED Flashlight', category: 'Sports & Outdoors', price: 12.99, quantity: 2, sku: 'ENERGIZER-LED-FLASH' },
        { name: 'OFF! Deep Woods Insect Repellent', category: 'Sports & Outdoors', price: 8.99, quantity: 1, sku: 'OFF-DEEPWOODS-6OZ' },
        { name: 'Coleman Portable Camping Chairs', category: 'Sports & Outdoors', price: 29.99, quantity: 2, sku: 'COLEMAN-CHAIR-QUAD' },
        { name: 'Coleman Lantern Battery Powered', category: 'Sports & Outdoors', price: 19.97, quantity: 1, sku: 'COLEMAN-LANTERN-LED' }
      ]
    }
  };

  // Simple keyword matching for demo
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('goa') || lowerPrompt.includes('beach') || lowerPrompt.includes('vacation')) {
    return mockResponses['goa trip'];
  } else if (lowerPrompt.includes('birthday') || lowerPrompt.includes('party') || lowerPrompt.includes('celebration')) {
    return mockResponses['birthday party'];
  } else if (lowerPrompt.includes('camping') || lowerPrompt.includes('outdoor') || lowerPrompt.includes('hiking')) {
    return mockResponses['camping'];
  } else if (lowerPrompt.includes('grocery') || lowerPrompt.includes('weekly shopping') || lowerPrompt.includes('essentials')) {
    // Weekly grocery essentials
    return {
      categories: ['Food & Grocery', 'Health & Beauty', 'Home & Garden'],
      items: [
        { name: 'Great Value 2% Reduced Fat Milk', category: 'Food & Grocery', price: 3.68, quantity: 1, sku: 'GV-MILK-2PERCENT-GAL' },
        { name: 'Wonder Bread Classic White', category: 'Food & Grocery', price: 1.28, quantity: 1, sku: 'WONDER-BREAD-WHITE' },
        { name: 'Bananas Fresh Produce', category: 'Food & Grocery', price: 0.58, quantity: 3, sku: 'FRESH-BANANAS-LB' },
        { name: 'Great Value Large Eggs', category: 'Food & Grocery', price: 2.12, quantity: 1, sku: 'GV-EGGS-LARGE-DOZEN' },
        { name: 'Charmin Ultra Soft Toilet Paper', category: 'Health & Beauty', price: 12.97, quantity: 1, sku: 'CHARMIN-ULTRA-SOFT-12' },
        { name: 'Tide Liquid Laundry Detergent', category: 'Home & Garden', price: 11.97, quantity: 1, sku: 'TIDE-LIQUID-ORIGINAL-92' }
      ]
    };
  } else {
    // Default general shopping list
    return {
      categories: ['Food & Grocery'],
      items: [
        { name: 'Great Value 2% Reduced Fat Milk', category: 'Food & Grocery', price: 3.68, quantity: 1, sku: 'GV-MILK-2PERCENT-GAL' },
        { name: 'Bananas Fresh Produce', category: 'Food & Grocery', price: 0.58, quantity: 2, sku: 'FRESH-BANANAS-LB' },
        { name: 'Wonder Bread Classic White', category: 'Food & Grocery', price: 1.28, quantity: 1, sku: 'WONDER-BREAD-WHITE' },
        { name: 'Great Value Large Eggs', category: 'Food & Grocery', price: 2.12, quantity: 1, sku: 'GV-EGGS-LARGE-DOZEN' }
      ]
    };
  }
};

// Function to find actual products from database that match the suggestions
const findMatchingProducts = async (suggestedItems) => {
  const matchedProducts = [];

  for (const item of suggestedItems) {
    try {
      // Try to find exact match by SKU first
      let product = null;
      if (item.sku) {
        product = await Product.findOne({ sku: item.sku, isActive: true });
      }

      // If no SKU match, try name matching
      if (!product) {
        product = await Product.findOne({
          name: { $regex: new RegExp(item.name, 'i') },
          isActive: true
        });
      }

      // If still no match, try tag matching
      if (!product) {
        const keywords = item.name.toLowerCase().split(' ');
        product = await Product.findOne({
          tags: { $in: keywords },
          isActive: true
        });
      }

      if (product) {
        matchedProducts.push({
          ...item,
          productId: product._id,
          actualPrice: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          image: product.images[0]?.url,
          inStock: product.stock > 0,
          stock: product.stock
        });
      } else {
        // Keep the suggested item even if no product match
        matchedProducts.push({
          ...item,
          productId: null,
          actualPrice: item.price,
          inStock: false,
          stock: 0
        });
      }
    } catch (error) {
      console.error('Error finding product:', error);
      // Keep the suggested item on error
      matchedProducts.push({
        ...item,
        productId: null,
        actualPrice: item.price,
        inStock: false,
        stock: 0
      });
    }
  }

  return matchedProducts;
};

// @desc    Generate shopping list from prompt
// @route   POST /api/preppal/generate
// @access  Private
router.post('/generate', protect, async (req, res) => {
  try {
    const { prompt, preferences } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }

    if (prompt.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is too long (max 500 characters)'
      });
    }

    // Generate shopping list using AI (mock implementation)
    const shoppingList = await generateShoppingList(prompt);

    // Find matching products in database
    const matchedItems = await findMatchingProducts(shoppingList.items);

    // Calculate total estimated cost using actual prices
    const totalCost = matchedItems.reduce((sum, item) =>
      sum + (item.actualPrice * item.quantity), 0
    );

    // Apply user preferences if provided
    let filteredItems = matchedItems;
    if (preferences) {
      if (preferences.maxBudget) {
        // Filter items to fit budget (simplified logic)
        let currentTotal = 0;
        filteredItems = matchedItems.filter(item => {
          const itemCost = item.actualPrice * item.quantity;
          if (currentTotal + itemCost <= preferences.maxBudget) {
            currentTotal += itemCost;
            return true;
          }
          return false;
        });
      }

      if (preferences.excludeCategories && preferences.excludeCategories.length > 0) {
        filteredItems = filteredItems.filter(item =>
          !preferences.excludeCategories.includes(item.category)
        );
      }
    }

    const response = {
      success: true,
      data: {
        prompt: prompt.trim(),
        categories: [...new Set(filteredItems.map(item => item.category))],
        items: filteredItems,
        summary: {
          totalItems: filteredItems.length,
          estimatedCost: Math.round(filteredItems.reduce((sum, item) =>
            sum + (item.actualPrice * item.quantity), 0) * 100) / 100,
          availableItems: filteredItems.filter(item => item.inStock).length,
          unavailableItems: filteredItems.filter(item => !item.inStock).length,
          categories: filteredItems.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
          }, {})
        },
        tips: [
          'Check for coupons and discounts before purchasing',
          'Consider buying in bulk for frequently used items',
          'Compare prices across different brands'
        ]
      }
    };

    res.json(response);

  } catch (error) {
    console.error('PrepPal generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating shopping list'
    });
  }
});

// @desc    Save generated shopping list
// @route   POST /api/preppal/save
// @access  Private
router.post('/save', protect, async (req, res) => {
  try {
    const { listName, items, prompt } = req.body;

    if (!listName || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'List name and items are required'
      });
    }

    // In a real implementation, you would save this to a ShoppingList model
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Shopping list saved successfully',
      data: {
        listName,
        itemCount: items.length,
        savedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Save shopping list error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving shopping list'
    });
  }
});

// @desc    Get user's saved shopping lists
// @route   GET /api/preppal/lists
// @access  Private
router.get('/lists', protect, async (req, res) => {
  try {
    // Mock saved lists - in real implementation, fetch from database
    const mockLists = [
      {
        id: '1',
        name: 'Goa Trip Essentials',
        itemCount: 6,
        estimatedCost: 89.94,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        prompt: 'Going to Goa for 3 days with friends'
      },
      {
        id: '2',
        name: 'Birthday Party Supplies',
        itemCount: 8,
        estimatedCost: 45.50,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        prompt: 'Hosting a birthday party at home'
      }
    ];

    res.json({
      success: true,
      data: mockLists
    });

  } catch (error) {
    console.error('Get shopping lists error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching shopping lists'
    });
  }
});

module.exports = router;
