/**
 * Advanced Voice Command Processing Engine
 * Handles natural language processing for voice commands
 */

class VoiceCommandProcessor {
  constructor() {
    this.commands = {
      navigation: {
        patterns: [
          /(?:take me to|go to|navigate to|open|show me)\s+(home|dashboard|products?|cart|checkout|profile|settings|preppal|voice)/i,
          /(?:go|navigate)\s+(home|back)/i,
          /(?:show|display)\s+(my\s+)?(cart|orders?|profile|dashboard)/i
        ],
        handler: this.handleNavigation.bind(this)
      },
      search: {
        patterns: [
          /(?:search for|find|look for|show me)\s+(.+)/i,
          /(?:what|where)\s+(?:is|are)\s+(.+)/i,
          /(?:do you have|got any)\s+(.+)/i
        ],
        handler: this.handleSearch.bind(this)
      },
      cart: {
        patterns: [
          /(?:add|put)\s+(.+?)\s+(?:to|in)\s+(?:my\s+)?cart/i,
          /(?:I want|I need|get me)\s+(?:a\s+|an\s+|some\s+)?(.+)/i,
          /(?:buy|purchase)\s+(?:a\s+|an\s+|some\s+)?(.+)/i,
          /(?:remove|delete)\s+(.+?)\s+from\s+(?:my\s+)?cart/i,
          /(?:clear|empty)\s+(?:my\s+)?cart/i,
          /(?:show|check|open)\s+(?:my\s+)?cart/i,
          /(?:go to|take me to)\s+(?:my\s+)?cart/i
        ],
        handler: this.handleCart.bind(this)
      },
      quantity: {
        patterns: [
          /(?:add|increase)\s+(\d+)\s+(?:more\s+)?(.+)/i,
          /(?:remove|decrease)\s+(\d+)\s+(.+)/i,
          /(?:set|change)\s+quantity\s+(?:of\s+)?(.+?)\s+to\s+(\d+)/i
        ],
        handler: this.handleQuantity.bind(this)
      },
      filters: {
        patterns: [
          /(?:filter|show|find)\s+(.+?)\s+(?:under|below|less than)\s+\$?(\d+)/i,
          /(?:filter|show|find)\s+(.+?)\s+(?:over|above|more than)\s+\$?(\d+)/i,
          /(?:sort|order)\s+(?:by\s+)?(price|rating|name|popularity)/i,
          /(?:show|filter)\s+(?:only\s+)?(.+?)\s+(?:brand|category)/i
        ],
        handler: this.handleFilters.bind(this)
      },
      accessibility: {
        patterns: [
          /(?:enable|turn on|activate)\s+(high contrast|large text|focus mode|voice feedback)/i,
          /(?:disable|turn off|deactivate)\s+(high contrast|large text|focus mode|voice feedback)/i,
          /(?:increase|decrease)\s+(?:text\s+)?size/i,
          /(?:read|speak)\s+(?:this|that|the\s+)?(.+)/i
        ],
        handler: this.handleAccessibility.bind(this)
      },
      preppal: {
        patterns: [
          /(?:create|make|generate)\s+(?:a\s+)?(?:shopping\s+)?list\s+for\s+(.+)/i,
          /(?:add|include)\s+(.+?)\s+(?:to|in)\s+(?:my\s+)?(?:shopping\s+)?list/i,
          /(?:plan|suggest)\s+(?:a\s+)?meal\s+for\s+(.+)/i,
          /(?:what|how much)\s+(?:do I need|should I buy)\s+for\s+(.+)/i,
          /(?:preppal|prep pal),?\s+(.+)/i
        ],
        handler: this.handlePrepPal.bind(this)
      },
      preppal: {
        patterns: [
          /(?:create|make|generate)\s+(?:a\s+)?(?:shopping\s+)?list\s+for\s+(.+)/i,
          /(?:add|include)\s+(.+?)\s+(?:to|in)\s+(?:my\s+)?(?:shopping\s+)?list/i,
          /(?:plan|suggest)\s+(?:a\s+)?meal\s+for\s+(.+)/i,
          /(?:what|how much)\s+(?:do I need|should I buy)\s+for\s+(.+)/i,
          /(?:preppal|prep pal),?\s+(.+)/i
        ],
        handler: this.handlePrepPal.bind(this)
      },
      preppal: {
        patterns: [
          /(?:create|make|generate)\s+(?:a\s+)?(?:shopping\s+)?list\s+for\s+(.+)/i,
          /(?:add|include)\s+(.+?)\s+(?:to|in)\s+(?:my\s+)?(?:shopping\s+)?list/i,
          /(?:plan|suggest)\s+(?:a\s+)?meal\s+for\s+(.+)/i,
          /(?:what|how much)\s+(?:do I need|should I buy)\s+for\s+(.+)/i,
          /(?:preppal|prep pal),?\s+(.+)/i
        ],
        handler: this.handlePrepPal.bind(this)
      },
      general: {
        patterns: [
          /(?:help|what can you do|commands|what commands)/i,
          /(?:hello|hi|hey there)/i,
          /(?:thank you|thanks)/i,
          /(?:goodbye|bye|exit|stop)/i
        ],
        handler: this.handleGeneral.bind(this)
      }
    };

    this.context = {
      lastCommand: null,
      currentPage: null,
      searchResults: [],
      cartItems: [],
      conversationHistory: []
    };

    this.wakeWords = [
      'hey sense', 'sense ease', 'sense', 'hey shopping', 'shopping assistant', 'voice assistant',
      'hi sense', 'hello sense', 'ok sense', 'sense please'
    ];
  }

  /**
   * Process voice input and return command object
   */
  processCommand(transcript, context = {}) {
    if (!transcript || typeof transcript !== 'string') {
      return { error: 'Invalid transcript' };
    }

    const cleanTranscript = transcript.trim().toLowerCase();
    console.log('Processing command:', cleanTranscript);
    console.log('Context:', context);

    // Update context
    this.context = { ...this.context, ...context };
    this.context.conversationHistory.push({
      timestamp: Date.now(),
      input: transcript,
      type: 'user'
    });

    // Check for wake words - be more lenient
    const hasWakeWord = this.isWakeWordDetected(cleanTranscript);
    const isInCommandMode = context.isActive || context.commandMode;

    console.log('Has wake word:', hasWakeWord);
    console.log('Is in command mode:', isInCommandMode);

    // If no wake word and not in command mode, require wake word
    if (!hasWakeWord && !isInCommandMode) {
      return {
        type: 'wake_word_needed',
        message: 'Say "Hey Sense" to activate voice commands'
      };
    }

    // Remove wake words from transcript
    const commandText = this.removeWakeWords(cleanTranscript);
    console.log('Command text after wake word removal:', commandText);

    // Process the command
    const result = this.parseCommand(commandText || cleanTranscript);
    console.log('Parse result:', result);

    // Add to conversation history
    this.context.conversationHistory.push({
      timestamp: Date.now(),
      output: result,
      type: 'assistant'
    });

    return result;
  }

  /**
   * Check if wake word is detected
   */
  isWakeWordDetected(transcript) {
    const lowerTranscript = transcript.toLowerCase().trim();
    console.log('Checking wake words in:', lowerTranscript);

    // Check for exact matches first
    const exactMatch = this.wakeWords.some(wakeWord => {
      const isFound = lowerTranscript.includes(wakeWord.toLowerCase());
      console.log(`Checking "${wakeWord}":`, isFound);
      return isFound;
    });

    // Also check for "sense" at the beginning or after "hey"
    const senseMatch = lowerTranscript.startsWith('sense') ||
                      lowerTranscript.includes('hey sense') ||
                      lowerTranscript.includes('hi sense') ||
                      lowerTranscript.includes('ok sense');

    const detected = exactMatch || senseMatch;
    console.log('Wake word detection result:', detected);
    return detected;
  }

  /**
   * Remove wake words from transcript
   */
  removeWakeWords(transcript) {
    let cleanTranscript = transcript;
    this.wakeWords.forEach(wakeWord => {
      const regex = new RegExp(wakeWord.toLowerCase(), 'gi');
      cleanTranscript = cleanTranscript.replace(regex, '').trim();
    });
    return cleanTranscript;
  }

  /**
   * Parse command and route to appropriate handler
   */
  parseCommand(commandText) {
    console.log('Parsing command:', commandText);

    if (!commandText) {
      return {
        type: 'error',
        message: 'I didn\'t catch that. Could you repeat your command?',
        speak: 'I didn\'t catch that. Could you repeat your command?'
      };
    }

    // Try to match command patterns
    for (const [category, config] of Object.entries(this.commands)) {
      console.log(`Checking ${category} patterns...`);
      for (const pattern of config.patterns) {
        const match = commandText.match(pattern);
        if (match) {
          console.log(`Matched ${category} pattern:`, pattern);
          this.context.lastCommand = { category, match, commandText };
          const result = config.handler(match, commandText);
          console.log(`Handler result:`, result);
          return result;
        }
      }
    }

    console.log('No patterns matched, trying contextual understanding');
    // If no pattern matches, try contextual understanding
    const contextualResult = this.handleContextualCommand(commandText);

    // If contextual also fails, provide a helpful response
    if (contextualResult.type === 'error') {
      return {
        type: 'help',
        message: `I heard "${commandText}" but I'm not sure what you want me to do. Try saying "take me to products" or "search for something".`,
        speak: 'I\'m not sure what you want me to do. Try saying take me to products or search for something.'
      };
    }

    return contextualResult;
  }

  /**
   * Handle navigation commands
   */
  handleNavigation(match, commandText) {
    const destination = match[1] || match[2];
    const routes = {
      'home': '/',
      'dashboard': '/dashboard',
      'products': '/products',
      'product': '/products',
      'cart': '/cart',
      'checkout': '/checkout',
      'profile': '/profile',
      'settings': '/settings',
      'preppal': '/preppal',
      'voice': '/voice-shopping'
    };

    const route = routes[destination?.toLowerCase()];
    if (route) {
      return {
        type: 'navigation',
        action: 'navigate',
        route: route,
        message: `Taking you to ${destination}`,
        speak: `Navigating to ${destination}`
      };
    }

    return {
      type: 'error',
      message: `I don't know how to navigate to "${destination}"`
    };
  }

  /**
   * Handle search commands
   */
  handleSearch(match, commandText) {
    const searchTerm = match[1]?.trim();
    if (!searchTerm) {
      return {
        type: 'error',
        message: 'What would you like to search for?'
      };
    }

    return {
      type: 'search',
      action: 'search',
      query: searchTerm,
      message: `Searching for "${searchTerm}"`,
      speak: `Searching for ${searchTerm}`,
      route: `/products?search=${encodeURIComponent(searchTerm)}`
    };
  }

  /**
   * Handle cart commands
   */
  handleCart(match, commandText) {
    const fullMatch = match[0].toLowerCase();

    // Handle add/put/want/need/buy commands
    if (fullMatch.includes('add') || fullMatch.includes('put') ||
        fullMatch.includes('want') || fullMatch.includes('need') ||
        fullMatch.includes('buy') || fullMatch.includes('purchase') ||
        fullMatch.includes('get me')) {
      const itemName = match[1]?.trim();

      // Create a product object for the cart
      const productItem = this.createProductFromName(itemName);

      return {
        type: 'cart',
        action: 'add',
        item: productItem,
        message: `Adding ${itemName} to your cart`,
        speak: `Adding ${itemName} to cart`
      };
    }
    
    if (fullMatch.includes('remove') || fullMatch.includes('delete')) {
      const item = match[1]?.trim();
      return {
        type: 'cart',
        action: 'remove',
        item: item,
        message: `Removing "${item}" from your cart`,
        speak: `Removing ${item} from cart`
      };
    }
    
    if (fullMatch.includes('clear') || fullMatch.includes('empty')) {
      return {
        type: 'cart',
        action: 'clear',
        message: 'Clearing your cart',
        speak: 'Clearing cart'
      };
    }
    
    if (fullMatch.includes('show') || fullMatch.includes('check') ||
        fullMatch.includes('open') || fullMatch.includes('go to') ||
        fullMatch.includes('take me to')) {
      return {
        type: 'cart',
        action: 'show',
        message: 'Opening your cart',
        speak: 'Opening cart'
      };
    }

    return {
      type: 'error',
      message: 'I didn\'t understand that cart command'
    };
  }

  /**
   * Handle quantity commands
   */
  handleQuantity(match, commandText) {
    const quantity = parseInt(match[1]);
    const item = match[2]?.trim();
    
    if (isNaN(quantity)) {
      return {
        type: 'error',
        message: 'Please specify a valid quantity'
      };
    }

    return {
      type: 'quantity',
      action: 'update',
      item: item,
      quantity: quantity,
      message: `Updating quantity of "${item}" to ${quantity}`,
      speak: `Setting ${item} quantity to ${quantity}`
    };
  }

  /**
   * Handle filter commands
   */
  handleFilters(match, commandText) {
    const fullMatch = match[0].toLowerCase();
    
    if (fullMatch.includes('under') || fullMatch.includes('below') || fullMatch.includes('less than')) {
      const maxPrice = parseInt(match[2]);
      return {
        type: 'filter',
        action: 'price_max',
        value: maxPrice,
        message: `Showing items under $${maxPrice}`,
        speak: `Filtering items under ${maxPrice} dollars`
      };
    }
    
    if (fullMatch.includes('over') || fullMatch.includes('above') || fullMatch.includes('more than')) {
      const minPrice = parseInt(match[2]);
      return {
        type: 'filter',
        action: 'price_min',
        value: minPrice,
        message: `Showing items over $${minPrice}`,
        speak: `Filtering items over ${minPrice} dollars`
      };
    }
    
    if (fullMatch.includes('sort') || fullMatch.includes('order')) {
      const sortBy = match[1]?.toLowerCase();
      return {
        type: 'filter',
        action: 'sort',
        value: sortBy,
        message: `Sorting by ${sortBy}`,
        speak: `Sorting products by ${sortBy}`
      };
    }

    return {
      type: 'error',
      message: 'I didn\'t understand that filter command'
    };
  }

  /**
   * Handle accessibility commands
   */
  handleAccessibility(match, commandText) {
    const fullMatch = match[0].toLowerCase();
    const feature = match[1]?.toLowerCase();
    
    const isEnable = fullMatch.includes('enable') || fullMatch.includes('turn on') || fullMatch.includes('activate');
    const action = isEnable ? 'enable' : 'disable';
    
    return {
      type: 'accessibility',
      action: action,
      feature: feature,
      message: `${isEnable ? 'Enabling' : 'Disabling'} ${feature}`,
      speak: `${isEnable ? 'Turning on' : 'Turning off'} ${feature}`
    };
  }

  /**
   * Handle PrepPal commands
   */
  handlePrepPal(match, commandText) {
    const fullMatch = match[0].toLowerCase();

    if (fullMatch.includes('create') || fullMatch.includes('make') || fullMatch.includes('generate')) {
      const occasion = match[1]?.trim();
      return {
        type: 'preppal',
        action: 'create_list',
        occasion: occasion,
        message: `Creating a shopping list for ${occasion}`,
        speak: `Creating shopping list for ${occasion}`,
        route: `/preppal?action=create&occasion=${encodeURIComponent(occasion)}`
      };
    }

    if (fullMatch.includes('add') || fullMatch.includes('include')) {
      const item = match[1]?.trim();
      return {
        type: 'preppal',
        action: 'add_item',
        item: item,
        message: `Adding "${item}" to your shopping list`,
        speak: `Adding ${item} to shopping list`
      };
    }

    if (fullMatch.includes('plan') || fullMatch.includes('suggest')) {
      const mealType = match[1]?.trim();
      return {
        type: 'preppal',
        action: 'plan_meal',
        mealType: mealType,
        message: `Planning a meal for ${mealType}`,
        speak: `Planning meal for ${mealType}`,
        route: `/preppal?action=plan&meal=${encodeURIComponent(mealType)}`
      };
    }

    if (fullMatch.includes('what') || fullMatch.includes('how much')) {
      const purpose = match[1]?.trim();
      return {
        type: 'preppal',
        action: 'calculate_needs',
        purpose: purpose,
        message: `Calculating what you need for ${purpose}`,
        speak: `Calculating needs for ${purpose}`,
        route: `/preppal?action=calculate&purpose=${encodeURIComponent(purpose)}`
      };
    }

    if (fullMatch.includes('preppal') || fullMatch.includes('prep pal')) {
      const query = match[1]?.trim();
      return {
        type: 'preppal',
        action: 'general_query',
        query: query,
        message: `Asking PrepPal: "${query}"`,
        speak: `Asking PrepPal about ${query}`,
        route: `/preppal?query=${encodeURIComponent(query)}`
      };
    }

    return {
      type: 'error',
      message: 'I didn\'t understand that PrepPal command'
    };
  }

  /**
   * Handle general commands
   */
  handleGeneral(match, commandText) {
    const fullMatch = match[0].toLowerCase();
    
    if (fullMatch.includes('help') || fullMatch.includes('what can you do') || fullMatch.includes('commands')) {
      return {
        type: 'help',
        message: 'I can help you navigate, search for products, manage your cart, and adjust accessibility settings. Try saying "take me to products" or "search for headphones".',
        speak: 'I can help you navigate, search, manage your cart, and adjust settings. What would you like to do?'
      };
    }
    
    if (fullMatch.includes('hello') || fullMatch.includes('hi') || fullMatch.includes('hey')) {
      return {
        type: 'greeting',
        message: 'Hello! I\'m your voice shopping assistant. How can I help you today?',
        speak: 'Hello! How can I help you shop today?'
      };
    }
    
    if (fullMatch.includes('thank you') || fullMatch.includes('thanks')) {
      return {
        type: 'acknowledgment',
        message: 'You\'re welcome! Is there anything else I can help you with?',
        speak: 'You\'re welcome! Anything else I can help with?'
      };
    }
    
    if (fullMatch.includes('goodbye') || fullMatch.includes('bye') || fullMatch.includes('exit') || fullMatch.includes('stop')) {
      return {
        type: 'goodbye',
        message: 'Goodbye! Happy shopping!',
        speak: 'Goodbye! Have a great day!'
      };
    }

    return {
      type: 'general',
      message: 'I\'m here to help with your shopping. What can I do for you?'
    };
  }

  /**
   * Handle contextual commands based on current page/state
   */
  handleContextualCommand(commandText) {
    // If we're on products page and user says something product-related
    if (this.context.currentPage === '/products') {
      if (commandText.includes('this') || commandText.includes('that')) {
        return {
          type: 'contextual',
          action: 'add_current_product',
          message: 'Adding the current product to your cart',
          speak: 'Adding this product to cart'
        };
      }
    }

    // Default fallback
    return {
      type: 'unknown',
      message: 'I didn\'t understand that command. Try saying "help" to see what I can do.',
      speak: 'I didn\'t understand. Say help to see available commands.'
    };
  }

  /**
   * Get conversation context
   */
  getContext() {
    return this.context;
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.context.conversationHistory = [];
  }

  /**
   * Create a product object from a spoken name
   */
  createProductFromName(itemName) {
    // Common product mappings with realistic prices
    const productMappings = {
      'headphones': { name: 'Wireless Headphones', price: 79.99, category: 'Electronics' },
      'laptop': { name: 'Laptop Computer', price: 899.99, category: 'Electronics' },
      'phone': { name: 'Smartphone', price: 699.99, category: 'Electronics' },
      'tablet': { name: 'Tablet', price: 329.99, category: 'Electronics' },
      'mouse': { name: 'Wireless Mouse', price: 29.99, category: 'Electronics' },
      'keyboard': { name: 'Wireless Keyboard', price: 49.99, category: 'Electronics' },
      'speaker': { name: 'Bluetooth Speaker', price: 59.99, category: 'Electronics' },
      'charger': { name: 'Phone Charger', price: 19.99, category: 'Electronics' },
      'cable': { name: 'USB Cable', price: 12.99, category: 'Electronics' },
      'book': { name: 'Book', price: 14.99, category: 'Books' },
      'shirt': { name: 'T-Shirt', price: 19.99, category: 'Clothing' },
      'jeans': { name: 'Jeans', price: 49.99, category: 'Clothing' },
      'shoes': { name: 'Sneakers', price: 89.99, category: 'Clothing' },
      'jacket': { name: 'Jacket', price: 79.99, category: 'Clothing' },
      'milk': { name: 'Milk', price: 3.99, category: 'Groceries' },
      'bread': { name: 'Bread', price: 2.49, category: 'Groceries' },
      'eggs': { name: 'Eggs', price: 4.99, category: 'Groceries' },
      'cheese': { name: 'Cheese', price: 5.99, category: 'Groceries' },
      'apple': { name: 'Apples', price: 3.99, category: 'Groceries' },
      'banana': { name: 'Bananas', price: 2.99, category: 'Groceries' }
    };

    // Try to find a match
    const lowerItemName = itemName.toLowerCase();
    for (const [key, product] of Object.entries(productMappings)) {
      if (lowerItemName.includes(key)) {
        return {
          ...product,
          id: Date.now() + Math.random(), // Simple ID generation
        };
      }
    }

    // If no specific match, create a generic product
    return {
      name: itemName,
      price: 29.99, // Default price
      category: 'General',
      id: Date.now() + Math.random()
    };
  }

  /**
   * Update context
   */
  updateContext(newContext) {
    this.context = { ...this.context, ...newContext };
  }
}

export default VoiceCommandProcessor;
