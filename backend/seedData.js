const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const sampleProducts = [
  // Travel & Beach Products (for Goa trip)
  {
    name: 'Neutrogena Ultra Sheer Dry-Touch Sunscreen SPF 100+',
    description: 'Broad spectrum UVA/UVB protection with Dry-Touch technology. Water resistant for up to 80 minutes. Perfect for beach trips and outdoor activities.',
    shortDescription: 'High SPF sunscreen for beach protection',
    price: 12.99,
    originalPrice: 15.99,
    discount: 19,
    category: 'Health & Beauty',
    subcategory: 'Sun Care',
    brand: 'Neutrogena',
    model: 'Ultra Sheer SPF 100+',
    sku: 'NEUTRO-SUN-100-3OZ',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/sunscreen_sample.jpg',
        alt: 'Neutrogena Ultra Sheer Sunscreen SPF 100+',
        isPrimary: true
      }
    ],
    stock: 150,
    specifications: [
      { name: 'SPF', value: '100+' },
      { name: 'Size', value: '3 fl oz' },
      { name: 'Water Resistant', value: '80 minutes' },
      { name: 'Type', value: 'Dry-Touch' }
    ],
    accessibilityFeatures: ['Easy Grip', 'Large Print'],
    tags: ['sunscreen', 'beach', 'travel', 'protection', 'goa', 'vacation'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Dock & Bay Quick Dry Beach Towel',
    description: 'Ultra-absorbent microfiber beach towel that dries 3x faster than cotton. Compact, lightweight, and sand-free. Perfect for travel and beach trips.',
    shortDescription: 'Quick-dry microfiber beach towel',
    price: 19.99,
    originalPrice: 24.99,
    discount: 20,
    category: 'Sports & Outdoors',
    subcategory: 'Beach Accessories',
    brand: 'Dock & Bay',
    model: 'Quick Dry Towel Large',
    sku: 'DOCK-TOWEL-LG-BLUE',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/beach_towel_sample.jpg',
        alt: 'Dock & Bay Quick Dry Beach Towel in Blue',
        isPrimary: true
      }
    ],
    stock: 75,
    specifications: [
      { name: 'Material', value: 'Microfiber' },
      { name: 'Size', value: '63" x 31"' },
      { name: 'Weight', value: '0.7 lbs' },
      { name: 'Dry Time', value: '3x faster than cotton' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['beach towel', 'travel', 'microfiber', 'quick dry', 'goa', 'beach'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Havaianas Brazil Flip Flops',
    description: 'Authentic Brazilian flip flops with comfortable rubber sole and iconic design. Perfect for beach walks and casual wear.',
    shortDescription: 'Comfortable Brazilian flip flops',
    price: 15.99,
    originalPrice: 18.99,
    discount: 16,
    category: 'Clothing',
    subcategory: 'Footwear',
    brand: 'Havaianas',
    model: 'Brazil',
    sku: 'HAVA-BRAZIL-M9-NAVY',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/flip_flops_sample.jpg',
        alt: 'Havaianas Brazil Flip Flops in Navy',
        isPrimary: true
      }
    ],
    stock: 200,
    specifications: [
      { name: 'Material', value: 'Rubber' },
      { name: 'Size', value: 'M9/W10' },
      { name: 'Origin', value: 'Brazil' },
      { name: 'Style', value: 'Classic' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['flip flops', 'beach', 'footwear', 'brazil', 'goa', 'vacation'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'JOTO Waterproof Phone Case',
    description: 'Universal waterproof phone case with IPX8 certification. Compatible with phones up to 7 inches. Perfect for beach and water activities.',
    shortDescription: 'Waterproof case for phones',
    price: 9.99,
    originalPrice: 12.99,
    discount: 23,
    category: 'Electronics',
    subcategory: 'Phone Accessories',
    brand: 'JOTO',
    model: 'Universal Waterproof Case',
    sku: 'JOTO-WP-CASE-CLEAR',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/phone_case_sample.jpg',
        alt: 'JOTO Waterproof Phone Case',
        isPrimary: true
      }
    ],
    stock: 120,
    specifications: [
      { name: 'Rating', value: 'IPX8 Waterproof' },
      { name: 'Compatibility', value: 'Up to 7 inch phones' },
      { name: 'Depth', value: 'Up to 100 feet' },
      { name: 'Material', value: 'TPU' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['waterproof', 'phone case', 'beach', 'travel', 'protection', 'goa'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Anker PowerCore 10000 Portable Charger',
    description: 'Ultra-compact portable charger with 10000mAh capacity. Charges iPhone 13 up to 2.25 times. Perfect for travel and outdoor activities.',
    shortDescription: 'Compact 10000mAh portable charger',
    price: 24.99,
    originalPrice: 29.99,
    discount: 17,
    category: 'Electronics',
    subcategory: 'Chargers',
    brand: 'Anker',
    model: 'PowerCore 10000',
    sku: 'ANKER-PC10K-BLACK',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/portable_charger_sample.jpg',
        alt: 'Anker PowerCore 10000 Portable Charger',
        isPrimary: true
      }
    ],
    stock: 85,
    specifications: [
      { name: 'Capacity', value: '10000mAh' },
      { name: 'Output', value: '12W' },
      { name: 'Weight', value: '6.35 oz' },
      { name: 'Charges iPhone 13', value: '2.25 times' }
    ],
    accessibilityFeatures: ['Simple Interface'],
    tags: ['portable charger', 'travel', 'electronics', 'anker', 'goa', 'power bank'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Johnson & Johnson First Aid Kit',
    description: 'Comprehensive first aid kit with 140 pieces including bandages, antiseptic wipes, and pain relievers. Essential for travel and outdoor activities.',
    shortDescription: '140-piece comprehensive first aid kit',
    price: 16.99,
    originalPrice: 19.99,
    discount: 15,
    category: 'Health & Beauty',
    subcategory: 'First Aid',
    brand: 'Johnson & Johnson',
    model: 'All Purpose First Aid Kit',
    sku: 'JJ-FIRSTAID-140PC',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/first_aid_kit_sample.jpg',
        alt: 'Johnson & Johnson First Aid Kit',
        isPrimary: true
      }
    ],
    stock: 60,
    specifications: [
      { name: 'Pieces', value: '140' },
      { name: 'Case', value: 'Durable plastic' },
      { name: 'Weight', value: '1.2 lbs' },
      { name: 'Dimensions', value: '9" x 6" x 3"' }
    ],
    accessibilityFeatures: ['Large Print', 'Easy Grip'],
    tags: ['first aid', 'safety', 'travel', 'medical', 'emergency', 'goa'],
    isActive: true,
    isFeatured: false
  },

  // Birthday Party Products
  {
    name: 'Amscan Happy Birthday Balloons Pack',
    description: 'Colorful latex balloons pack with "Happy Birthday" text. Includes 20 balloons in assorted colors. Perfect for birthday celebrations.',
    shortDescription: 'Happy Birthday balloons pack of 20',
    price: 8.99,
    originalPrice: 10.99,
    discount: 18,
    category: 'Home & Garden',
    subcategory: 'Balloons',
    brand: 'Amscan',
    model: 'Happy Birthday Latex Balloons',
    sku: 'AMSCAN-BDAY-BALLOONS-20',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/birthday_balloons_sample.jpg',
        alt: 'Happy Birthday Balloons Pack',
        isPrimary: true
      }
    ],
    stock: 100,
    specifications: [
      { name: 'Quantity', value: '20 balloons' },
      { name: 'Material', value: 'Latex' },
      { name: 'Colors', value: 'Assorted' },
      { name: 'Size', value: '12 inches when inflated' }
    ],
    accessibilityFeatures: ['Large Print'],
    tags: ['balloons', 'birthday', 'party', 'decorations', 'celebration'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Hefty Disposable Paper Plates 50 Count',
    description: 'Strong and reliable disposable paper plates. Microwave safe and perfect for parties. 9-inch diameter plates.',
    shortDescription: 'Disposable paper plates 50 pack',
    price: 6.99,
    originalPrice: 8.99,
    discount: 22,
    category: 'Home & Garden',
    subcategory: 'Plates',
    brand: 'Hefty',
    model: 'Disposable Paper Plates',
    sku: 'HEFTY-PLATES-50CT-9IN',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/paper_plates_sample.jpg',
        alt: 'Hefty Disposable Paper Plates',
        isPrimary: true
      }
    ],
    stock: 150,
    specifications: [
      { name: 'Count', value: '50 plates' },
      { name: 'Size', value: '9 inches' },
      { name: 'Material', value: 'Paper' },
      { name: 'Microwave Safe', value: 'Yes' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['paper plates', 'disposable', 'party', 'tableware', 'birthday'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Solo Red Plastic Cups 50 Count',
    description: 'Classic red plastic cups perfect for parties. 16 oz capacity. Durable and reusable.',
    shortDescription: 'Red plastic party cups 50 pack',
    price: 5.99,
    originalPrice: 7.99,
    discount: 25,
    category: 'Home & Garden',
    subcategory: 'Cups',
    brand: 'Solo',
    model: 'Red Party Cups',
    sku: 'SOLO-RED-CUPS-50CT-16OZ',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/red_cups_sample.jpg',
        alt: 'Solo Red Plastic Cups',
        isPrimary: true
      }
    ],
    stock: 200,
    specifications: [
      { name: 'Count', value: '50 cups' },
      { name: 'Capacity', value: '16 oz' },
      { name: 'Material', value: 'Plastic' },
      { name: 'Color', value: 'Red' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['plastic cups', 'party', 'red cups', 'tableware', 'birthday'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Creative Converting Birthday Candles',
    description: 'Colorful birthday candles pack with holders. Includes 24 candles in assorted colors. Perfect for birthday cakes.',
    shortDescription: 'Birthday candles pack of 24',
    price: 3.99,
    originalPrice: 4.99,
    discount: 20,
    category: 'Home & Garden',
    subcategory: 'Candles',
    brand: 'Creative Converting',
    model: 'Birthday Candles Assorted',
    sku: 'CC-BDAY-CANDLES-24CT',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/birthday_candles_sample.jpg',
        alt: 'Birthday Candles Pack',
        isPrimary: true
      }
    ],
    stock: 180,
    specifications: [
      { name: 'Count', value: '24 candles' },
      { name: 'Colors', value: 'Assorted' },
      { name: 'Height', value: '2.5 inches' },
      { name: 'Includes', value: 'Holders' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['birthday candles', 'candles', 'party', 'decorations', 'birthday'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Beistle Party Hats Assorted Colors',
    description: 'Fun party hats in assorted colors and designs. Pack of 8 hats perfect for birthday celebrations.',
    shortDescription: 'Assorted party hats pack of 8',
    price: 7.99,
    originalPrice: 9.99,
    discount: 20,
    category: 'Home & Garden',
    subcategory: 'Party Accessories',
    brand: 'Beistle',
    model: 'Assorted Party Hats',
    sku: 'BEISTLE-HATS-8CT-ASST',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/party_hats_sample.jpg',
        alt: 'Assorted Party Hats',
        isPrimary: true
      }
    ],
    stock: 90,
    specifications: [
      { name: 'Count', value: '8 hats' },
      { name: 'Colors', value: 'Assorted' },
      { name: 'Material', value: 'Paper' },
      { name: 'Size', value: 'One size fits most' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['party hats', 'hats', 'party', 'decorations', 'birthday'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Coca-Cola Soda Variety Pack 12 Cans',
    description: 'Variety pack of Coca-Cola products including Coke, Sprite, and Fanta. 12 oz cans, pack of 12.',
    shortDescription: 'Coca-Cola variety pack 12 cans',
    price: 12.99,
    originalPrice: 14.99,
    discount: 13,
    category: 'Food & Grocery',
    subcategory: 'Beverages',
    brand: 'Coca-Cola',
    model: 'Variety Pack',
    sku: 'COKE-VARIETY-12CT-12OZ',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/soda_variety_sample.jpg',
        alt: 'Coca-Cola Variety Pack',
        isPrimary: true
      }
    ],
    stock: 120,
    specifications: [
      { name: 'Count', value: '12 cans' },
      { name: 'Size', value: '12 oz each' },
      { name: 'Varieties', value: 'Coke, Sprite, Fanta' },
      { name: 'Caffeine', value: 'Varies by product' }
    ],
    accessibilityFeatures: ['Large Print'],
    tags: ['soda', 'beverages', 'party', 'drinks', 'birthday', 'coca cola'],
    isActive: true,
    isFeatured: false
  },

  // Camping Products
  {
    name: 'Coleman Sundome 4-Person Tent',
    description: 'Easy-to-set-up dome tent for 4 people. WeatherTec system with welded floors and inverted seams. Perfect for family camping trips.',
    shortDescription: '4-person dome tent with weather protection',
    price: 89.99,
    originalPrice: 109.99,
    discount: 18,
    category: 'Sports & Outdoors',
    subcategory: 'Tents',
    brand: 'Coleman',
    model: 'Sundome 4-Person',
    sku: 'COLEMAN-SUNDOME-4P',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/camping_tent_sample.jpg',
        alt: 'Coleman Sundome 4-Person Tent',
        isPrimary: true
      }
    ],
    stock: 45,
    specifications: [
      { name: 'Capacity', value: '4 people' },
      { name: 'Floor Size', value: '9 x 7 feet' },
      { name: 'Center Height', value: '4 feet 11 inches' },
      { name: 'Setup Time', value: '10 minutes' }
    ],
    accessibilityFeatures: ['Simple Interface'],
    tags: ['tent', 'camping', 'outdoor', 'coleman', 'family', 'hiking'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'TETON Sports Celsius Sleeping Bag',
    description: 'Comfortable sleeping bag rated to 0°F. Soft cotton flannel lining with compression sack included. Perfect for cold weather camping.',
    shortDescription: '0°F rated sleeping bag with cotton lining',
    price: 34.99,
    originalPrice: 44.99,
    discount: 22,
    category: 'Sports & Outdoors',
    subcategory: 'Sleeping Bags',
    brand: 'TETON Sports',
    model: 'Celsius Regular',
    sku: 'TETON-CELSIUS-REG',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/sleeping_bag_sample.jpg',
        alt: 'TETON Sports Celsius Sleeping Bag',
        isPrimary: true
      }
    ],
    stock: 70,
    specifications: [
      { name: 'Temperature Rating', value: '0°F' },
      { name: 'Length', value: '84 inches' },
      { name: 'Weight', value: '4.5 lbs' },
      { name: 'Lining', value: 'Cotton flannel' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['sleeping bag', 'camping', 'outdoor', 'cold weather', 'teton'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Coleman Portable Camping Stove',
    description: 'Two-burner propane camping stove with adjustable burners. WindBlock panels shield burners from wind. Perfect for outdoor cooking.',
    shortDescription: 'Two-burner portable propane camping stove',
    price: 45.99,
    originalPrice: 54.99,
    discount: 16,
    category: 'Home & Garden',
    subcategory: 'Camping Stoves',
    brand: 'Coleman',
    model: 'Classic Propane Stove',
    sku: 'COLEMAN-STOVE-2BURN',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/camping_stove_sample.jpg',
        alt: 'Coleman Portable Camping Stove',
        isPrimary: true
      }
    ],
    stock: 55,
    specifications: [
      { name: 'Burners', value: '2' },
      { name: 'Fuel Type', value: 'Propane' },
      { name: 'BTU', value: '20,000 total' },
      { name: 'Runtime', value: '1 hour on high' }
    ],
    accessibilityFeatures: ['Simple Interface'],
    tags: ['camping stove', 'cooking', 'outdoor', 'propane', 'coleman'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Energizer LED Flashlight',
    description: 'Bright LED flashlight with 350 lumens output. Water-resistant design with long battery life. Essential for camping and emergencies.',
    shortDescription: '350-lumen LED flashlight',
    price: 12.99,
    originalPrice: 15.99,
    discount: 19,
    category: 'Sports & Outdoors',
    subcategory: 'Flashlights',
    brand: 'Energizer',
    model: 'Vision HD Performance',
    sku: 'ENERGIZER-LED-FLASH',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/flashlight_sample.jpg',
        alt: 'Energizer LED Flashlight',
        isPrimary: true
      }
    ],
    stock: 150,
    specifications: [
      { name: 'Lumens', value: '350' },
      { name: 'Battery Life', value: '7 hours' },
      { name: 'Water Resistance', value: 'IPX4' },
      { name: 'Beam Distance', value: '85 meters' }
    ],
    accessibilityFeatures: ['Easy Grip', 'Tactile Feedback'],
    tags: ['flashlight', 'led', 'camping', 'safety', 'energizer', 'outdoor'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'OFF! Deep Woods Insect Repellent',
    description: 'Long-lasting insect repellent with 25% DEET. Provides up to 8 hours of protection against mosquitoes, ticks, and other insects.',
    shortDescription: '8-hour insect repellent with 25% DEET',
    price: 8.99,
    originalPrice: 10.99,
    discount: 18,
    category: 'Sports & Outdoors',
    subcategory: 'Insect Repellent',
    brand: 'OFF!',
    model: 'Deep Woods',
    sku: 'OFF-DEEPWOODS-6OZ',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/insect_repellent_sample.jpg',
        alt: 'OFF! Deep Woods Insect Repellent',
        isPrimary: true
      }
    ],
    stock: 120,
    specifications: [
      { name: 'DEET Concentration', value: '25%' },
      { name: 'Protection Time', value: '8 hours' },
      { name: 'Size', value: '6 oz' },
      { name: 'Application', value: 'Spray' }
    ],
    accessibilityFeatures: ['Easy Grip', 'Large Print'],
    tags: ['insect repellent', 'camping', 'outdoor', 'mosquito', 'deet', 'off'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Coleman Portable Camping Chairs',
    description: 'Comfortable quad camping chair with cup holder and cooler. Folds flat for easy transport. Supports up to 325 lbs.',
    shortDescription: 'Portable camping chair with cooler',
    price: 29.99,
    originalPrice: 34.99,
    discount: 14,
    category: 'Sports & Outdoors',
    subcategory: 'Chairs',
    brand: 'Coleman',
    model: 'Cooler Quad Chair',
    sku: 'COLEMAN-CHAIR-QUAD',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1640995200/camping_chair_sample.jpg',
        alt: 'Coleman Portable Camping Chair',
        isPrimary: true
      }
    ],
    stock: 80,
    specifications: [
      { name: 'Weight Capacity', value: '325 lbs' },
      { name: 'Seat Height', value: '18 inches' },
      { name: 'Features', value: 'Cup holder, cooler' },
      { name: 'Folded Size', value: '37 x 8 x 8 inches' }
    ],
    accessibilityFeatures: ['Simple Interface'],
    tags: ['camping chair', 'outdoor', 'portable', 'coleman', 'cooler'],
    isActive: true,
    isFeatured: false
  },

  // Additional Birthday Party Products
  {
    name: 'Great Value Birthday Cake Mix',
    description: 'Moist and delicious vanilla cake mix perfect for birthday celebrations. Just add water, oil, and eggs. Makes one 9-inch round cake.',
    shortDescription: 'Vanilla birthday cake mix',
    price: 1.98,
    originalPrice: 2.48,
    discount: 20,
    category: 'Food & Grocery',
    subcategory: 'Baking',
    brand: 'Great Value',
    model: 'Vanilla Cake Mix',
    sku: 'GV-CAKE-MIX-VANILLA',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/cake_mix_sample.jpg',
        alt: 'Great Value Vanilla Cake Mix',
        isPrimary: true
      }
    ],
    stock: 200,
    specifications: [
      { name: 'Weight', value: '15.25 oz' },
      { name: 'Flavor', value: 'Vanilla' },
      { name: 'Serves', value: '8-10 people' },
      { name: 'Prep Time', value: '5 minutes' }
    ],
    accessibilityFeatures: ['Large Print', 'Easy Grip'],
    tags: ['cake mix', 'birthday', 'baking', 'party', 'vanilla', 'great value'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Duncan Hines Vanilla Frosting',
    description: 'Rich and creamy vanilla frosting perfect for decorating birthday cakes and cupcakes. Ready to use straight from the container.',
    shortDescription: 'Ready-to-use vanilla frosting',
    price: 2.48,
    originalPrice: 2.98,
    discount: 17,
    category: 'Food & Grocery',
    subcategory: 'Baking',
    brand: 'Duncan Hines',
    model: 'Vanilla Frosting',
    sku: 'DH-FROSTING-VANILLA',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/frosting_sample.jpg',
        alt: 'Duncan Hines Vanilla Frosting',
        isPrimary: true
      }
    ],
    stock: 150,
    specifications: [
      { name: 'Weight', value: '16 oz' },
      { name: 'Flavor', value: 'Vanilla' },
      { name: 'Type', value: 'Ready-to-use' },
      { name: 'Coverage', value: '24 cupcakes or 1 cake' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['frosting', 'birthday', 'baking', 'party', 'vanilla', 'duncan hines'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Great Value Chocolate Ice Cream',
    description: 'Rich and creamy chocolate ice cream made with real cocoa. Perfect for birthday parties and celebrations. Family size container.',
    shortDescription: 'Chocolate ice cream family size',
    price: 3.98,
    originalPrice: 4.48,
    discount: 11,
    category: 'Food & Grocery',
    subcategory: 'Frozen Foods',
    brand: 'Great Value',
    model: 'Chocolate Ice Cream',
    sku: 'GV-ICE-CREAM-CHOC',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/ice_cream_sample.jpg',
        alt: 'Great Value Chocolate Ice Cream',
        isPrimary: true
      }
    ],
    stock: 100,
    specifications: [
      { name: 'Size', value: '1.5 quarts' },
      { name: 'Flavor', value: 'Chocolate' },
      { name: 'Serves', value: '12 servings' },
      { name: 'Storage', value: 'Keep frozen' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['ice cream', 'birthday', 'party', 'chocolate', 'frozen', 'great value'],
    isActive: true,
    isFeatured: false
  },

  // Additional Travel/Beach Products
  {
    name: 'Coppertone Sport Sunscreen Lotion SPF 50',
    description: 'Water-resistant sport sunscreen that stays on strong when you sweat. Broad spectrum UVA/UVB protection for active beach days.',
    shortDescription: 'Water-resistant sport sunscreen SPF 50',
    price: 8.97,
    originalPrice: 10.97,
    discount: 18,
    category: 'Health & Beauty',
    subcategory: 'Sun Care',
    brand: 'Coppertone',
    model: 'Sport SPF 50',
    sku: 'COPPER-SPORT-SPF50',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/coppertone_sample.jpg',
        alt: 'Coppertone Sport Sunscreen SPF 50',
        isPrimary: true
      }
    ],
    stock: 120,
    specifications: [
      { name: 'SPF', value: '50' },
      { name: 'Size', value: '7 fl oz' },
      { name: 'Water Resistant', value: '80 minutes' },
      { name: 'Type', value: 'Sport formula' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['sunscreen', 'beach', 'travel', 'sport', 'water resistant', 'goa'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Igloo Playmate Cooler 16 Qt',
    description: 'Classic Playmate cooler perfect for beach trips and picnics. Holds up to 20 cans plus ice. Durable and easy to carry.',
    shortDescription: '16-quart portable cooler',
    price: 24.88,
    originalPrice: 29.88,
    discount: 17,
    category: 'Sports & Outdoors',
    subcategory: 'Coolers',
    brand: 'Igloo',
    model: 'Playmate 16 Qt',
    sku: 'IGLOO-PLAYMATE-16QT',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/cooler_sample.jpg',
        alt: 'Igloo Playmate Cooler 16 Qt',
        isPrimary: true
      }
    ],
    stock: 75,
    specifications: [
      { name: 'Capacity', value: '16 quarts' },
      { name: 'Can Capacity', value: '20 cans + ice' },
      { name: 'Weight', value: '3.5 lbs' },
      { name: 'Dimensions', value: '18.5" x 12.9" x 13.8"' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['cooler', 'beach', 'travel', 'picnic', 'igloo', 'goa'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Banana Boat Aloe After Sun Lotion',
    description: 'Soothing aloe vera after-sun lotion that helps cool and moisturize sun-exposed skin. Perfect for beach vacations.',
    shortDescription: 'Aloe after-sun moisturizing lotion',
    price: 4.97,
    originalPrice: 5.97,
    discount: 17,
    category: 'Health & Beauty',
    subcategory: 'Sun Care',
    brand: 'Banana Boat',
    model: 'Aloe After Sun',
    sku: 'BB-ALOE-AFTERSUN',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/after_sun_sample.jpg',
        alt: 'Banana Boat Aloe After Sun Lotion',
        isPrimary: true
      }
    ],
    stock: 90,
    specifications: [
      { name: 'Size', value: '16 fl oz' },
      { name: 'Key Ingredient', value: 'Aloe Vera' },
      { name: 'Type', value: 'After-sun care' },
      { name: 'Skin Type', value: 'All skin types' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['after sun', 'aloe', 'beach', 'travel', 'moisturizer', 'goa'],
    isActive: true,
    isFeatured: false
  },

  // Additional Camping Products
  {
    name: 'Coleman Lantern Battery Powered',
    description: 'Bright LED lantern with 360-degree light. Runs on 4 D batteries (not included). Perfect for camping and emergency use.',
    shortDescription: 'Battery-powered LED camping lantern',
    price: 19.97,
    originalPrice: 24.97,
    discount: 20,
    category: 'Sports & Outdoors',
    subcategory: 'Lighting',
    brand: 'Coleman',
    model: 'LED Lantern',
    sku: 'COLEMAN-LANTERN-LED',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/lantern_sample.jpg',
        alt: 'Coleman LED Lantern',
        isPrimary: true
      }
    ],
    stock: 85,
    specifications: [
      { name: 'Light Output', value: '1000 lumens' },
      { name: 'Battery Type', value: '4 D batteries' },
      { name: 'Runtime', value: '175 hours' },
      { name: 'Light Pattern', value: '360-degree' }
    ],
    accessibilityFeatures: ['Simple Interface', 'Easy Grip'],
    tags: ['lantern', 'camping', 'led', 'battery', 'coleman', 'outdoor'],
    isActive: true,
    isFeatured: false
  },

  // General Household & Grocery Items
  {
    name: 'Great Value 2% Reduced Fat Milk',
    description: 'Fresh and nutritious 2% reduced fat milk. Perfect for drinking, cereal, and cooking. Gallon size for families.',
    shortDescription: '2% reduced fat milk gallon',
    price: 3.68,
    originalPrice: 3.98,
    discount: 8,
    category: 'Food & Grocery',
    subcategory: 'Dairy',
    brand: 'Great Value',
    model: '2% Milk Gallon',
    sku: 'GV-MILK-2PERCENT-GAL',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/milk_sample.jpg',
        alt: 'Great Value 2% Milk Gallon',
        isPrimary: true
      }
    ],
    stock: 300,
    specifications: [
      { name: 'Size', value: '1 gallon' },
      { name: 'Fat Content', value: '2%' },
      { name: 'Type', value: 'Reduced fat' },
      { name: 'Storage', value: 'Keep refrigerated' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['milk', 'dairy', 'grocery', 'breakfast', 'great value'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Wonder Bread Classic White',
    description: 'Soft and fresh classic white bread. Perfect for sandwiches, toast, and everyday meals. 20 oz loaf.',
    shortDescription: 'Classic white bread loaf',
    price: 1.28,
    originalPrice: 1.48,
    discount: 14,
    category: 'Food & Grocery',
    subcategory: 'Bakery',
    brand: 'Wonder',
    model: 'Classic White',
    sku: 'WONDER-BREAD-WHITE',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/bread_sample.jpg',
        alt: 'Wonder Bread Classic White',
        isPrimary: true
      }
    ],
    stock: 250,
    specifications: [
      { name: 'Weight', value: '20 oz' },
      { name: 'Slices', value: '22 slices' },
      { name: 'Type', value: 'White bread' },
      { name: 'Enriched', value: 'Yes' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['bread', 'white bread', 'sandwich', 'grocery', 'wonder'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Bananas Fresh Produce',
    description: 'Fresh, ripe bananas perfect for snacking, smoothies, and baking. Rich in potassium and natural energy.',
    shortDescription: 'Fresh bananas per pound',
    price: 0.58,
    originalPrice: 0.68,
    discount: 15,
    category: 'Food & Grocery',
    subcategory: 'Fresh Produce',
    brand: 'Fresh',
    model: 'Bananas',
    sku: 'FRESH-BANANAS-LB',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/bananas_sample.jpg',
        alt: 'Fresh Bananas',
        isPrimary: true
      }
    ],
    stock: 500,
    specifications: [
      { name: 'Unit', value: 'Per pound' },
      { name: 'Type', value: 'Fresh produce' },
      { name: 'Origin', value: 'Various' },
      { name: 'Storage', value: 'Room temperature' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['bananas', 'fruit', 'fresh', 'produce', 'healthy', 'snack'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Great Value Large Eggs',
    description: 'Fresh Grade A large eggs. Perfect for breakfast, baking, and cooking. Dozen pack with excellent protein content.',
    shortDescription: 'Grade A large eggs dozen',
    price: 2.12,
    originalPrice: 2.42,
    discount: 12,
    category: 'Food & Grocery',
    subcategory: 'Dairy',
    brand: 'Great Value',
    model: 'Large Eggs',
    sku: 'GV-EGGS-LARGE-DOZEN',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/eggs_sample.jpg',
        alt: 'Great Value Large Eggs',
        isPrimary: true
      }
    ],
    stock: 200,
    specifications: [
      { name: 'Count', value: '12 eggs' },
      { name: 'Grade', value: 'Grade A' },
      { name: 'Size', value: 'Large' },
      { name: 'Storage', value: 'Keep refrigerated' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['eggs', 'protein', 'breakfast', 'baking', 'grocery', 'great value'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Charmin Ultra Soft Toilet Paper',
    description: 'Ultra soft toilet paper that\'s gentle and absorbent. 12 mega rolls equal 48 regular rolls. Long-lasting family pack.',
    shortDescription: 'Ultra soft toilet paper 12 mega rolls',
    price: 12.97,
    originalPrice: 14.97,
    discount: 13,
    category: 'Health & Beauty',
    subcategory: 'Personal Care',
    brand: 'Charmin',
    model: 'Ultra Soft',
    sku: 'CHARMIN-ULTRA-SOFT-12',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/toilet_paper_sample.jpg',
        alt: 'Charmin Ultra Soft Toilet Paper',
        isPrimary: true
      }
    ],
    stock: 150,
    specifications: [
      { name: 'Count', value: '12 mega rolls' },
      { name: 'Equivalent', value: '48 regular rolls' },
      { name: 'Ply', value: '2-ply' },
      { name: 'Type', value: 'Ultra soft' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['toilet paper', 'bathroom', 'household', 'charmin', 'soft'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Tide Liquid Laundry Detergent',
    description: 'America\'s #1 detergent. Powerful cleaning for all your laundry needs. Original scent, 64 loads capacity.',
    shortDescription: 'Liquid laundry detergent 92 fl oz',
    price: 11.97,
    originalPrice: 13.97,
    discount: 14,
    category: 'Home & Garden',
    subcategory: 'Laundry',
    brand: 'Tide',
    model: 'Original Scent',
    sku: 'TIDE-LIQUID-ORIGINAL-92',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/tide_sample.jpg',
        alt: 'Tide Liquid Laundry Detergent',
        isPrimary: true
      }
    ],
    stock: 120,
    specifications: [
      { name: 'Size', value: '92 fl oz' },
      { name: 'Loads', value: '64 loads' },
      { name: 'Scent', value: 'Original' },
      { name: 'Type', value: 'Liquid concentrate' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['laundry', 'detergent', 'cleaning', 'household', 'tide'],
    isActive: true,
    isFeatured: false
  },

  // Additional Party/Snack Items
  {
    name: 'Lay\'s Classic Potato Chips',
    description: 'America\'s favorite potato chips with the perfect amount of salt. Great for parties, snacking, and gatherings.',
    shortDescription: 'Classic potato chips family size',
    price: 3.98,
    originalPrice: 4.48,
    discount: 11,
    category: 'Food & Grocery',
    subcategory: 'Snacks',
    brand: 'Lay\'s',
    model: 'Classic',
    sku: 'LAYS-CLASSIC-CHIPS',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/chips_sample.jpg',
        alt: 'Lay\'s Classic Potato Chips',
        isPrimary: true
      }
    ],
    stock: 200,
    specifications: [
      { name: 'Size', value: 'Family size' },
      { name: 'Weight', value: '10 oz' },
      { name: 'Flavor', value: 'Classic' },
      { name: 'Type', value: 'Potato chips' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['chips', 'snacks', 'party', 'potato chips', 'lays'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Tostitos Chunky Salsa',
    description: 'Thick and chunky salsa made with vine-ripened tomatoes, onions, and peppers. Perfect for dipping with chips.',
    shortDescription: 'Chunky salsa dip',
    price: 2.98,
    originalPrice: 3.48,
    discount: 14,
    category: 'Food & Grocery',
    subcategory: 'Condiments',
    brand: 'Tostitos',
    model: 'Chunky Salsa',
    sku: 'TOSTITOS-SALSA-CHUNKY',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/salsa_sample.jpg',
        alt: 'Tostitos Chunky Salsa',
        isPrimary: true
      }
    ],
    stock: 150,
    specifications: [
      { name: 'Size', value: '15.5 oz' },
      { name: 'Type', value: 'Chunky' },
      { name: 'Heat Level', value: 'Medium' },
      { name: 'Storage', value: 'Refrigerate after opening' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['salsa', 'dip', 'party', 'snacks', 'tostitos'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'DiGiorno Rising Crust Pizza',
    description: 'Frozen pizza with rising crust, premium cheese, and pepperoni. Perfect for parties and quick meals.',
    shortDescription: 'Frozen pepperoni pizza',
    price: 5.98,
    originalPrice: 6.98,
    discount: 14,
    category: 'Food & Grocery',
    subcategory: 'Frozen Foods',
    brand: 'DiGiorno',
    model: 'Rising Crust Pepperoni',
    sku: 'DIGIORNO-PIZZA-PEPPERONI',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/pizza_sample.jpg',
        alt: 'DiGiorno Rising Crust Pizza',
        isPrimary: true
      }
    ],
    stock: 100,
    specifications: [
      { name: 'Size', value: '12 inch' },
      { name: 'Crust', value: 'Rising crust' },
      { name: 'Toppings', value: 'Pepperoni' },
      { name: 'Serves', value: '3-4 people' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['pizza', 'frozen', 'party', 'pepperoni', 'digiorno'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Great Value Paper Napkins',
    description: 'Soft and absorbent paper napkins perfect for parties, meals, and everyday use. 200 count pack.',
    shortDescription: 'Paper napkins 200 count',
    price: 1.98,
    originalPrice: 2.48,
    discount: 20,
    category: 'Home & Garden',
    subcategory: 'Paper Products',
    brand: 'Great Value',
    model: 'Paper Napkins',
    sku: 'GV-NAPKINS-200CT',
    images: [
      {
        url: 'https://res.cloudinary.com/dbk7zq6al/image/upload/v1640995200/napkins_sample.jpg',
        alt: 'Great Value Paper Napkins',
        isPrimary: true
      }
    ],
    stock: 300,
    specifications: [
      { name: 'Count', value: '200 napkins' },
      { name: 'Ply', value: '1-ply' },
      { name: 'Color', value: 'White' },
      { name: 'Size', value: 'Standard' }
    ],
    accessibilityFeatures: ['Easy Grip'],
    tags: ['napkins', 'paper', 'party', 'household', 'great value'],
    isActive: true,
    isFeatured: false
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
