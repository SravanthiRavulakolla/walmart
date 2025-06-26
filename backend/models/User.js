const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const neurodiverseProfileSchema = new mongoose.Schema({
  // Cognitive preferences
  focusMode: { type: Boolean, default: false },
  reducedMotion: { type: Boolean, default: false },
  simplifiedLayout: { type: Boolean, default: false },
  extendedTimeouts: { type: Boolean, default: false },
  
  // Visual preferences
  colorScheme: {
    type: String,
    enum: ['default', 'high-contrast', 'low-stimulation', 'grayscale'],
    default: 'default'
  },
  fontSize: {
    type: String,
    enum: ['small', 'medium', 'large', 'extra-large'],
    default: 'medium'
  },
  fontFamily: {
    type: String,
    enum: ['inter', 'dyslexic'],
    default: 'inter'
  },
  
  // Interaction preferences
  keyboardNavigation: { type: Boolean, default: false },
  screenReader: { type: Boolean, default: false },
  voiceCommands: { type: Boolean, default: false },
  textToSpeech: { type: Boolean, default: false },
  
  // Sensory preferences
  soundEnabled: { type: Boolean, default: true },
  vibrationsEnabled: { type: Boolean, default: true },
  animationsEnabled: { type: Boolean, default: true },
  
  // Shopping preferences
  gridView: { type: Boolean, default: true },
  showPrices: { type: Boolean, default: true },
  showReviews: { type: Boolean, default: true },
  autoSave: { type: Boolean, default: true }
});

const behaviorAnalyticsSchema = new mongoose.Schema({
  sessionId: String,
  mousePatterns: [{
    x: Number,
    y: Number,
    timestamp: Date,
    action: String // click, move, scroll
  }],
  scrollVelocity: [Number],
  clickFrequency: Number,
  dwellTime: Number,
  adaptationsTriggered: [{
    type: String,
    timestamp: Date,
    reason: String
  }],
  sessionDuration: Number,
  completedActions: [String],
  frustrationIndicators: Number,
  date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  
  // Neurodiverse profile
  neurodiverseProfile: {
    type: neurodiverseProfileSchema,
    default: () => ({})
  },
  
  // Behavior analytics
  behaviorAnalytics: [behaviorAnalyticsSchema],
  
  // Shopping data
  cart: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    addedAt: { type: Date, default: Date.now }
  }],
  
  wishlist: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    addedAt: { type: Date, default: Date.now }
  }],
  
  // Progress tracking
  comfortMetrics: {
    successfulSessions: { type: Number, default: 0 },
    averageSessionTime: { type: Number, default: 0 },
    adaptationFrequency: { type: Number, default: 0 },
    stressTriggers: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Account settings
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: Date
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.behaviorAnalytics;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
