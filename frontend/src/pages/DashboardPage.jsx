import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  TrendingUp,
  Clock,
  Target,
  Heart,
  ShoppingCart,
  Brain,
  Mic,
  Settings,
  Calendar,
  Award,
  Lightbulb,
  ArrowRight,
  ArrowRight,
  BarChart3
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp className={`w-4 h-4 mr-1 ${
            trend.direction === 'up' ? 'text-green-500' : 
            trend.direction === 'down' ? 'text-red-500' : 'text-gray-500'
          }`} />
          <span className={`text-sm ${
            trend.direction === 'up' ? 'text-green-600' : 
            trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend.value}% from last week
          </span>
        </div>
      )}
    </div>
  );

  const InsightCard = ({ insight }) => (
    <div className={`p-4 rounded-lg border-l-4 ${
      insight.type === 'positive' ? 'bg-green-50 border-green-400' :
      insight.type === 'attention' ? 'bg-yellow-50 border-yellow-400' :
      'bg-blue-50 border-blue-400'
    }`}>
      <div className="flex items-start">
        <span className="text-2xl mr-3">{insight.icon}</span>
        <div>
          <p className={`font-medium ${
            insight.type === 'positive' ? 'text-green-800' :
            insight.type === 'attention' ? 'text-yellow-800' :
            'text-blue-800'
          }`}>
            {insight.message}
          </p>
        </div>
      </div>
    </div>
  );

  const RecommendationCard = ({ recommendation }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-2">{recommendation.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{recommendation.description}</p>
      <button className="btn btn-primary text-sm">
        {recommendation.action === 'update_profile' ? 'Update Profile' :
         recommendation.action === 'enable_voice' ? 'Try Voice Shopping' :
         'Learn More'}
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Walmart SenseEase</title>
        <meta name="description" content="Your personalized accessibility dashboard with progress tracking and insights." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600">
              Here's how your accessible shopping experience is improving
            </p>
          </div>

          {analytics?.hasData ? (
            <>
              {/* Overview Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  icon={Target}
                  title="Comfort Level"
                  value={`${analytics.overview.comfortLevel}%`}
                  subtitle="Overall experience rating"
                  trend={analytics.trends.sessionTime}
                  color="green"
                />
                <MetricCard
                  icon={Clock}
                  title="Avg Session Time"
                  value={`${Math.floor(analytics.overview.avgSessionTime / 60)}m`}
                  subtitle={`${analytics.overview.avgSessionTime % 60}s per session`}
                  trend={analytics.trends.sessionTime}
                  color="blue"
                />
                <MetricCard
                  icon={TrendingUp}
                  title="Success Rate"
                  value={`${analytics.overview.successRate}%`}
                  subtitle="Completed shopping tasks"
                  color="purple"
                />
                <MetricCard
                  icon={Brain}
                  title="Adaptations"
                  value={analytics.overview.adaptationFrequency}
                  subtitle="Per session average"
                  trend={analytics.trends.adaptations}
                  color="orange"
                />
              </div>

              {/* Quick Actions - Enhanced with Modern Design */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link
                  to="/products"
                  className="group relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6 border border-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <ShoppingCart className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-blue-600 group-hover:text-blue-700">
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Continue Shopping</h3>
                    <p className="text-sm text-gray-600 mb-3">Browse products with your personalized settings</p>
                    <div className="flex items-center text-xs text-blue-600 font-medium">
                      <span>Explore Products</span>
                      <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/preppal"
                  className="group relative bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl shadow-lg p-6 border border-purple-200 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-purple-600 group-hover:text-purple-700">
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">PrepPal Assistant</h3>
                    <p className="text-sm text-gray-600 mb-3">Create smart shopping lists with AI</p>
                    <div className="flex items-center text-xs text-purple-600 font-medium">
                      <span>AI Shopping Lists</span>
                      <span className="ml-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/voice-shopping"
                  className="group relative bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-lg p-6 border border-green-200 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Mic className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-green-600 group-hover:text-green-700">
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Voice Shopping</h3>
                    <p className="text-sm text-gray-600 mb-3">Shop hands-free with voice commands</p>
                    <div className="flex items-center text-xs text-green-600 font-medium">
                      <span>Try Voice Commands</span>
                      <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Progress Chart */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Weekly Progress</h2>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {analytics.weeklyProgress.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 w-20">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-walmart-blue h-2 rounded-full"
                            style={{ width: `${Math.min((day.sessions / 5) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 w-16 text-right">
                        {day.sessions} sessions
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights and Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Insights */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                    Insights
                  </h2>
                  <div className="space-y-4">
                    {analytics.insights.map((insight, index) => (
                      <InsightCard key={index} insight={insight} />
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-purple-500" />
                    Recommendations
                  </h2>
                  <div className="space-y-4">
                    {analytics.recommendations.map((recommendation, index) => (
                      <RecommendationCard key={index} recommendation={recommendation} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Adaptations */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Used Adaptations</h2>
                <div className="space-y-3">
                  {analytics.topAdaptations.map((adaptation, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize">
                        {adaptation.type.replace('_', ' ')}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-200 rounded-full h-2 w-32">
                          <div
                            className="bg-walmart-blue h-2 rounded-full"
                            style={{ 
                              width: `${(adaptation.count / analytics.topAdaptations[0].count) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8 text-right">
                          {adaptation.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* No Data State - Enhanced */
            <div className="text-center py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Welcome to SenseEase! 🎉
              </h2>
              <p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg">
                {analytics?.message || "Start your personalized shopping journey and discover products tailored just for you."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <Link
                  to="/accessibility-setup"
                  className="group relative bg-gradient-to-br from-orange-50 to-red-100 rounded-xl shadow-lg p-8 border border-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Settings className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3 text-xl">Setup Profile</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Customize your accessibility preferences and shopping experience
                    </p>
                    <div className="flex items-center justify-center text-orange-600 font-medium">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>

                <Link
                  to="/products"
                  className="group relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-8 border border-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <ShoppingCart className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3 text-xl">Start Shopping</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Browse thousands of products with our adaptive interface
                    </p>
                    <div className="flex items-center justify-center text-blue-600 font-medium">
                      <span>Browse Products</span>
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>

                <Link
                  to="/preppal"
                  className="group relative bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl shadow-lg p-8 border border-purple-200 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3 text-xl">Try PrepPal</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Create smart shopping lists with AI assistance
                    </p>
                    <div className="flex items-center justify-center text-purple-600 font-medium">
                      <span>Try AI Assistant</span>
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
