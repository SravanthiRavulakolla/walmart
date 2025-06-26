import { useEffect, useCallback } from 'react';
import { useAdaptiveShopping } from '../contexts/AdaptiveShoppingContext';

export const useAdaptiveBehavior = () => {
  const { isEnabled, trackInteraction } = useAdaptiveShopping();

  // Track mouse movements for stress detection
  const trackMouseMovement = useCallback((e) => {
    if (!isEnabled) return;
    
    const speed = Math.sqrt(e.movementX ** 2 + e.movementY ** 2);
    trackInteraction('mouse_move', {
      x: e.clientX,
      y: e.clientY,
      speed,
      timestamp: Date.now()
    });
  }, [isEnabled, trackInteraction]);

  // Track clicks for rapid clicking detection
  const trackClick = useCallback((e) => {
    if (!isEnabled) return;
    
    trackInteraction('click', {
      target: e.target.tagName,
      className: e.target.className,
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    });
  }, [isEnabled, trackInteraction]);

  // Track scrolling patterns
  const trackScroll = useCallback(() => {
    if (!isEnabled) return;
    
    trackInteraction('scroll', {
      scrollY: window.scrollY,
      scrollX: window.scrollX,
      direction: window.scrollY > (window.lastScrollY || 0) ? 'down' : 'up',
      timestamp: Date.now()
    });
    
    window.lastScrollY = window.scrollY;
  }, [isEnabled, trackInteraction]);

  // Track keyboard interactions
  const trackKeyPress = useCallback((e) => {
    if (!isEnabled) return;
    
    trackInteraction('keypress', {
      key: e.key,
      ctrlKey: e.ctrlKey,
      altKey: e.altKey,
      shiftKey: e.shiftKey,
      timestamp: Date.now()
    });
  }, [isEnabled, trackInteraction]);

  // Track form errors
  const trackFormError = useCallback((e) => {
    if (!isEnabled) return;
    
    if (e.target.validity && !e.target.validity.valid) {
      trackInteraction('form_error', {
        field: e.target.name,
        error: e.target.validationMessage,
        value: e.target.value,
        timestamp: Date.now()
      });
    }
  }, [isEnabled, trackInteraction]);

  // Track page navigation
  const trackNavigation = useCallback((page) => {
    if (!isEnabled) return;
    
    trackInteraction('navigation', {
      page,
      timestamp: Date.now()
    });
  }, [isEnabled, trackInteraction]);

  // Track focus events (attention patterns)
  const trackFocus = useCallback((e) => {
    if (!isEnabled) return;
    
    trackInteraction('focus', {
      target: e.target.tagName,
      type: e.type, // focus or blur
      timestamp: Date.now()
    });
  }, [isEnabled, trackInteraction]);

  // Track window visibility changes (tab switching)
  const trackVisibilityChange = useCallback(() => {
    if (!isEnabled) return;
    
    trackInteraction('visibility_change', {
      hidden: document.hidden,
      timestamp: Date.now()
    });
  }, [isEnabled, trackInteraction]);

  // Set up event listeners
  useEffect(() => {
    if (!isEnabled) return;

    // Throttle mouse movement tracking to avoid performance issues
    let mouseTimeout;
    const throttledMouseMove = (e) => {
      if (mouseTimeout) return;
      mouseTimeout = setTimeout(() => {
        trackMouseMovement(e);
        mouseTimeout = null;
      }, 100); // Track every 100ms
    };

    // Throttle scroll tracking
    let scrollTimeout;
    const throttledScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        trackScroll();
        scrollTimeout = null;
      }, 200); // Track every 200ms
    };

    // Add event listeners
    document.addEventListener('mousemove', throttledMouseMove);
    document.addEventListener('click', trackClick);
    document.addEventListener('scroll', throttledScroll);
    document.addEventListener('keydown', trackKeyPress);
    document.addEventListener('invalid', trackFormError, true);
    document.addEventListener('focus', trackFocus, true);
    document.addEventListener('blur', trackFocus, true);
    document.addEventListener('visibilitychange', trackVisibilityChange);

    // Track navigation changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      trackNavigation(args[2] || window.location.pathname);
      return originalPushState.apply(this, args);
    };

    history.replaceState = function(...args) {
      trackNavigation(args[2] || window.location.pathname);
      return originalReplaceState.apply(this, args);
    };

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('click', trackClick);
      document.removeEventListener('scroll', throttledScroll);
      document.removeEventListener('keydown', trackKeyPress);
      document.removeEventListener('invalid', trackFormError, true);
      document.removeEventListener('focus', trackFocus, true);
      document.removeEventListener('blur', trackFocus, true);
      document.removeEventListener('visibilitychange', trackVisibilityChange);

      // Restore original history methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;

      // Clear timeouts
      if (mouseTimeout) clearTimeout(mouseTimeout);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [
    isEnabled,
    trackMouseMovement,
    trackClick,
    trackScroll,
    trackKeyPress,
    trackFormError,
    trackFocus,
    trackVisibilityChange,
    trackNavigation
  ]);

  return {
    trackInteraction,
    trackNavigation,
    trackClick,
    trackScroll,
    trackKeyPress,
    trackFormError
  };
};

export default useAdaptiveBehavior;
