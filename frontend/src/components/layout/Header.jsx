import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search, 
  Mic,
  Settings,
  LogOut,
  Dashboard,
  Package
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import VoiceButton from '../voice/VoiceButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, isAuthenticated, logout } = useAuth();
  const { focusMode, voiceCommands } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`bg-white shadow-md border-b border-gray-200 sticky top-0 z-40 ${
        focusMode ? 'shadow-lg' : ''
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 focus-ring rounded-lg p-1"
              aria-label="Walmart SenseEase Home"
            >
              <div className="w-8 h-8 bg-walmart-blue rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-walmart-blue">SenseEase</span>
                <span className="text-xs text-gray-500 block">by Walmart</span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Hidden in focus mode on mobile */}
          <div className={`flex-1 max-w-lg mx-4 ${focusMode ? 'hidden sm:block' : ''}`}>
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent"
                  aria-label="Search products"
                />
                {voiceCommands && (
                  <VoiceButton 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    size="small"
                    onVoiceResult={(result) => {
                      setSearchQuery(result);
                      if (result.trim()) {
                        navigate(`/products?search=${encodeURIComponent(result.trim())}`);
                      }
                    }}
                  />
                )}
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-4" role="navigation">
            <Link
              to="/products"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus-ring ${
                isActivePage('/products')
                  ? 'bg-walmart-blue text-white'
                  : 'text-gray-700 hover:text-walmart-blue hover:bg-gray-100'
              }`}
            >
              Products
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/preppal"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus-ring ${
                    isActivePage('/preppal')
                      ? 'bg-walmart-blue text-white'
                      : 'text-gray-700 hover:text-walmart-blue hover:bg-gray-100'
                  }`}
                >
                  PrepPal
                </Link>
                
                <Link
                  to="/voice-shopping"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus-ring ${
                    isActivePage('/voice-shopping')
                      ? 'bg-walmart-blue text-white'
                      : 'text-gray-700 hover:text-walmart-blue hover:bg-gray-100'
                  }`}
                >
                  <Mic className="w-4 h-4 inline mr-1" aria-hidden="true" />
                  Voice
                </Link>
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Cart Icon */}
            {isAuthenticated && (
              <Link
                to="/cart"
                className="p-2 text-gray-700 hover:text-walmart-blue transition-colors focus-ring rounded-lg"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-6 h-6" aria-hidden="true" />
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-walmart-blue transition-colors focus-ring rounded-lg"
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <User className="w-6 h-6" aria-hidden="true" />
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.firstName}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus-ring"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Dashboard className="w-4 h-4 mr-2" aria-hidden="true" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus-ring"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" aria-hidden="true" />
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus-ring"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="w-4 h-4 mr-2" aria-hidden="true" />
                      Orders
                    </Link>
                    <Link
                      to="/accessibility-setup"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus-ring"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" aria-hidden="true" />
                      Accessibility
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus-ring text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-walmart-blue transition-colors focus-ring rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-walmart-blue text-white rounded-lg hover:bg-blue-700 transition-colors focus-ring"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-700 hover:text-walmart-blue transition-colors focus-ring rounded-lg"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link
                to="/products"
                className="px-3 py-2 text-base font-medium text-gray-700 hover:text-walmart-blue hover:bg-gray-100 rounded-md focus-ring"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    to="/preppal"
                    className="px-3 py-2 text-base font-medium text-gray-700 hover:text-walmart-blue hover:bg-gray-100 rounded-md focus-ring"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    PrepPal Assistant
                  </Link>
                  
                  <Link
                    to="/voice-shopping"
                    className="px-3 py-2 text-base font-medium text-gray-700 hover:text-walmart-blue hover:bg-gray-100 rounded-md focus-ring"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Mic className="w-4 h-4 inline mr-2" aria-hidden="true" />
                    Voice Shopping
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
