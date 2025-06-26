# Walmart SenseEase 🛒✨

**Shop Smart. Shop Calm. Designed for Every Mind.**

An adaptive Walmart shopping experience tailored for cognitive and sensory needs, built with the MERN stack.

## 🌟 Features

### 🧠 Neurodiversity Support
- **Adaptive UI**: Real-time interface adjustments based on user behavior
- **Accessibility Toolkit**: Instant toggles for fonts, colors, and layouts
- **Profile Customization**: Personalized settings for cognitive preferences
- **Progress Tracking**: Monitor comfort metrics and shopping success

### 🎤 Voice-Powered Shopping
- **Voice Commands**: Search, navigate, and shop hands-free
- **PrepPal AI Assistant**: Smart shopping lists from natural language
- **Audio Feedback**: Screen reader compatibility and voice responses

### ♿ Accessibility First
- **WCAG 2.1 AA Compliant**: Full accessibility standards
- **Multiple Themes**: High contrast, low stimulation, dyslexia-friendly
- **Keyboard Navigation**: Complete keyboard accessibility
- **Reduced Motion**: Respects user motion preferences

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (already configured)
- OpenAI API key (optional - for enhanced PrepPal features)
- Wit.ai token (optional - for enhanced voice recognition)

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Seed the database with sample products:**
   ```bash
   npm run seed
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Demo Account
- **Email:** demo@senseease.com
- **Password:** demo123

### Quick Test
1. Visit http://localhost:3000
2. Click "Sign Up" or use the demo account
3. Complete the accessibility setup
4. Start shopping with adaptive features!

## 📁 Project Structure

```
walmart-senseease/
├── backend/                 # Node.js/Express API
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Main server file
├── frontend/               # React/Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
└── README.md
```

## 🎯 Key Features Implementation

### 1. **Real-Time UI Adaptation**
- Mouse/touch pattern analysis
- Scroll velocity monitoring
- Click frequency detection
- Automatic layout simplification

### 2. **PrepPal AI Assistant**
- Natural language processing
- Context-aware shopping lists
- Walmart product integration
- Budget estimation

### 3. **Voice Shopping Interface**
- Web Speech API integration
- Wit.ai natural language understanding
- Voice command recognition
- Audio feedback system

### 4. **Accessibility Toolkit**
- Dyslexia-friendly fonts
- Color scheme options
- Layout adaptations
- Text-to-speech support

## 🧪 Testing

Run the test suite:
```bash
cd backend && npm test
cd frontend && npm test
```

## 🚀 Deployment

### Backend (Railway/Heroku)
```bash
cd backend
# Set environment variables in your hosting platform
# Deploy using platform-specific commands
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for accessibility and inclusion**
