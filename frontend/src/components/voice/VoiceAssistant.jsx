import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic, MicOff, Volume2, VolumeX, Settings, X, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/SimpleAuthContext';
import ContinuousVoiceService from '../../services/continuousVoiceService';

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, removeFromCart, clearCart } = useAuth();
  const voiceServiceRef = useRef(null);
  
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [commandMode, setCommandMode] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [conversation, setConversation] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [listeningAnimation, setListeningAnimation] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [typedCommand, setTypedCommand] = useState('');
  const [settings, setSettings] = useState({
    voiceFeedback: true,
    wakeWordSensitivity: 'medium',
    autoMinimize: true
  });

  // Initialize voice service
  useEffect(() => {
    if (!ContinuousVoiceService.isSupported()) {
      toast.error('Voice commands not supported in this browser');
      return;
    }

    voiceServiceRef.current = new ContinuousVoiceService();
    
    // Set up callbacks
    voiceServiceRef.current.setCallbacks({
      onCommand: handleVoiceCommand,
      onWakeWord: handleWakeWord,
      onError: handleVoiceError,
      onStatusChange: handleStatusChange,
      onTranscript: handleTranscript
    });

    return () => {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.stop();
      }
    };
  }, []);

  // Handle voice commands (now routes through typing system)
  const handleVoiceCommand = (result, transcript) => {
    console.log('Voice command:', result);
    setIsProcessing(true);
    setListeningAnimation(false);

    // Show what was heard
    setConversation(prev => [
      ...prev,
      { type: 'user', message: `"${transcript}"`, timestamp: Date.now() }
    ]);

    // Show action feedback first
    setTimeout(() => {
      const actionMessage = getActionMessage(result);
      setConversation(prev => [
        ...prev,
        { type: 'assistant', message: actionMessage, timestamp: Date.now() }
      ]);

      // Then execute the actual command after a brief delay
      setTimeout(() => {
        executeCommand(result);
        setIsProcessing(false);

        // Auto-minimize if enabled
        if (settings.autoMinimize && result.type !== 'error') {
          setTimeout(() => setIsMinimized(true), 3000);
        }
      }, 1000);
    }, 500);
  };

  // Get action message based on command type
  const getActionMessage = (result) => {
    switch (result.type) {
      case 'navigation':
        const page = result.route?.replace('/', '') || 'page';
        return `OK, going to ${page}`;
      case 'cart':
        if (result.action === 'add') {
          return `Yes, adding ${result.item?.name || 'item'} to cart`;
        } else if (result.action === 'show') {
          return `OK, opening cart`;
        } else if (result.action === 'clear') {
          return `OK, clearing cart`;
        }
        return `OK, updating cart`;
      case 'search':
        return `OK, searching`;
      case 'help':
        return `OK, showing help`;
      default:
        return `OK, got it`;
    }
  };

  // Handle wake word detection
  const handleWakeWord = () => {
    setCommandMode(true);
    setIsMinimized(false);

    if (settings.voiceFeedback) {
      // Visual feedback
      toast.success('Voice assistant activated', {
        duration: 1500,
        icon: '🎤'
      });
    }
  };

  // Handle real-time transcript
  const handleTranscript = (transcript, isInterim) => {
    console.log('Transcript received:', transcript, 'isInterim:', isInterim);

    if (isInterim) {
      setLiveTranscript(transcript);
      setCurrentTranscript(`"${transcript}"`);
    } else {
      // Final transcript - automatically add to chat and process
      setLiveTranscript('');
      setCurrentTranscript('');

      if (transcript.trim()) {
        console.log('Final transcript, auto-processing:', transcript);

        // Add to chat input briefly to show what was heard
        setTypedCommand(transcript);

        // Process the command automatically and immediately
        setTimeout(() => {
          console.log('Auto-processing voice command:', transcript);
          processVoiceCommand(transcript);
          setTypedCommand(''); // Clear after processing
        }, 100);
      }
    }
  };

  // Handle voice errors
  const handleVoiceError = (error) => {
    console.error('Voice error:', error);
    toast.error(error);

    // Add error to conversation for debugging
    setConversation(prev => [
      ...prev,
      { type: 'error', message: `Error: ${error}`, timestamp: Date.now() }
    ]);
  };

  // Handle status changes
  const handleStatusChange = (status) => {
    console.log('Voice status change:', status);
    setIsListening(status.listening);
    setCommandMode(status.commandMode || status.active);

    // Control listening animation
    if (status.listening) {
      setListeningAnimation(true);
      setCurrentTranscript('Listening...');
      // Auto-expand when listening starts
      if (isMinimized) {
        setIsMinimized(false);
      }
    } else {
      setListeningAnimation(false);
      setCurrentTranscript('');
      setLiveTranscript(''); // Clear live transcript when not listening
    }

    // Show command mode activation
    if (status.commandMode && !commandMode) {
      setCurrentTranscript('Command mode - speak now!');
      toast.success('🎯 Ready for your command!', { duration: 2000 });
    }
  };

  // Execute voice commands
  const executeCommand = (result) => {
    console.log('Executing command:', result);

    switch (result.type) {
      case 'navigation':
        if (result.route) {
          console.log('Navigating to:', result.route);
          navigate(result.route);

          // Quick confirmation
          const page = result.route.replace('/', '');
          toast.success(`✅ Opened ${page}`);

          // Speak confirmation
          if (settings.voiceFeedback && voiceServiceRef.current) {
            voiceServiceRef.current.speak(`Done`);
          }
        } else {
          toast.error('❌ Navigation failed');
        }
        break;

      case 'search':
        if (result.route) {
          console.log('Navigating to search:', result.route);
          navigate(result.route);
          toast.success(`🔍 Search opened`);

          if (settings.voiceFeedback && voiceServiceRef.current) {
            voiceServiceRef.current.speak(`Done`);
          }
        } else {
          toast.error('❌ Search failed');
        }
        break;

      case 'cart':
        handleCartCommand(result);
        break;

      case 'help':
        setIsMinimized(false);
        toast.success('ℹ️ Help opened');
        if (settings.voiceFeedback && voiceServiceRef.current) {
          voiceServiceRef.current.speak('OK');
        }
        break;

      case 'general':
        toast.success(`💬 ${result.message}`);
        if (result.speak && settings.voiceFeedback && voiceServiceRef.current) {
          voiceServiceRef.current.speak(result.speak);
        }
        break;

      default:
        // Handle any unrecognized commands
        toast.info(`🤔 ${result.message || 'Command processed'}`);
        if (result.speak && settings.voiceFeedback && voiceServiceRef.current) {
          voiceServiceRef.current.speak(result.speak);
        }
    }
  };

  // Handle cart commands
  const handleCartCommand = (result) => {
    console.log('Handling cart command:', result);

    switch (result.action) {
      case 'add':
        if (result.item) {
          // Add the specific item to cart
          addToCart(result.item);
          toast.success(`✅ Added ${result.item.name}`);

          // Speak confirmation
          if (settings.voiceFeedback && voiceServiceRef.current) {
            voiceServiceRef.current.speak(`Added`);
          }
        } else {
          toast.error('❌ Could not add item');
        }
        break;

      case 'remove':
        // For now, just show message - would need item ID for real removal
        toast.success('🗑️ Item removed from cart');
        break;

      case 'clear':
        clearCart();
        toast.success('🧹 Cart cleared');
        if (settings.voiceFeedback && voiceServiceRef.current) {
          voiceServiceRef.current.speak('Cleared');
        }
        break;

      case 'show':
        navigate('/cart');
        toast.success('🛒 Cart opened');
        if (settings.voiceFeedback && voiceServiceRef.current) {
          voiceServiceRef.current.speak('Done');
        }
        break;

      default:
        toast.error('❌ Unknown cart command');
    }
  };

  // Handle filter commands
  const handleFilterCommand = (result) => {
    // This would integrate with your product filtering
    const currentParams = new URLSearchParams(location.search);
    
    switch (result.action) {
      case 'price_max':
        currentParams.set('maxPrice', result.value);
        break;
      case 'price_min':
        currentParams.set('minPrice', result.value);
        break;
      case 'sort':
        currentParams.set('sort', result.value);
        break;
    }
    
    navigate(`${location.pathname}?${currentParams.toString()}`);
    toast.success(result.message);
  };

  // Handle accessibility commands
  const handleAccessibilityCommand = (result) => {
    // This would integrate with your accessibility context
    toast.success(result.message);
  };

  // Handle PrepPal commands
  const handlePrepPalCommand = (result) => {
    switch (result.action) {
      case 'create_list':
      case 'plan_meal':
      case 'calculate_needs':
      case 'general_query':
        if (result.route) {
          navigate(result.route);
          toast.success(result.message);
        }
        break;
      case 'add_item':
        // This would integrate with PrepPal's add item functionality
        toast.success(result.message);
        // You could also trigger a PrepPal API call here
        break;
      default:
        toast.success(result.message);
    }
  };

  // Toggle voice assistant
  const toggleVoiceAssistant = async () => {
    if (!voiceServiceRef.current) return;

    if (isActive) {
      voiceServiceRef.current.stop();
      setIsActive(false);
      toast.success('Voice assistant disabled');
    } else {
      const started = await voiceServiceRef.current.start();
      if (started) {
        setIsActive(true);
        toast.success('Voice assistant enabled - Say "Hey Sense" to activate');
      }
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setConversation([]);
    voiceServiceRef.current?.commandProcessor.clearHistory();
  };

  // Test microphone permissions
  const testMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      toast.success('Microphone access granted!');
      setConversation(prev => [
        ...prev,
        { type: 'status', message: '✅ Microphone test successful', timestamp: Date.now() }
      ]);
    } catch (error) {
      console.error('Microphone test failed:', error);
      toast.error('Microphone access denied or unavailable');
      setConversation(prev => [
        ...prev,
        { type: 'error', message: `❌ Microphone test failed: ${error.message}`, timestamp: Date.now() }
      ]);
    }
  };

  // Quick voice command examples
  const showExamples = () => {
    setConversation(prev => [
      ...prev,
      {
        type: 'assistant',
        message: `Try these voice commands:
• "Hey Sense, take me to products"
• "Sense, add headphones to cart"
• "Hey Sense, I want a laptop"
• "Sense, show my cart"
• "Hey Sense, search for phones"`,
        timestamp: Date.now()
      }
    ]);
  };

  // Test transcript display
  const testTranscript = () => {
    setLiveTranscript('Testing live transcript display...');
    setListeningAnimation(true);

    setTimeout(() => {
      setLiveTranscript('');
      setListeningAnimation(false);
      toast.success('Transcript test completed!');
    }, 3000);
  };

  // Process voice commands directly (hands-free)
  const processVoiceCommand = (command) => {
    console.log('Processing voice command directly:', command);

    // Check for deactivation commands
    const deactivationWords = ['done', 'thanks', 'thank you', 'goodbye', 'bye', 'stop', 'exit', 'finish', 'that\'s all'];
    const lowerCommand = command.toLowerCase().trim();

    if (deactivationWords.some(word => lowerCommand.includes(word))) {
      // Deactivate voice assistant
      setIsActive(false);
      setIsMinimized(true);
      setCommandMode(false);
      setListeningAnimation(false);
      setLiveTranscript('');

      if (voiceServiceRef.current) {
        voiceServiceRef.current.stop();
      }

      toast.success('👋 Voice assistant deactivated. Have a great day!');
      return;
    }

    // Add to conversation
    setConversation(prev => [
      ...prev,
      { type: 'user', message: `"${command}"`, timestamp: Date.now() }
    ]);

    // Process command directly with actions
    processCommandWithActions(command);
  };

  // Process commands and actually perform actions
  const processCommandWithActions = (command) => {
    const lowerCommand = command.toLowerCase().trim();
    console.log('Processing command with actions:', lowerCommand);

    // Remove wake words
    const cleanCommand = lowerCommand
      .replace(/hey sense/gi, '')
      .replace(/hi sense/gi, '')
      .replace(/ok sense/gi, '')
      .replace(/sense/gi, '')
      .trim();

    console.log('Clean command:', cleanCommand);

    // Navigation commands
    if (cleanCommand.includes('take me to') || cleanCommand.includes('go to') || cleanCommand.includes('open') || cleanCommand.includes('show me')) {
      if (cleanCommand.includes('product') || cleanCommand.includes('shop') || cleanCommand.includes('store')) {
        navigate('/products');
        toast.success('🛍️ Opening products');
        addAssistantMessage('OK, opening products');
        return;
      }
      if (cleanCommand.includes('dashboard') || cleanCommand.includes('home')) {
        navigate('/dashboard');
        toast.success('🏠 Opening dashboard');
        addAssistantMessage('OK, opening dashboard');
        return;
      }
      if (cleanCommand.includes('adaptive') || cleanCommand.includes('settings') || cleanCommand.includes('accessibility')) {
        navigate('/adaptive');
        toast.success('⚙️ Opening adaptive settings');
        addAssistantMessage('OK, opening adaptive settings');
        return;
      }
      if (cleanCommand.includes('cart')) {
        navigate('/cart');
        toast.success('🛒 Opening cart');
        addAssistantMessage('OK, opening your cart');
        return;
      }
    }

    // Cart commands - more flexible patterns
    if (cleanCommand.includes('add') || cleanCommand.includes('get') || cleanCommand.includes('buy') || cleanCommand.includes('purchase')) {
      const item = extractItemName(cleanCommand);
      console.log('Extracted item:', item);
      if (item) {
        const product = createProductFromName(item);
        console.log('Created product:', product);
        addToCart(product);
        toast.success(`✅ Added ${product.name}`);
        addAssistantMessage(`Added ${product.name} to cart`);
        return;
      } else {
        console.log('No item extracted from command:', cleanCommand);
        addAssistantMessage('What would you like to add to your cart?');
        return;
      }
    }

    // Adaptive features
    if (cleanCommand.includes('apply') || cleanCommand.includes('enable') || cleanCommand.includes('turn on')) {
      if (cleanCommand.includes('high contrast')) {
        applyAdaptiveFeature('highContrast', true);
        toast.success('🎨 High contrast enabled');
        addAssistantMessage('High contrast enabled');
        return;
      }
      if (cleanCommand.includes('large text') || cleanCommand.includes('big text')) {
        applyAdaptiveFeature('largeText', true);
        toast.success('📝 Large text enabled');
        addAssistantMessage('Large text enabled');
        return;
      }
      if (cleanCommand.includes('focus mode')) {
        applyAdaptiveFeature('focusMode', true);
        toast.success('🎯 Focus mode enabled');
        addAssistantMessage('Focus mode enabled');
        return;
      }
      if (cleanCommand.includes('reduced motion')) {
        applyAdaptiveFeature('reducedMotion', true);
        toast.success('🔄 Reduced motion enabled');
        addAssistantMessage('Reduced motion enabled');
        return;
      }
    }

    // Disable adaptive features
    if (cleanCommand.includes('disable') || cleanCommand.includes('turn off') || cleanCommand.includes('remove') ||
        cleanCommand.includes('reduce') || cleanCommand.includes('lower') || cleanCommand.includes('normal') ||
        cleanCommand.includes('reset') || cleanCommand.includes('undo')) {
      if (cleanCommand.includes('high contrast') || cleanCommand.includes('contrast')) {
        applyAdaptiveFeature('highContrast', false);
        toast.success('🎨 High contrast disabled');
        addAssistantMessage('High contrast disabled');
        return;
      }
      if (cleanCommand.includes('large text') || cleanCommand.includes('big text') || cleanCommand.includes('text')) {
        applyAdaptiveFeature('largeText', false);
        toast.success('📝 Large text disabled');
        addAssistantMessage('Large text disabled');
        return;
      }
      if (cleanCommand.includes('focus mode') || cleanCommand.includes('focus')) {
        applyAdaptiveFeature('focusMode', false);
        toast.success('🎯 Focus mode disabled');
        addAssistantMessage('Focus mode disabled');
        return;
      }
      if (cleanCommand.includes('motion')) {
        applyAdaptiveFeature('reducedMotion', false);
        toast.success('🔄 Reduced motion disabled');
        addAssistantMessage('Reduced motion disabled');
        return;
      }
    }

    // Show cart
    if (cleanCommand.includes('show') && cleanCommand.includes('cart')) {
      navigate('/cart');
      toast.success('🛒 Opening cart');
      addAssistantMessage('OK, showing your cart');
      return;
    }

    // Clear cart
    if (cleanCommand.includes('clear') && cleanCommand.includes('cart')) {
      clearCart();
      toast.success('🧹 Cart cleared');
      addAssistantMessage('Cart cleared');
      return;
    }

    // PrepPal integration - event planning
    if (cleanCommand.includes('going to') || cleanCommand.includes('planning') || cleanCommand.includes('event') ||
        cleanCommand.includes('picnic') || cleanCommand.includes('party') || cleanCommand.includes('trip') ||
        cleanCommand.includes('camping') || cleanCommand.includes('beach') || cleanCommand.includes('barbecue')) {

      const eventType = extractEventType(cleanCommand);
      const suggestions = getPrepPalSuggestions(eventType);

      navigate('/preppal');
      toast.success(`🎯 Opening PrepPal for ${eventType}`);
      addAssistantMessage(`Great! I found some essentials for your ${eventType}:`);

      // Add suggestions to conversation
      setTimeout(() => {
        addAssistantMessage(`📋 ${eventType.toUpperCase()} ESSENTIALS:\n${suggestions.join('\n')}\n\nWould you like me to add any of these to your cart?`);
      }, 1000);

      return;
    }

    // PrepPal integration - event planning
    if (cleanCommand.includes('going to') || cleanCommand.includes('planning') || cleanCommand.includes('event') ||
        cleanCommand.includes('picnic') || cleanCommand.includes('party') || cleanCommand.includes('trip') ||
        cleanCommand.includes('camping') || cleanCommand.includes('beach') || cleanCommand.includes('barbecue')) {

      const eventType = extractEventType(cleanCommand);
      const suggestions = getPrepPalSuggestions(eventType);

      navigate('/preppal');
      toast.success(`🎯 Opening PrepPal for ${eventType}`);
      addAssistantMessage(`Great! I found some essentials for your ${eventType}:`);

      // Add suggestions to conversation
      setTimeout(() => {
        addAssistantMessage(`📋 ${eventType.toUpperCase()} ESSENTIALS:\n${suggestions.join('\n')}\n\nWould you like me to add any of these to your cart?`);
      }, 1000);

      return;
    }

    // Default response
    addAssistantMessage('OK, got it');
  };

  // Helper functions
  const addAssistantMessage = (message) => {
    setConversation(prev => {
      const newConversation = [...prev, { type: 'assistant', message, timestamp: Date.now() }];
      // Auto-scroll to bottom after message is added
      setTimeout(() => {
        const conversationArea = document.querySelector('.conversation-area');
        if (conversationArea) {
          conversationArea.scrollTop = conversationArea.scrollHeight;
        }
      }, 100);
      return newConversation;
    });
  };

  // Apply adaptive features
  const applyAdaptiveFeature = (feature, enabled) => {
    console.log(`Applying adaptive feature: ${feature} = ${enabled}`);

    // Apply to document body for immediate effect
    const body = document.body;

    switch (feature) {
      case 'highContrast':
        if (enabled) {
          body.classList.add('high-contrast');
          body.style.filter = 'contrast(150%) brightness(120%)';
        } else {
          body.classList.remove('high-contrast');
          body.style.filter = '';
        }
        break;

      case 'largeText':
        if (enabled) {
          body.classList.add('large-text');
          body.style.fontSize = '120%';
        } else {
          body.classList.remove('large-text');
          body.style.fontSize = '';
        }
        break;

      case 'focusMode':
        if (enabled) {
          body.classList.add('focus-mode');
          // Add focus styles
          const style = document.createElement('style');
          style.textContent = `
            .focus-mode * { transition: none !important; }
            .focus-mode *:focus { outline: 3px solid #007bff !important; }
          `;
          document.head.appendChild(style);
        } else {
          body.classList.remove('focus-mode');
        }
        break;

      case 'reducedMotion':
        if (enabled) {
          body.classList.add('reduced-motion');
          const style = document.createElement('style');
          style.textContent = `
            .reduced-motion *, .reduced-motion *::before, .reduced-motion *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          `;
          document.head.appendChild(style);
        } else {
          body.classList.remove('reduced-motion');
        }
        break;
    }
  };

  const extractItemName = (command) => {
    console.log('Extracting item from command:', command);

    // More comprehensive patterns for item extraction
    const patterns = [
      /add\s+(.+?)\s+to\s+cart/i,
      /add\s+(.+?)\s+cart/i,
      /add\s+(.+)/i,
      /get\s+me\s+(.+)/i,
      /get\s+(.+)/i,
      /buy\s+(.+)/i,
      /purchase\s+(.+)/i,
      /i\s+want\s+(.+)/i,
      /i\s+need\s+(.+)/i
    ];

    for (const pattern of patterns) {
      const match = command.match(pattern);
      if (match && match[1]) {
        let item = match[1].trim();
        // Clean up common words
        item = item.replace(/\s+(to\s+cart|cart|please|now)$/i, '');
        item = item.replace(/^(a|an|some|the)\s+/i, '');
        console.log('Extracted item:', item);
        return item;
      }
    }

    // If no pattern matches, try to find known product names
    const knownProducts = ['headphones', 'laptop', 'phone', 'tablet', 'mouse', 'keyboard', 'speaker', 'charger', 'book', 'shirt', 'jeans', 'shoes'];
    for (const product of knownProducts) {
      if (command.includes(product)) {
        console.log('Found known product:', product);
        return product;
      }
    }

    console.log('No item extracted');
    return null;
  };

  const createProductFromName = (itemName) => {
    // Product mappings with realistic prices
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
      'shoes': { name: 'Sneakers', price: 89.99, category: 'Clothing' }
    };

    // Try to find a match
    const lowerItemName = itemName.toLowerCase();
    for (const [key, product] of Object.entries(productMappings)) {
      if (lowerItemName.includes(key)) {
        return {
          ...product,
          id: Date.now() + Math.random(),
        };
      }
    }

    // Default product
    return {
      name: itemName,
      price: 29.99,
      category: 'General',
      id: Date.now() + Math.random()
    };
  };

  // PrepPal helper functions
  const extractEventType = (command) => {
    const eventTypes = {
      'picnic': 'picnic',
      'party': 'party',
      'camping': 'camping',
      'beach': 'beach trip',
      'barbecue': 'barbecue',
      'trip': 'trip',
      'hiking': 'hiking',
      'birthday': 'birthday party'
    };

    for (const [key, value] of Object.entries(eventTypes)) {
      if (command.includes(key)) {
        return value;
      }
    }
    return 'event';
  };

  const getPrepPalSuggestions = (eventType) => {
    const suggestions = {
      'picnic': [
        '🧺 Picnic Basket ($24.99)',
        '🥤 Cooler with Ice Packs ($39.99)',
        '🍽️ Disposable Plates & Utensils ($12.99)',
        '🧻 Paper Towels & Napkins ($8.99)',
        '🪑 Folding Chairs ($29.99 each)',
        '☂️ Pop-up Canopy ($79.99)'
      ],
      'camping': [
        '⛺ 4-Person Tent ($89.99)',
        '🎒 Sleeping Bags ($34.99 each)',
        '🔦 LED Lantern ($19.99)',
        '🍳 Portable Camp Stove ($45.99)',
        '🧊 Large Cooler ($59.99)',
        '🪓 Multi-tool Kit ($24.99)'
      ],
      'beach trip': [
        '🏖️ Beach Umbrella ($34.99)',
        '🪑 Beach Chairs ($24.99 each)',
        '🧴 Sunscreen SPF 50 ($12.99)',
        '🏐 Beach Volleyball ($16.99)',
        '🧊 Portable Cooler ($29.99)',
        '🏊 Beach Towels ($14.99 each)'
      ],
      'party': [
        '🎈 Party Decorations ($19.99)',
        '🍽️ Paper Plates & Cups ($15.99)',
        '🎵 Bluetooth Speaker ($49.99)',
        '🍰 Cake Mix & Frosting ($8.99)',
        '🥤 Party Drinks ($24.99)',
        '📸 Disposable Cameras ($12.99)'
      ],
      'barbecue': [
        '🔥 Charcoal & Lighter Fluid ($18.99)',
        '🍖 BBQ Tools Set ($29.99)',
        '🧊 Ice & Cooler ($34.99)',
        '🌭 Hot Dogs & Burgers ($22.99)',
        '🥗 Side Dish Ingredients ($16.99)',
        '🧻 Paper Towels & Wet Wipes ($9.99)'
      ]
    };

    return suggestions[eventType] || [
      '📋 Event Planning Checklist ($4.99)',
      '🛍️ Shopping Bags ($7.99)',
      '📱 Portable Phone Charger ($19.99)',
      '💧 Bottled Water ($8.99)',
      '🍿 Snacks Variety Pack ($15.99)'
    ];
  };

  // Handle typed commands (manual typing)
  const handleTypedCommand = (e) => {
    e.preventDefault();
    if (!typedCommand.trim()) return;

    console.log('Processing typed command:', typedCommand);
    processVoiceCommand(typedCommand); // Use same processor
    setTypedCommand('');
  };

  if (!ContinuousVoiceService.isSupported()) {
    return null;
  }

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">

        {/* Typing Button */}
        <div className="relative group">
          <button
            onClick={() => {
              setIsActive(true);
              setIsMinimized(false);
            }}
            className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:scale-110 border-2 border-white"
            title="Walmart Voice Assistant - Type Commands"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <div className="absolute -left-32 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Type Commands
          </div>
        </div>

        {/* Voice Button */}
        <div className="relative">
          {/* Listening Wave Animation */}
          {listeningAnimation && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-blue-400 animate-ping opacity-75"></div>
              <div className="absolute w-16 h-16 rounded-full border-4 border-blue-500 animate-ping opacity-50" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute w-12 h-12 rounded-full border-4 border-blue-600 animate-ping opacity-25" style={{animationDelay: '0.4s'}}></div>
            </div>
          )}

          {/* Processing Animation */}
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-green-400 animate-spin border-t-transparent"></div>
            </div>
          )}

          {/* Main Button */}
          <button
            onClick={toggleVoiceAssistant}
            className={`relative w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 border-2 border-white ${
              isActive
                ? listeningAnimation
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 scale-110 animate-pulse'
                  : isProcessing
                  ? 'bg-gradient-to-r from-green-600 to-green-700 animate-spin'
                  : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 hover:scale-105'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-blue-600 hover:to-blue-700 hover:scale-105'
            } text-white z-10`}
            title={isActive ? 'Walmart Voice Assistant - Active' : 'Enable Walmart Voice Assistant'}
          >
            {isActive ? (
              listeningAnimation ? (
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-white rounded animate-pulse"></div>
                  <div className="w-1 h-6 bg-white rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-4 bg-white rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1 h-6 bg-white rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                  <div className="w-1 h-4 bg-white rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              ) : isProcessing ? (
                <div className="animate-spin">⚙️</div>
              ) : (
                <Mic className="w-6 h-6" />
              )
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </button>
          
          {/* Expand Button */}
          {isActive && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="absolute -top-2 -left-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
              title={isMinimized ? 'Show Voice Assistant' : 'Hide Voice Assistant'}
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Live Transcript Box (ChatGPT Style) */}
      {isActive && (liveTranscript || listeningAnimation) && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-lg shadow-2xl border-2 border-blue-500 z-50">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex space-x-1">
                <div className="w-2 h-4 bg-blue-500 rounded animate-pulse"></div>
                <div className="w-2 h-6 bg-blue-500 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-4 bg-blue-500 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-6 bg-blue-500 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-2 h-4 bg-blue-500 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-sm font-medium text-blue-600">
                {liveTranscript ? 'You said:' : 'Listening...'}
              </span>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg min-h-[60px] flex items-center">
              <p className="text-xl text-gray-800 font-medium">
                {liveTranscript || 'Speak now...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Voice Assistant Panel */}
      {isActive && !isMinimized && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-40 backdrop-blur-sm bg-white/95">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2a1 1 0 0 1 2 0v2a5 5 0 0 0 10 0v-2a1 1 0 0 1 2 0z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Walmart Voice Assistant</h3>
                <p className="text-blue-100 text-xs">Powered by SenseEase AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Minimize"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {listeningAnimation ? (
                  <div className="flex space-x-1">
                    <div className="w-1 h-3 bg-blue-500 rounded animate-pulse"></div>
                    <div className="w-1 h-4 bg-blue-500 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1 h-3 bg-blue-500 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1 h-4 bg-blue-500 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                  </div>
                ) : isProcessing ? (
                  <div className="animate-spin text-green-500">⚙️</div>
                ) : (
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                )}
                <p className="text-sm font-medium">
                  {listeningAnimation ? (
                    <span className="text-blue-600">🎤 Listening...</span>
                  ) : isProcessing ? (
                    <span className="text-green-600">⚙️ Processing...</span>
                  ) : commandMode ? (
                    <span className="text-green-600">🎯 Ready for command</span>
                  ) : (
                    <span className="text-gray-600">💬 Say "Hey Sense" to start</span>
                  )}
                </p>
              </div>
              {currentTranscript && (
                <p className="text-xs text-gray-500 italic">{currentTranscript}</p>
              )}
            </div>
          </div>

          {/* Live Transcript */}
          {(listeningAnimation || currentTranscript) && (
            <div className="p-3 bg-blue-50 border-b border-blue-200">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-1 h-2 bg-blue-500 rounded animate-pulse"></div>
                  <div className="w-1 h-3 bg-blue-500 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-2 bg-blue-500 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                </div>
                <p className="text-sm text-blue-700 italic">
                  {currentTranscript || 'Listening...'}
                </p>
              </div>
            </div>
          )}

          {/* Conversation */}
          <div className="conversation-area h-64 overflow-y-auto p-4 space-y-3 scroll-smooth">
            {conversation.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-medium mb-2 text-gray-700">Voice Shopping Assistant</p>
                <p className="text-sm mb-4 text-gray-600">Just speak naturally - I'll help you shop!</p>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg mb-4">
                  <p className="font-medium text-gray-800 mb-2">Try saying:</p>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="bg-white px-3 py-1 rounded-full">"Hey Sense, take me to products"</p>
                    <p className="bg-white px-3 py-1 rounded-full">"Sense, add headphones to cart"</p>
                    <p className="bg-white px-3 py-1 rounded-full">"Hey Sense, show my cart"</p>
                  </div>
                </div>
              </div>
            ) : (
              conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 mb-4 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                  }`}>
                    {message.type === 'user' ? '👤' : '🤖'}
                  </div>

                  {/* Message */}
                  <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block px-4 py-2 rounded-2xl text-sm ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : message.type === 'error'
                        ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-sm'
                        : message.type === 'status'
                        ? 'bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-bl-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}>
                      <p className="whitespace-pre-line">{message.message}</p>
                    </div>
                    {message.timestamp && (
                      <p className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Type Command Input */}
          <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Type Your Command
              </h4>
              <p className="text-xs text-gray-600">Professional voice shopping assistant for Walmart</p>
            </div>
            <form onSubmit={handleTypedCommand} className="flex space-x-2">
              <input
                type="text"
                value={typedCommand}
                onChange={(e) => setTypedCommand(e.target.value)}
                placeholder="add headphones to cart"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!typedCommand.trim()}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send
              </button>
            </form>
            <div className="mt-2 flex flex-wrap gap-1">
              <button
                onClick={() => setTypedCommand('add headphones to cart')}
                className="text-xs bg-white px-2 py-1 rounded-full border hover:bg-gray-50 transition-colors"
              >
                add headphones to cart
              </button>
              <button
                onClick={() => setTypedCommand('take me to products')}
                className="text-xs bg-white px-2 py-1 rounded-full border hover:bg-gray-50 transition-colors"
              >
                take me to products
              </button>
              <button
                onClick={() => setTypedCommand('show my cart')}
                className="text-xs bg-white px-2 py-1 rounded-full border hover:bg-gray-50 transition-colors"
              >
                show my cart
              </button>
              <button
                onClick={() => setTypedCommand('thanks, done')}
                className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full border border-red-200 hover:bg-red-100 transition-colors"
              >
                done shopping
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="p-3 border-t border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={clearConversation}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear Chat
              </button>
              <button
                onClick={testMicrophone}
                className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
              >
                Test Mic
              </button>
              <button
                onClick={showExamples}
                className="text-xs text-green-500 hover:text-green-700 transition-colors"
              >
                Examples
              </button>
              <button
                onClick={testTranscript}
                className="text-xs text-purple-500 hover:text-purple-700 transition-colors"
              >
                Test Live
              </button>
              <button
                onClick={() => {
                  setTypedCommand('add headphones to cart');
                  setTimeout(() => {
                    const fakeEvent = {preventDefault: () => {}};
                    handleTypedCommand(fakeEvent);
                  }, 100);
                }}
                className="text-xs text-orange-500 hover:text-orange-700 transition-colors"
              >
                Test Cmd
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSettings(prev => ({ ...prev, voiceFeedback: !prev.voiceFeedback }))}
                className={`p-1 rounded transition-colors ${
                  settings.voiceFeedback ? 'text-blue-600' : 'text-gray-400'
                }`}
                title="Toggle Voice Feedback"
              >
                {settings.voiceFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
