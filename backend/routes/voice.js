const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Mock voice command processing (replace with actual wit.ai integration)
const processVoiceCommand = (command) => {
  const lowerCommand = command.toLowerCase();
  
  // Search commands
  if (lowerCommand.includes('search') || lowerCommand.includes('find') || lowerCommand.includes('show me')) {
    const searchTerm = lowerCommand.replace(/search|find|show me/g, '').trim();
    return {
      action: 'search',
      parameters: { query: searchTerm },
      response: `Searching for "${searchTerm}"`
    };
  }
  
  // Navigation commands
  if (lowerCommand.includes('go to') || lowerCommand.includes('navigate to')) {
    const destination = lowerCommand.replace(/go to|navigate to/g, '').trim();
    return {
      action: 'navigate',
      parameters: { destination },
      response: `Navigating to ${destination}`
    };
  }
  
  // Cart commands
  if (lowerCommand.includes('add to cart')) {
    return {
      action: 'add_to_cart',
      parameters: {},
      response: 'Adding item to cart'
    };
  }
  
  if (lowerCommand.includes('show cart') || lowerCommand.includes('view cart')) {
    return {
      action: 'show_cart',
      parameters: {},
      response: 'Showing your cart'
    };
  }
  
  // Filter commands
  if (lowerCommand.includes('filter by') || lowerCommand.includes('sort by')) {
    const filterType = lowerCommand.includes('price') ? 'price' : 
                      lowerCommand.includes('rating') ? 'rating' : 
                      lowerCommand.includes('category') ? 'category' : 'default';
    return {
      action: 'filter',
      parameters: { type: filterType },
      response: `Filtering by ${filterType}`
    };
  }
  
  // Help commands
  if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
    return {
      action: 'help',
      parameters: {},
      response: 'I can help you search for products, navigate the site, manage your cart, and more. Try saying "search for phones" or "show my cart".'
    };
  }
  
  // Default response
  return {
    action: 'unknown',
    parameters: {},
    response: 'I didn\'t understand that command. Try saying "help" to see what I can do.'
  };
};

// @desc    Process voice command
// @route   POST /api/voice/command
// @access  Private
router.post('/command', protect, async (req, res) => {
  try {
    const { command, confidence } = req.body;

    if (!command || command.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Voice command is required'
      });
    }

    // Check confidence level (if provided by speech recognition)
    if (confidence && confidence < 0.5) {
      return res.json({
        success: true,
        data: {
          action: 'clarify',
          response: 'I didn\'t catch that clearly. Could you please repeat?',
          confidence: confidence
        }
      });
    }

    // Process the voice command
    const result = processVoiceCommand(command);

    // Log voice command for analytics
    console.log(`Voice command from user ${req.user.id}: "${command}" -> ${result.action}`);

    res.json({
      success: true,
      data: {
        originalCommand: command,
        ...result,
        confidence: confidence || 1.0,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Voice command processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing voice command'
    });
  }
});

// @desc    Get voice command history
// @route   GET /api/voice/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    // Mock command history - in real implementation, fetch from database
    const mockHistory = [
      {
        id: '1',
        command: 'search for wireless headphones',
        action: 'search',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        success: true
      },
      {
        id: '2',
        command: 'add to cart',
        action: 'add_to_cart',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        success: true
      },
      {
        id: '3',
        command: 'show my cart',
        action: 'show_cart',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        success: true
      }
    ];

    res.json({
      success: true,
      data: mockHistory
    });

  } catch (error) {
    console.error('Get voice history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching voice history'
    });
  }
});

// @desc    Get available voice commands
// @route   GET /api/voice/commands
// @access  Public
router.get('/commands', async (req, res) => {
  try {
    const availableCommands = {
      search: [
        'Search for [product name]',
        'Find [product name]',
        'Show me [product name]'
      ],
      navigation: [
        'Go to cart',
        'Go to home',
        'Navigate to categories'
      ],
      cart: [
        'Add to cart',
        'Show cart',
        'View cart',
        'Remove from cart'
      ],
      filters: [
        'Filter by price',
        'Sort by rating',
        'Filter by category'
      ],
      general: [
        'Help',
        'What can you do?'
      ]
    };

    res.json({
      success: true,
      data: availableCommands
    });

  } catch (error) {
    console.error('Get voice commands error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching voice commands'
    });
  }
});

// @desc    Test voice recognition
// @route   POST /api/voice/test
// @access  Private
router.post('/test', protect, async (req, res) => {
  try {
    const { audioData } = req.body;

    // Mock voice recognition test
    // In real implementation, this would process audio data with wit.ai
    
    res.json({
      success: true,
      data: {
        recognized: true,
        text: 'Test voice recognition successful',
        confidence: 0.95,
        message: 'Voice recognition is working properly'
      }
    });

  } catch (error) {
    console.error('Voice test error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during voice test'
    });
  }
});

module.exports = router;
