import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAccessibility } from '../../contexts/AccessibilityContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { focusMode } = useAccessibility();
  
  // Pages that should have minimal layout (like auth pages)
  const minimalLayoutPages = ['/login', '/register'];
  const isMinimalLayout = minimalLayoutPages.includes(location.pathname);
  
  // Pages that should hide footer in focus mode
  const hideFooterInFocusMode = ['/checkout', '/voice-shopping', '/preppal'];
  const shouldHideFooter = focusMode && hideFooterInFocusMode.includes(location.pathname);

  if (isMinimalLayout) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-walmart-blue text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main 
        id="main-content" 
        className="flex-1 focus:outline-none"
        tabIndex="-1"
        role="main"
        aria-label="Main content"
      >
        {children}
      </main>
      
      {/* Footer - Hidden in focus mode for certain pages */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
