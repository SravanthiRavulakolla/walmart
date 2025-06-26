const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user analytics dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Calculate analytics from behavior data
    const recentSessions = user.behaviorAnalytics.slice(-30); // Last 30 sessions
    
    if (recentSessions.length === 0) {
      return res.json({
        success: true,
        data: {
          message: 'No analytics data available yet. Start shopping to see your progress!',
          hasData: false
        }
      });
    }
    
    // Calculate metrics
    const totalSessions = recentSessions.length;
    const avgSessionTime = recentSessions.reduce((sum, session) => 
      sum + session.sessionDuration, 0) / totalSessions;
    
    const totalAdaptations = recentSessions.reduce((sum, session) => 
      sum + session.adaptationsTriggered.length, 0);
    
    const avgFrustrationLevel = recentSessions.reduce((sum, session) => 
      sum + session.frustrationIndicators, 0) / totalSessions;
    
    const successfulSessions = recentSessions.filter(session => 
      session.completedActions.length > 0).length;
    
    // Calculate trends (compare last 15 vs previous 15 sessions)
    const recent15 = recentSessions.slice(-15);
    const previous15 = recentSessions.slice(-30, -15);
    
    const recentAvgTime = recent15.length > 0 ? 
      recent15.reduce((sum, s) => sum + s.sessionDuration, 0) / recent15.length : 0;
    const previousAvgTime = previous15.length > 0 ? 
      previous15.reduce((sum, s) => sum + s.sessionDuration, 0) / previous15.length : 0;
    
    const timeTrend = previousAvgTime > 0 ? 
      ((recentAvgTime - previousAvgTime) / previousAvgTime * 100) : 0;
    
    // Adaptation frequency trend
    const recentAdaptations = recent15.reduce((sum, s) => sum + s.adaptationsTriggered.length, 0);
    const previousAdaptations = previous15.reduce((sum, s) => sum + s.adaptationsTriggered.length, 0);
    
    const adaptationTrend = previousAdaptations > 0 ? 
      ((recentAdaptations - previousAdaptations) / previousAdaptations * 100) : 0;
    
    // Most common adaptations
    const allAdaptations = recentSessions.flatMap(session => 
      session.adaptationsTriggered.map(a => a.type));
    const adaptationCounts = allAdaptations.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    const topAdaptations = Object.entries(adaptationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));
    
    // Weekly progress data for charts
    const weeklyData = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const daySessions = recentSessions.filter(session => 
        session.date >= dayStart && session.date <= dayEnd);
      
      weeklyData.push({
        date: dayStart.toISOString().split('T')[0],
        sessions: daySessions.length,
        avgTime: daySessions.length > 0 ? 
          daySessions.reduce((sum, s) => sum + s.sessionDuration, 0) / daySessions.length : 0,
        adaptations: daySessions.reduce((sum, s) => sum + s.adaptationsTriggered.length, 0),
        frustration: daySessions.length > 0 ? 
          daySessions.reduce((sum, s) => sum + s.frustrationIndicators, 0) / daySessions.length : 0
      });
    }
    
    const dashboardData = {
      hasData: true,
      overview: {
        totalSessions,
        avgSessionTime: Math.round(avgSessionTime),
        successRate: Math.round((successfulSessions / totalSessions) * 100),
        adaptationFrequency: Math.round(totalAdaptations / totalSessions * 10) / 10,
        comfortLevel: Math.max(0, Math.min(100, 100 - (avgFrustrationLevel * 20)))
      },
      trends: {
        sessionTime: {
          value: Math.round(timeTrend),
          direction: timeTrend > 0 ? 'up' : timeTrend < 0 ? 'down' : 'stable'
        },
        adaptations: {
          value: Math.round(Math.abs(adaptationTrend)),
          direction: adaptationTrend < 0 ? 'down' : adaptationTrend > 0 ? 'up' : 'stable'
        }
      },
      topAdaptations,
      weeklyProgress: weeklyData,
      insights: generateInsights(user.comfortMetrics, recentSessions),
      recommendations: generateRecommendations(user.neurodiverseProfile, topAdaptations)
    };
    
    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

// Helper function to generate insights
const generateInsights = (comfortMetrics, recentSessions) => {
  const insights = [];
  
  if (recentSessions.length >= 5) {
    const avgFrustration = recentSessions.reduce((sum, s) => 
      sum + s.frustrationIndicators, 0) / recentSessions.length;
    
    if (avgFrustration < 2) {
      insights.push({
        type: 'positive',
        message: 'Great job! Your frustration levels have been consistently low.',
        icon: '🎉'
      });
    } else if (avgFrustration > 4) {
      insights.push({
        type: 'attention',
        message: 'Consider adjusting your accessibility settings to reduce stress.',
        icon: '⚠️'
      });
    }
    
    const recentAdaptations = recentSessions.slice(-5).reduce((sum, s) => 
      sum + s.adaptationsTriggered.length, 0);
    
    if (recentAdaptations === 0) {
      insights.push({
        type: 'positive',
        message: 'Your interface is well-adapted to your needs!',
        icon: '✨'
      });
    }
  }
  
  return insights;
};

// Helper function to generate recommendations
const generateRecommendations = (profile, topAdaptations) => {
  const recommendations = [];
  
  if (topAdaptations.some(a => a.type === 'focus_mode')) {
    recommendations.push({
      title: 'Enable Focus Mode by Default',
      description: 'You frequently use focus mode. Consider enabling it by default in your profile.',
      action: 'update_profile'
    });
  }
  
  if (topAdaptations.some(a => a.type === 'font_size_increase')) {
    recommendations.push({
      title: 'Increase Default Font Size',
      description: 'You often need larger fonts. Update your default font size setting.',
      action: 'update_profile'
    });
  }
  
  if (!profile.voiceCommands) {
    recommendations.push({
      title: 'Try Voice Commands',
      description: 'Voice shopping can reduce navigation stress. Give it a try!',
      action: 'enable_voice'
    });
  }
  
  return recommendations;
};

// @desc    Export analytics data
// @route   GET /api/analytics/export
// @access  Private
router.get('/export', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const exportData = {
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        joinDate: user.createdAt
      },
      neurodiverseProfile: user.neurodiverseProfile,
      comfortMetrics: user.comfortMetrics,
      behaviorAnalytics: user.behaviorAnalytics,
      exportDate: new Date()
    };
    
    res.json({
      success: true,
      data: exportData
    });

  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting analytics'
    });
  }
});

module.exports = router;
