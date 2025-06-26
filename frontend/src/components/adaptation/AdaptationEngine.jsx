import React, { useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useBehaviorTracking } from '../../contexts/BehaviorTrackingContext';

const AdaptationEngine = ({ children }) => {
  const accessibility = useAccessibility();
  const behaviorTracking = useBehaviorTracking();

  // Adaptation thresholds
  const ADAPTATION_THRESHOLDS = {
    RAPID_CLICKS: 4, // clicks within 2 seconds
    HIGH_SCROLL_VELOCITY: 1000, // pixels per second
    EXCESSIVE_MOUSE_MOVEMENT: 500, // pixels moved without purpose
    DWELL_TIME_THRESHOLD: 3000, // milliseconds of hovering
    FRUSTRATION_THRESHOLD: 3, // frustration level
  };

  // Track adaptation triggers
  const triggerAdaptation = useCallback((type, reason, severity = 'medium') => {
    behaviorTracking.recordAdaptation(type, reason);
    
    switch (type) {
      case 'focus_mode':
        if (!accessibility.focusMode) {
          accessibility.toggleFocusMode();
          showAdaptationNotification('Focus mode enabled', 'Reduced visual clutter to help you concentrate', severity);
        }
        break;
        
      case 'font_size_increase':
        if (accessibility.fontSize === 'medium') {
          accessibility.setFontSize('large');
          showAdaptationNotification('Font size increased', 'Made text larger for better readability', severity);
        } else if (accessibility.fontSize === 'large') {
          accessibility.setFontSize('extra-large');
          showAdaptationNotification('Font size increased further', 'Made text even larger for better readability', severity);
        }
        break;
        
      case 'high_contrast':
        if (accessibility.theme === 'default') {
          accessibility.setTheme('high-contrast');
          showAdaptationNotification('High contrast enabled', 'Improved visual contrast for better visibility', severity);
        }
        break;
        
      case 'reduced_motion':
        if (!accessibility.reducedMotion) {
          accessibility.toggleReducedMotion();
          showAdaptationNotification('Reduced motion enabled', 'Minimized animations to reduce distraction', severity);
        }
        break;
        
      case 'simplified_layout':
        // This would trigger layout simplification in components
        document.body.classList.add('simplified-layout');
        showAdaptationNotification('Layout simplified', 'Reduced page complexity for easier navigation', severity);
        break;
        
      default:
        console.log(`Unknown adaptation type: ${type}`);
    }
  }, [accessibility, behaviorTracking]);

  // Show user-friendly adaptation notifications
  const showAdaptationNotification = (title, message, severity) => {
    const toastOptions = {
      duration: 4000,
      icon: '🎯',
      style: {
        background: severity === 'high' ? '#FEF3C7' : '#EBF8FF',
        color: severity === 'high' ? '#92400E' : '#1E40AF',
        border: `1px solid ${severity === 'high' ? '#F59E0B' : '#3B82F6'}`,
      },
    };

    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {title}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ), toastOptions);
  };

  // Analyze mouse movement patterns
  const analyzeMousePatterns = useCallback((mouseEvents) => {
    if (mouseEvents.length < 10) return;

    const recentEvents = mouseEvents.slice(-10);
    let totalDistance = 0;
    let rapidMovements = 0;
    let backtrackingCount = 0;

    for (let i = 1; i < recentEvents.length; i++) {
      const prev = recentEvents[i - 1];
      const curr = recentEvents[i];
      
      const distance = Math.sqrt(
        Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
      );
      
      totalDistance += distance;
      
      // Detect rapid movements
      const timeDiff = curr.timestamp - prev.timestamp;
      if (timeDiff > 0 && distance / timeDiff > 2) {
        rapidMovements++;
      }
      
      // Detect backtracking (going back and forth)
      if (i >= 2) {
        const prevPrev = recentEvents[i - 2];
        const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
        const angle2 = Math.atan2(prev.y - prevPrev.y, prev.x - prevPrev.x);
        const angleDiff = Math.abs(angle1 - angle2);
        
        if (angleDiff > Math.PI * 0.8) { // Nearly opposite directions
          backtrackingCount++;
        }
      }
    }

    // Trigger adaptations based on patterns
    if (totalDistance > ADAPTATION_THRESHOLDS.EXCESSIVE_MOUSE_MOVEMENT) {
      triggerAdaptation('focus_mode', 'Excessive mouse movement detected', 'medium');
    }
    
    if (rapidMovements > 5) {
      triggerAdaptation('simplified_layout', 'Rapid mouse movements suggest confusion', 'medium');
    }
    
    if (backtrackingCount > 3) {
      triggerAdaptation('font_size_increase', 'Mouse backtracking suggests difficulty reading', 'low');
    }
  }, [triggerAdaptation]);

  // Analyze scroll patterns
  const analyzeScrollPatterns = useCallback((scrollEvents) => {
    if (scrollEvents.length < 5) return;

    const recentScrolls = scrollEvents.slice(-5);
    let rapidScrolls = 0;
    let erraticScrolling = 0;

    for (let i = 1; i < recentScrolls.length; i++) {
      const prev = recentScrolls[i - 1];
      const curr = recentScrolls[i];
      
      const timeDiff = curr.timestamp - prev.timestamp;
      const scrollDiff = Math.abs(curr.scrollY - prev.scrollY);
      
      if (timeDiff > 0) {
        const velocity = scrollDiff / timeDiff;
        
        if (velocity > ADAPTATION_THRESHOLDS.HIGH_SCROLL_VELOCITY) {
          rapidScrolls++;
        }
        
        // Detect erratic scrolling (rapid direction changes)
        if (i >= 2) {
          const prevPrev = recentScrolls[i - 2];
          const direction1 = curr.scrollY - prev.scrollY;
          const direction2 = prev.scrollY - prevPrev.scrollY;
          
          if (direction1 * direction2 < 0 && Math.abs(direction1) > 50) {
            erraticScrolling++;
          }
        }
      }
    }

    // Trigger adaptations
    if (rapidScrolls > 2) {
      triggerAdaptation('focus_mode', 'Rapid scrolling suggests difficulty finding content', 'medium');
    }
    
    if (erraticScrolling > 2) {
      triggerAdaptation('simplified_layout', 'Erratic scrolling suggests confusion', 'high');
    }
  }, [triggerAdaptation]);

  // Analyze click patterns
  const analyzeClickPatterns = useCallback((clickEvents) => {
    if (clickEvents.length < 3) return;

    const now = Date.now();
    const recentClicks = clickEvents.filter(click => 
      now - click.timestamp < 5000 // Last 5 seconds
    );

    // Detect rapid clicking
    const rapidClicks = recentClicks.filter(click => 
      now - click.timestamp < 2000 // Last 2 seconds
    );

    if (rapidClicks.length >= ADAPTATION_THRESHOLDS.RAPID_CLICKS) {
      triggerAdaptation('focus_mode', 'Rapid clicking suggests frustration', 'high');
      triggerAdaptation('font_size_increase', 'Multiple clicks may indicate difficulty seeing targets', 'medium');
    }

    // Detect clicking on same area repeatedly
    const sameAreaClicks = recentClicks.filter(click => {
      const lastClick = recentClicks[recentClicks.length - 1];
      const distance = Math.sqrt(
        Math.pow(click.x - lastClick.x, 2) + Math.pow(click.y - lastClick.y, 2)
      );
      return distance < 50; // Within 50 pixels
    });

    if (sameAreaClicks.length > 3) {
      triggerAdaptation('high_contrast', 'Repeated clicks in same area suggest visibility issues', 'medium');
    }
  }, [triggerAdaptation]);

  // Main analysis function
  const analyzeBehavior = useCallback(() => {
    const { mouseEvents, scrollEvents, clickEvents, frustrationLevel } = behaviorTracking;

    // Analyze different behavior patterns
    analyzeMousePatterns(mouseEvents);
    analyzeScrollPatterns(scrollEvents);
    analyzeClickPatterns(clickEvents);

    // Check overall frustration level
    if (frustrationLevel >= ADAPTATION_THRESHOLDS.FRUSTRATION_THRESHOLD) {
      triggerAdaptation('focus_mode', 'High frustration level detected', 'high');
      triggerAdaptation('reduced_motion', 'Reducing motion to calm experience', 'medium');
    }
  }, [behaviorTracking, analyzeMousePatterns, analyzeScrollPatterns, analyzeClickPatterns, triggerAdaptation]);

  // Run analysis periodically
  useEffect(() => {
    if (!behaviorTracking.isTracking) return;

    const analysisInterval = setInterval(() => {
      analyzeBehavior();
    }, 3000); // Analyze every 3 seconds

    return () => clearInterval(analysisInterval);
  }, [behaviorTracking.isTracking, analyzeBehavior]);

  // Monitor for specific UI events that might indicate confusion
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs - might indicate confusion
        triggerAdaptation('simplified_layout', 'Tab switching suggests difficulty finding content', 'low');
      }
    };

    const handleResize = () => {
      // Window resize might indicate accessibility needs
      if (window.innerWidth < 768) {
        triggerAdaptation('font_size_increase', 'Small screen detected', 'low');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
    };
  }, [triggerAdaptation]);

  // The adaptation engine runs in the background
  return <>{children}</>;
};

export default AdaptationEngine;
