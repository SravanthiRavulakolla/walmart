const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Apple iPhone 15 Pro',
    description: 'The most advanced iPhone yet with titanium design, A17 Pro chip, and professional camera system. Features accessibility options including VoiceOver, Switch Control, and AssistiveTouch.',
    shortDescription: 'Latest iPhone with advanced accessibility features',
    price: 999.99,
    originalPrice: 1099.99,
    discount: 9,
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    sku: 'IPHONE15PRO128',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
        alt: 'iPhone 15 Pro in Natural Titanium',
        isPrimary: true
      }
    ],
    stock: 50,
    specifications: [
      { name: 'Display', value: '6.1-inch Super Retina XDR' },
      { name: 'Chip', value: 'A17 Pro' },
      { name: 'Storage', value: '128GB' },
      { name: 'Camera', value: '48MP Main, 12MP Ultra Wide' }
    ],
    accessibilityFeatures: ['Voice Control', 'Large Print', 'High Contrast'],
    tags: ['smartphone', 'apple', 'accessibility', 'voice control'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling headphones with exceptional sound quality. Features speak-to-chat technology and adaptive sound control for users with sensory sensitivities.',
    shortDescription: 'Premium noise-canceling headphones with adaptive features',
    price: 349.99,
    originalPrice: 399.99,
    discount: 12,
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'Sony',
    model: 'WH-1000XM5',
    sku: 'SONY-WH1000XM5-BLK',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
        alt: 'Sony WH-1000XM5 Headphones in Black',
        isPrimary: true
      }
    ],
    stock: 25,
    specifications: [
      { name: 'Battery Life', value: '30 hours' },
      { name: 'Noise Canceling', value: 'Industry Leading' },
      { name: 'Weight', value: '250g' },
      { name: 'Connectivity', value: 'Bluetooth 5.2' }
    ],
    accessibilityFeatures: ['Simple Interface', 'Voice Control', 'Tactile Feedback'],
    tags: ['headphones', 'noise canceling', 'sensory friendly'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Specially designed office chair with lumbar support and adjustable features. Perfect for users who need comfortable seating for extended periods, including those with ADHD or autism.',
    shortDescription: 'Comfortable ergonomic chair with sensory-friendly design',
    price: 299.99,
    category: 'Home & Garden',
    subcategory: 'Furniture',
    brand: 'ErgoComfort',
    model: 'EC-2024',
    sku: 'ERGO-CHAIR-BLU',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
        alt: 'Blue ergonomic office chair',
        isPrimary: true
      }
    ],
    stock: 15,
    specifications: [
      { name: 'Material', value: 'Breathable Mesh' },
      { name: 'Weight Capacity', value: '300 lbs' },
      { name: 'Adjustability', value: 'Height, Armrests, Lumbar' },
      { name: 'Warranty', value: '5 years' }
    ],
    accessibilityFeatures: ['Easy Grip', 'Simple Interface'],
    tags: ['furniture', 'ergonomic', 'comfort', 'office'],
    isActive: true
  },
  {
    name: 'Fidget Sensory Kit',
    description: 'Complete sensory kit with various fidget tools designed for stress relief and focus enhancement. Includes stress balls, fidget cubes, and textured items.',
    shortDescription: 'Comprehensive fidget kit for stress relief and focus',
    price: 24.99,
    category: 'Health & Beauty',
    subcategory: 'Wellness',
    brand: 'SensoryPlus',
    model: 'SP-FIDGET-KIT',
    sku: 'FIDGET-KIT-001',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        alt: 'Colorful fidget sensory kit with various tools',
        isPrimary: true
      }
    ],
    stock: 100,
    specifications: [
      { name: 'Items Included', value: '12 different fidget tools' },
      { name: 'Material', value: 'Non-toxic silicone and plastic' },
      { name: 'Age Range', value: '6+ years' },
      { name: 'Cleaning', value: 'Washable' }
    ],
    accessibilityFeatures: ['Tactile Feedback', 'Simple Interface'],
    tags: ['fidget', 'sensory', 'stress relief', 'focus', 'autism', 'adhd'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Large Button Phone',
    description: 'Senior-friendly phone with large, high-contrast buttons and amplified sound. Perfect for users with visual or hearing impairments.',
    shortDescription: 'Easy-to-use phone with large buttons and clear display',
    price: 79.99,
    category: 'Electronics',
    subcategory: 'Phones',
    brand: 'ClearCall',
    model: 'CC-LARGE-BTN',
    sku: 'PHONE-LARGE-BTN',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500',
        alt: 'Large button phone with clear display',
        isPrimary: true
      }
    ],
    stock: 30,
    specifications: [
      { name: 'Button Size', value: 'Extra Large' },
      { name: 'Display', value: 'High Contrast LCD' },
      { name: 'Volume', value: 'Amplified up to 40dB' },
      { name: 'Emergency Button', value: 'Yes' }
    ],
    accessibilityFeatures: ['Large Print', 'High Contrast', 'Simple Interface', 'Audio Description'],
    tags: ['phone', 'large buttons', 'senior friendly', 'accessibility'],
    isActive: true
  },
  {
    name: 'Weighted Blanket',
    description: 'Therapeutic weighted blanket designed to provide deep pressure stimulation for better sleep and anxiety relief. Available in multiple weights.',
    shortDescription: 'Calming weighted blanket for better sleep and anxiety relief',
    price: 89.99,
    category: 'Home & Garden',
    subcategory: 'Bedding',
    brand: 'CalmSleep',
    model: 'CS-WEIGHTED-15LB',
    sku: 'WEIGHTED-BLANKET-15',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500',
        alt: 'Gray weighted blanket on bed',
        isPrimary: true
      }
    ],
    stock: 40,
    specifications: [
      { name: 'Weight', value: '15 lbs' },
      { name: 'Size', value: '60" x 80"' },
      { name: 'Material', value: 'Cotton with glass beads' },
      { name: 'Care', value: 'Machine washable' }
    ],
    accessibilityFeatures: ['Tactile Feedback'],
    tags: ['weighted blanket', 'anxiety relief', 'sleep aid', 'sensory'],
    isActive: true,
    isFeatured: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create demo user
    const demoUser = await User.create({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@senseease.com',
      password: 'demo123',
      neurodiverseProfile: {
        focusMode: true,
        fontSize: 'large',
        colorScheme: 'default',
        voiceCommands: true,
        textToSpeech: true
      }
    });
    console.log('Created demo user: demo@senseease.com / demo123');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${products.length} sample products`);
    
    // Calculate average ratings for products
    for (const product of products) {
      product.calculateAverageRating();
      await product.save();
    }
    
    console.log('Database seeded successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleProducts };
