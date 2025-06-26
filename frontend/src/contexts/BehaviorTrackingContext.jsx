import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useAccessibility } from './AccessibilityContext';

const BehaviorTrackingContext = createContext();

// Behavior tracking reducer
const behaviorReducer = (state, action) => {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        sessionId: action.payload.sessionId,
        sessionStartTime: action.payload.startTime,
        isTracking: true,
      };
    case 'END_SESSION':
      return {
        ...state,
        isTracking: false,
        sessionEndTime: action.payload.endTime,
      };
    case 'ADD_MOUSE_EVENT':
      return {
        ...state,
        mouseEvents: [...state.mouseEvents.slice(-100), action.payload], // Keep last 100 events
      };
    case 'ADD_SCROLL_EVENT':
      return {
        ...state,
        scrollEvents: [...state.scrollEvents.slice(-50), action.payload], // Keep last 50 events
      };
    case 'ADD_CLICK_EVENT':
      return {
        ...state,
        clickEvents: [...state.clickEvents.slice(-50), action.payload],
        clickCount: state.clickCount + 1,
      };
    case 'ADD_ADAPTATION':
      return {
        ...state,
        adaptations: [...state.adaptations, action.payload],
      };
    case 'SET_FRUSTRATION_LEVEL':
      return {
        ...state,
        frustrationLevel: action.payload,
      };
    case 'RESET_SESSION':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  sessionId: null,
  sessionStartTime: null,
  sessionEndTime: null,
  isTracking: false,
  mouseEvents: [],
  scrollEvents: [],
  clickEvents: [],
  clickCount: 0,
  adaptations: [],
  frustrationLevel: 0,
  dwellTime: 0,
};

export const BehaviorTrackingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(behaviorReducer, initialState);
  const { isAuthenticated, user } = useAuth();
  const accessibility = useAccessibility();

  // Generate session ID
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Start tracking session
  const startSession = useCallback(() => {
    if (isAuthenticated && !state.isTracking) {
      const sessionId = generateSessionId();
      const startTime = new Date();
      
      dispatch({
        type: 'START_SESSION',
        payload: { sessionId, startTime },
      });
    }
  }, [isAuthenticated, state.isTracking]);

  // End tracking session
  const endSession = useCallback(async () => {
    if (state.isTracking && state.sessionId) {
      const endTime = new Date();
      const sessionDuration = endTime - state.sessionStartTime;
      
      dispatch({
        type: 'END_SESSION',
        payload: { endTime },
      });

      // Send analytics data to backend
      if (isAuthenticated) {
        try {
          await sendAnalyticsData({
            sessionId: state.sessionId,
            sessionDuration,
            mousePatterns: state.mouseEvents,
            scrollVelocity: calculateScrollVelocity(state.scrollEvents),
            clickFrequency: state.clickCount / (sessionDuration / 1000 / 60), // clicks per minute
            dwellTime: calculateDwellTime(state.mouseEvents),
            adaptationsTriggered: state.adaptations,
            frustrationIndicators: state.frustrationLevel,
            completedActions: getCompletedActions(),
          });
        } catch (error) {
          console.error('Failed to send analytics data:', error);
        }
      }

      // Reset session after sending data
      setTimeout(() => {
        dispatch({ type: 'RESET_SESSION' });
      }, 1000);
    }
  }, [state, isAuthenticated]);

  // Track mouse movements
  const trackMouseEvent = useCallback((event) => {
    if (state.isTracking) {
      const mouseEvent = {
        x: event.clientX,
        y: event.clientY,
        timestamp: new Date(),
        action: event.type,
      };
      
      dispatch({
        type: 'ADD_MOUSE_EVENT',
        payload: mouseEvent,
      });
    }
  }, [state.isTracking]);

  // Track scroll events
  const trackScrollEvent = useCallback((event) => {
    if (state.isTracking) {
      const scrollEvent = {
        scrollY: window.scrollY,
        scrollX: window.scrollX,
        timestamp: new Date(),
        velocity: calculateInstantScrollVelocity(event),
      };
      
      dispatch({
        type: 'ADD_SCROLL_EVENT',
        payload: scrollEvent,
      });
    }
  }, [state.isTracking]);

  // Track click events
  const trackClickEvent = useCallback((event) => {
    if (state.isTracking) {
      const clickEvent = {
        x: event.clientX,
        y: event.clientY,
        timestamp: new Date(),
        target: event.target.tagName,
        targetId: event.target.id,
        targetClass: event.target.className,
      };
      
      dispatch({
        type: 'ADD_CLICK_EVENT',
        payload: clickEvent,
      });

      // Detect rapid clicking (potential frustration)
      detectRapidClicking();
    }
  }, [state.isTracking]);

  // Record UI adaptation
  const recordAdaptation = useCallback((adaptationType, reason) => {
    if (state.isTracking) {
      const adaptation = {
        type: adaptationType,
        reason,
        timestamp: new Date(),
      };
      
      dispatch({
        type: 'ADD_ADAPTATION',
        payload: adaptation,
      });
    }
  }, [state.isTracking]);

  // Detect rapid clicking (frustration indicator)
  const detectRapidClicking = useCallback(() => {
    const recentClicks = state.clickEvents.slice(-5); // Last 5 clicks
    const now = new Date();
    const rapidClicks = recentClicks.filter(click => 
      now - click.timestamp < 2000 // Within 2 seconds
    );
    
    if (rapidClicks.length >= 4) {
      dispatch({
        type: 'SET_FRUSTRATION_LEVEL',
        payload: Math.min(state.frustrationLevel + 1, 10),
      });
      
      // Trigger UI adaptation for frustration
      triggerFrustrationAdaptation();
    }
  }, [state.clickEvents, state.frustrationLevel]);

  // Trigger adaptation based on frustration
  const triggerFrustrationAdaptation = useCallback(() => {
    if (state.frustrationLevel >= 3 && !accessibility.focusMode) {
      accessibility.toggleFocusMode();
      recordAdaptation('focus_mode', 'High frustration detected');
    }
  }, [state.frustrationLevel, accessibility]);

  // Calculate scroll velocity
  const calculateScrollVelocity = (scrollEvents) => {
    if (scrollEvents.length < 2) return [];
    
    return scrollEvents.slice(1).map((event, index) => {
      const prevEvent = scrollEvents[index];
      const timeDiff = event.timestamp - prevEvent.timestamp;
      const scrollDiff = Math.abs(event.scrollY - prevEvent.scrollY);
      return timeDiff > 0 ? scrollDiff / timeDiff : 0;
    });
  };

  // Calculate instant scroll velocity
  const calculateInstantScrollVelocity = (event) => {
    const lastScroll = state.scrollEvents[state.scrollEvents.length - 1];
    if (!lastScroll) return 0;
    
    const timeDiff = Date.now() - lastScroll.timestamp;
    const scrollDiff = Math.abs(window.scrollY - lastScroll.scrollY);
    return timeDiff > 0 ? scrollDiff / timeDiff : 0;
  };

  // Calculate dwell time
  const calculateDwellTime = (mouseEvents) => {
    if (mouseEvents.length < 2) return 0;
    
    let totalDwellTime = 0;
    let dwellStart = null;
    
    mouseEvents.forEach((event, index) => {
      if (event.action === 'mousemove') {
        if (index > 0) {
          const prevEvent = mouseEvents[index - 1];
          const distance = Math.sqrt(
            Math.pow(event.x - prevEvent.x, 2) + Math.pow(event.y - prevEvent.y, 2)
          );
          
          if (distance < 10) { // Mouse barely moved
            if (!dwellStart) dwellStart = prevEvent.timestamp;
          } else {
            if (dwellStart) {
              totalDwellTime += event.timestamp - dwellStart;
              dwellStart = null;
            }
          }
        }
      }
    });
    
    return totalDwellTime;
  };

  // Get completed actions (mock implementation)
  const getCompletedActions = () => {
    const actions = [];
    
    // Check for common completed actions based on URL or other indicators
    if (window.location.pathname.includes('/cart')) {
      actions.push('viewed_cart');
    }
    if (window.location.pathname.includes('/product')) {
      actions.push('viewed_product');
    }
    if (state.clickEvents.some(click => click.targetId?.includes('add-to-cart'))) {
      actions.push('added_to_cart');
    }
    
    return actions;
  };

  // Send analytics data to backend
  const sendAnalyticsData = async (analyticsData) => {
    try {
      const response = await fetch('/api/users/behavior-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(analyticsData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send analytics data');
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  // Set up event listeners
  useEffect(() => {
    if (state.isTracking) {
      document.addEventListener('mousemove', trackMouseEvent);
      document.addEventListener('click', trackClickEvent);
      window.addEventListener('scroll', trackScrollEvent);
      
      return () => {
        document.removeEventListener('mousemove', trackMouseEvent);
        document.removeEventListener('click', trackClickEvent);
        window.removeEventListener('scroll', trackScrollEvent);
      };
    }
  }, [state.isTracking, trackMouseEvent, trackClickEvent, trackScrollEvent]);

  // Start session when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      startSession();
    } else {
      endSession();
    }
  }, [isAuthenticated, user, startSession, endSession]);

  // End session on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      endSession();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [endSession]);

  const value = {
    ...state,
    startSession,
    endSession,
    recordAdaptation,
    trackMouseEvent,
    trackScrollEvent,
    trackClickEvent,
  };

  return (
    <BehaviorTrackingContext.Provider value={value}>
      {children}
    </BehaviorTrackingContext.Provider>
  );
};

// Custom hook to use behavior tracking context
export const useBehaviorTracking = () => {
  const context = useContext(BehaviorTrackingContext);
  if (!context) {
    throw new Error('useBehaviorTracking must be used within a BehaviorTrackingProvider');
  }
  return context;
};

export default BehaviorTrackingContext;
