const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Update neurodiverse profile
// @route   PUT /api/users/neurodiverse-profile
// @access  Private
router.put('/neurodiverse-profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Update neurodiverse profile with provided data
    user.neurodiverseProfile = {
      ...user.neurodiverseProfile,
      ...req.body
    };
    
    await user.save();

    res.json({
      success: true,
      message: 'Neurodiverse profile updated successfully',
      profile: user.neurodiverseProfile
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
});

// @desc    Get neurodiverse profile
// @route   GET /api/users/neurodiverse-profile
// @access  Private
router.get('/neurodiverse-profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      profile: user.neurodiverseProfile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Track behavior analytics
// @route   POST /api/users/behavior-analytics
// @access  Private
router.post('/behavior-analytics', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const analyticsData = {
      sessionId: req.body.sessionId,
      mousePatterns: req.body.mousePatterns || [],
      scrollVelocity: req.body.scrollVelocity || [],
      clickFrequency: req.body.clickFrequency || 0,
      dwellTime: req.body.dwellTime || 0,
      adaptationsTriggered: req.body.adaptationsTriggered || [],
      sessionDuration: req.body.sessionDuration || 0,
      completedActions: req.body.completedActions || [],
      frustrationIndicators: req.body.frustrationIndicators || 0
    };
    
    user.behaviorAnalytics.push(analyticsData);
    
    // Keep only last 50 sessions to prevent document from growing too large
    if (user.behaviorAnalytics.length > 50) {
      user.behaviorAnalytics = user.behaviorAnalytics.slice(-50);
    }
    
    await user.save();

    res.json({
      success: true,
      message: 'Behavior analytics recorded successfully'
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during analytics tracking'
    });
  }
});

// @desc    Get comfort metrics
// @route   GET /api/users/comfort-metrics
// @access  Private
router.get('/comfort-metrics', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Calculate updated metrics from recent behavior analytics
    const recentAnalytics = user.behaviorAnalytics.slice(-10); // Last 10 sessions
    
    if (recentAnalytics.length > 0) {
      const avgSessionTime = recentAnalytics.reduce((sum, session) => 
        sum + session.sessionDuration, 0) / recentAnalytics.length;
      
      const totalAdaptations = recentAnalytics.reduce((sum, session) => 
        sum + session.adaptationsTriggered.length, 0);
      
      const avgFrustration = recentAnalytics.reduce((sum, session) => 
        sum + session.frustrationIndicators, 0) / recentAnalytics.length;
      
      // Update comfort metrics
      user.comfortMetrics = {
        successfulSessions: user.comfortMetrics.successfulSessions + 
          recentAnalytics.filter(s => s.completedActions.length > 0).length,
        averageSessionTime: Math.round(avgSessionTime),
        adaptationFrequency: Math.round(totalAdaptations / recentAnalytics.length),
        stressTriggers: Math.round(avgFrustration),
        lastUpdated: new Date()
      };
      
      await user.save();
    }
    
    res.json({
      success: true,
      metrics: user.comfortMetrics,
      recentTrends: {
        sessionsAnalyzed: recentAnalytics.length,
        improvementTrend: user.comfortMetrics.stressTriggers < 3 ? 'positive' : 'needs_attention'
      }
    });

  } catch (error) {
    console.error('Get metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update comfort metrics manually
// @route   PUT /api/users/comfort-metrics
// @access  Private
router.put('/comfort-metrics', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.comfortMetrics = {
      ...user.comfortMetrics,
      ...req.body,
      lastUpdated: new Date()
    };
    
    await user.save();

    res.json({
      success: true,
      message: 'Comfort metrics updated successfully',
      metrics: user.comfortMetrics
    });

  } catch (error) {
    console.error('Metrics update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during metrics update'
    });
  }
});

module.exports = router;
