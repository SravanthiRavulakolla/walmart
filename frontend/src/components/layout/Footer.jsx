import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  Accessibility, 
  Mail, 
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-walmart-yellow rounded-full flex items-center justify-center">
                <span className="text-walmart-blue font-bold text-sm">SE</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">SenseEase</h3>
                <p className="text-sm text-gray-400">by Walmart</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              An adaptive shopping experience designed for every mind. 
              Shop smart, shop calm, with accessibility at the forefront.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Accessibility className="w-4 h-4" aria-hidden="true" />
              <span>WCAG 2.1 AA Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <nav className="space-y-2">
              <Link 
                to="/products" 
                className="block text-gray-300 hover:text-white transition-colors focus-ring rounded"
              >
                Browse Products
              </Link>
              <Link 
                to="/preppal" 
                className="block text-gray-300 hover:text-white transition-colors focus-ring rounded"
              >
                PrepPal Assistant
              </Link>
              <Link 
                to="/voice-shopping" 
                className="block text-gray-300 hover:text-white transition-colors focus-ring rounded"
              >
                Voice Shopping
              </Link>
              <Link 
                to="/accessibility-setup" 
                className="block text-gray-300 hover:text-white transition-colors focus-ring rounded"
              >
                Accessibility Setup
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <nav className="space-y-2">
              <a 
                href="#help" 
                className="block text-gray-300 hover:text-white transition-colors focus-ring rounded"
              >
                Help Center
              </a>
              <a 
                href="#accessibility" 
                className="block text-gray-300 hover:text-white transition-colors focus-ring rounded"
              >
                Accessibility Guide
              </a>
              <a 
                href="#contact" 
                className="block text-gray-300 hover:text-white transition-colors focus-ring rounded"
              >
                Contact Us
              </a>
              <a 
                href="#feedback" 
                className="block text-gray-300 hover:text-white transition-colors focus-ring rounded"
              >
                Send Feedback
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm">1-800-WALMART</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm">senseease@walmart.com</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-300">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm">
                  702 SW 8th Street<br />
                  Bentonville, AR 72716
                </span>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-4">
              <h5 className="text-sm font-medium mb-3">Follow Us</h5>
              <div className="flex space-x-3">
                <a 
                  href="https://facebook.com/walmart" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors focus-ring rounded p-1"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-5 h-5" aria-hidden="true" />
                </a>
                <a 
                  href="https://twitter.com/walmart" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors focus-ring rounded p-1"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="w-5 h-5" aria-hidden="true" />
                </a>
                <a 
                  href="https://instagram.com/walmart" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors focus-ring rounded p-1"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5" aria-hidden="true" />
                </a>
                <a 
                  href="https://youtube.com/walmart" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors focus-ring rounded p-1"
                  aria-label="Follow us on YouTube"
                >
                  <Youtube className="w-5 h-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>© {currentYear} Walmart Inc. All rights reserved.</span>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500" aria-hidden="true" />
                <span>for accessibility</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a 
                href="#privacy" 
                className="text-gray-400 hover:text-white transition-colors focus-ring rounded"
              >
                Privacy Policy
              </a>
              <a 
                href="#terms" 
                className="text-gray-400 hover:text-white transition-colors focus-ring rounded"
              >
                Terms of Service
              </a>
              <div className="flex items-center space-x-1 text-gray-400">
                <Shield className="w-4 h-4" aria-hidden="true" />
                <span>Secure Shopping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
