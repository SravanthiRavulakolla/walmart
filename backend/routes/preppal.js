const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Mock OpenAI integration for PrepPal (replace with actual OpenAI API)
const generateShoppingList = async (prompt) => {
  // This is a mock implementation - replace with actual OpenAI API call
  const mockResponses = {
    'goa trip': {
      categories: ['Travel Essentials', 'Clothing', 'Health & Safety', 'Entertainment'],
      items: [
        { name: 'Sunscreen SPF 50+', category: 'Health & Safety', price: 12.99, quantity: 1 },
        { name: 'Beach Towel', category: 'Travel Essentials', price: 19.99, quantity: 2 },
        { name: 'Flip Flops', category: 'Clothing', price: 15.99, quantity: 1 },
        { name: 'Waterproof Phone Case', category: 'Travel Essentials', price: 9.99, quantity: 1 },
        { name: 'Portable Charger', category: 'Electronics', price: 24.99, quantity: 1 },
        { name: 'First Aid Kit', category: 'Health & Safety', price: 16.99, quantity: 1 }
      ]
    },
    'birthday party': {
      categories: ['Decorations', 'Food & Drinks', 'Entertainment', 'Tableware'],
      items: [
        { name: 'Birthday Balloons Pack', category: 'Decorations', price: 8.99, quantity: 1 },
        { name: 'Paper Plates (50 pack)', category: 'Tableware', price: 6.99, quantity: 1 },
        { name: 'Plastic Cups (50 pack)', category: 'Tableware', price: 5.99, quantity: 1 },
        { name: 'Birthday Candles', category: 'Decorations', price: 3.99, quantity: 1 },
        { name: 'Party Hats', category: 'Decorations', price: 7.99, quantity: 1 },
        { name: 'Soda Variety Pack', category: 'Food & Drinks', price: 12.99, quantity: 2 }
      ]
    },
    'camping': {
      categories: ['Camping Gear', 'Food & Cooking', 'Safety', 'Clothing'],
      items: [
        { name: 'Camping Tent (4-person)', category: 'Camping Gear', price: 89.99, quantity: 1 },
        { name: 'Sleeping Bag', category: 'Camping Gear', price: 34.99, quantity: 2 },
        { name: 'Portable Camping Stove', category: 'Food & Cooking', price: 45.99, quantity: 1 },
        { name: 'Flashlight', category: 'Safety', price: 12.99, quantity: 2 },
        { name: 'Insect Repellent', category: 'Safety', price: 8.99, quantity: 1 },
        { name: 'Camping Chairs', category: 'Camping Gear', price: 29.99, quantity: 2 }
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
  } else {
    // Default general shopping list
    return {
      categories: ['General Items'],
      items: [
        { name: 'Multi-purpose Cleaner', category: 'Household', price: 4.99, quantity: 1 },
        { name: 'Paper Towels', category: 'Household', price: 8.99, quantity: 1 },
        { name: 'Snack Mix', category: 'Food', price: 6.99, quantity: 1 },
        { name: 'Bottled Water (24 pack)', category: 'Beverages', price: 3.99, quantity: 1 }
      ]
    };
  }
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

    // Calculate total estimated cost
    const totalCost = shoppingList.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );

    // Apply user preferences if provided
    let filteredItems = shoppingList.items;
    if (preferences) {
      if (preferences.maxBudget) {
        // Filter items to fit budget (simplified logic)
        let currentTotal = 0;
        filteredItems = shoppingList.items.filter(item => {
          const itemCost = item.price * item.quantity;
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
            sum + (item.price * item.quantity), 0) * 100) / 100,
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
