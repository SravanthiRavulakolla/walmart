import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mic, Volume2, ShoppingCart, Search, MessageCircle } from 'lucide-react';
import VoiceButton from '../components/voice/VoiceButton';

const VoiceShoppingPage = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState([
    {
      type: 'assistant',
      message: 'Hi! I\'m your voice shopping assistant. You can say things like "Show me headphones" or "Add milk to my cart". How can I help you today?'
    }
  ]);

  const handleVoiceResult = (result) => {
    setTranscript(result);
    setConversation(prev => [...prev, { type: 'user', message: result }]);
    
    // Mock response based on voice command
    setTimeout(() => {
      let response = '';
      const lowerResult = result.toLowerCase();
      
      if (lowerResult.includes('headphones') || lowerResult.includes('earphones')) {
        response = 'I found several headphones for you. Would you like to see wireless or wired options?';
      } else if (lowerResult.includes('add') && lowerResult.includes('cart')) {
        response = 'I\'ve added that item to your cart. Is there anything else you\'d like to add?';
      } else if (lowerResult.includes('search') || lowerResult.includes('find')) {
        response = 'I\'m searching for that item now. Let me show you the best matches.';
      } else {
        response = 'I understand you\'re looking for something. Could you be more specific about what you need?';
      }
      
      setConversation(prev => [...prev, { type: 'assistant', message: response }]);
    }, 1000);
  };

  const quickCommands = [
    'Show me headphones',
    'Find organic milk',
    'Add bananas to cart',
    'What\'s on sale today?',
    'Show my cart',
    'Track my order'
  ];

  return (
    <>
      <Helmet>
        <title>Voice Shopping - Walmart SenseEase</title>
        <meta name="description" content="Shop hands-free with voice commands and audio assistance." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Voice Shopping Assistant
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Shop hands-free using voice commands. Just speak naturally and I'll help you find products, 
              manage your cart, and complete your shopping.
            </p>
          </div>

          {/* Voice Interface */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="text-center mb-6">
              <VoiceButton
                onVoiceResult={handleVoiceResult}
                onVoiceStart={() => setIsListening(true)}
                onVoiceEnd={() => setIsListening(false)}
                size="large"
                className="mx-auto"
              />
              <p className="mt-4 text-gray-600">
                {isListening ? 'Listening... Speak now' : 'Click the microphone to start speaking'}
              </p>
            </div>

            {transcript && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-blue-800">
                  <strong>You said:</strong> "{transcript}"
                </p>
              </div>
            )}
          </div>

          {/* Conversation History */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Conversation
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-walmart-blue text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Commands */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Try These Voice Commands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickCommands.map((command, index) => (
                <button
                  key={index}
                  onClick={() => handleVoiceResult(command)}
                  className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-gray-700">"{command}"</span>
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Search className="w-8 h-8 text-walmart-blue mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p className="text-sm text-gray-600">
                Find products using natural language descriptions
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <ShoppingCart className="w-8 h-8 text-walmart-blue mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Cart Management</h3>
              <p className="text-sm text-gray-600">
                Add, remove, and modify cart items with voice commands
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Volume2 className="w-8 h-8 text-walmart-blue mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Audio Feedback</h3>
              <p className="text-sm text-gray-600">
                Get spoken responses and product information
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoiceShoppingPage;
