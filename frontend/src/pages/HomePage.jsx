import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ShoppingCart, 
  Brain, 
  Mic, 
  Eye, 
  Heart,
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Shield
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import VoiceButton from '../components/voice/VoiceButton';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { focusMode } = useAccessibility();

  const features = [
    {
      icon: Brain,
      title: 'Adaptive Interface',
      description: 'Real-time UI adjustments based on your behavior and preferences',
      color: 'bg-blue-500'
    },
    {
      icon: Mic,
      title: 'Voice Shopping',
      description: 'Shop hands-free with voice commands and audio feedback',
      color: 'bg-green-500'
    },
    {
      icon: Eye,
      title: 'Accessibility First',
      description: 'WCAG 2.1 AA compliant with multiple theme and font options',
      color: 'bg-purple-500'
    },
    {
      icon: Zap,
      title: 'PrepPal Assistant',
      description: 'AI-powered shopping lists from natural language descriptions',
      color: 'bg-yellow-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      condition: 'ADHD',
      quote: 'The focus mode helps me shop without getting overwhelmed. Finally, a shopping experience that works for my brain!',
      rating: 5
    },
    {
      name: 'David K.',
      condition: 'Autism Spectrum',
      quote: 'The predictable layout and reduced stimulation options make shopping so much less stressful.',
      rating: 5
    },
    {
      name: 'Maria L.',
      condition: 'Dyslexia',
      quote: 'The dyslexia-friendly font and voice commands have transformed how I shop online.',
      rating: 5
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Users' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '50%', label: 'Reduced Shopping Time' },
    { number: '24/7', label: 'Accessibility Support' }
  ];

  return (
    <>
      <Helmet>
        <title>Walmart SenseEase - Shop Smart. Shop Calm. Designed for Every Mind.</title>
        <meta name="description" content="An adaptive Walmart shopping experience tailored for cognitive and sensory needs. Features voice shopping, real-time UI adaptation, and comprehensive accessibility tools." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-walmart-blue to-blue-700 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Shop Smart. <br />
                <span className="text-walmart-yellow">Shop Calm.</span> <br />
                <span className="text-2xl md:text-3xl font-normal">Designed for Every Mind.</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
                An adaptive Walmart shopping experience tailored for cognitive and sensory needs.
                Experience shopping that adapts to you, not the other way around.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/products"
                      className="btn btn-primary bg-walmart-yellow text-walmart-blue hover:bg-yellow-400 text-lg px-8 py-4 flex items-center"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" aria-hidden="true" />
                      Start Shopping
                    </Link>
                    <Link
                      to="/preppal"
                      className="btn btn-secondary bg-white text-walmart-blue hover:bg-gray-100 text-lg px-8 py-4 flex items-center"
                    >
                      <Brain className="w-5 h-5 mr-2" aria-hidden="true" />
                      Try PrepPal
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn btn-primary bg-walmart-yellow text-walmart-blue hover:bg-yellow-400 text-lg px-8 py-4 flex items-center"
                    >
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                    </Link>
                    <Link
                      to="/products"
                      className="btn btn-secondary bg-white text-walmart-blue hover:bg-gray-100 text-lg px-8 py-4 flex items-center"
                    >
                      <Eye className="w-5 h-5 mr-2" aria-hidden="true" />
                      Browse Products
                    </Link>
                  </>
                )}
              </div>

              {/* Voice Demo */}
              <div className="flex items-center justify-center space-x-4 text-sm opacity-80">
                <span>Try voice shopping:</span>
                <VoiceButton 
                  size="medium"
                  onVoiceResult={(result) => {
                    if (result.toLowerCase().includes('shop') || result.toLowerCase().includes('product')) {
                      window.location.href = '/products';
                    }
                  }}
                />
                <span>Say "Show me products"</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {!focusMode && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-3xl md:text-4xl font-bold text-walmart-blue">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How SenseEase Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Three simple steps to a personalized shopping experience that adapts to your unique needs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-walmart-blue rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold">Setup Your Profile</h3>
                <p className="text-gray-600">
                  Tell us about your cognitive and sensory preferences to customize your interface.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-walmart-blue rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold">Shop With Adaptations</h3>
                <p className="text-gray-600">
                  Our AI monitors your behavior and automatically adjusts the interface for optimal comfort.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-walmart-blue rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold">Track Your Progress</h3>
                <p className="text-gray-600">
                  Monitor your comfort metrics and see how your shopping experience improves over time.
                </p>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {!focusMode && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  What Our Users Say
                </h2>
                <p className="text-xl text-gray-600">
                  Real experiences from our neurodiverse community
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" aria-hidden="true" />
                      ))}
                    </div>
                    <blockquote className="text-gray-700 mb-4 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-500">{testimonial.condition}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-walmart-blue text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Shopping Experience?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who have discovered a calmer, more accessible way to shop.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/accessibility-setup"
                    className="btn btn-primary bg-walmart-yellow text-walmart-blue hover:bg-yellow-400 text-lg px-8 py-4 flex items-center justify-center"
                  >
                    <Settings className="w-5 h-5 mr-2" aria-hidden="true" />
                    Customize Your Experience
                  </Link>
                  <Link
                    to="/dashboard"
                    className="btn btn-secondary bg-white text-walmart-blue hover:bg-gray-100 text-lg px-8 py-4 flex items-center justify-center"
                  >
                    <Users className="w-5 h-5 mr-2" aria-hidden="true" />
                    View Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn btn-primary bg-walmart-yellow text-walmart-blue hover:bg-yellow-400 text-lg px-8 py-4 flex items-center justify-center"
                  >
                    <Heart className="w-5 h-5 mr-2" aria-hidden="true" />
                    Start Your Journey
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-secondary bg-white text-walmart-blue hover:bg-gray-100 text-lg px-8 py-4 flex items-center justify-center"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            <div className="mt-8 flex items-center justify-center space-x-4 text-sm opacity-80">
              <Shield className="w-4 h-4" aria-hidden="true" />
              <span>Free to use • WCAG 2.1 AA Compliant • Privacy Protected</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
