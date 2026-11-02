import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carpenter_store'

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

const productSchema = new mongoose.Schema({
  category: mongoose.Schema.Types.ObjectId,
  name: String,
  slug: String,
  description: String,
  price: Number,
  discountPrice: Number,
  material: String,
  dimensions: String,
  availabilityStatus: String,
  isActive: Boolean,
  isFeatured: Boolean,
  media: [{
    mediaType: String,
    mediaUrl: String,
    publicId: String,
    altText: String,
    sortOrder: Number
  }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

const inquirySchema = new mongoose.Schema({
  product: mongoose.Schema.Types.ObjectId,
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  message: String,
  status: String,
  adminNotes: String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

const businessSettingsSchema = new mongoose.Schema({
  _id: Number,
  businessName: String,
  logoUrl: String,
  logoPublicId: String,
  phone: String,
  whatsappNumber: String,
  email: String,
  address: String,
  aboutText: String,
  facebookUrl: String,
  instagramUrl: String,
  youtubeUrl: String
}, { timestamps: { createdAt: false, updatedAt: 'updated_at' }, versionKey: false })

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

const Category = mongoose.model('Category', categorySchema)
const Product = mongoose.model('Product', productSchema)
const Inquiry = mongoose.model('Inquiry', inquirySchema)
const BusinessSettings = mongoose.model('BusinessSettings', businessSettingsSchema)
const Admin = mongoose.model('Admin', adminSchema)

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      Inquiry.deleteMany({}),
      BusinessSettings.deleteMany({})
    ])
    console.log('Cleared existing data')

    const categories = await Category.insertMany([
      { name: 'Beds', slug: 'beds', description: 'Comfortable and stylish beds for a good night sleep' },
      { name: 'Sofas', slug: 'sofas', description: 'Elegant sofas and sectionals for your living room' },
      { name: 'Tables', slug: 'tables', description: 'Dining tables, coffee tables, and side tables' },
      { name: 'Chairs', slug: 'chairs', description: 'Dining chairs, lounge chairs, and office chairs' },
      { name: 'Wardrobes', slug: 'wardrobes', description: 'Spacious wardrobes and armoires for storage' },
      { name: 'Cabinets', slug: 'cabinets', description: 'Display cabinets, sideboards, and storage units' },
      { name: 'Doors', slug: 'doors', description: 'Custom wooden doors for interior and exterior' },
      { name: 'Modular Kitchen', slug: 'modular-kitchen', description: 'Complete modular kitchen solutions' },
      { name: 'Custom Furniture', slug: 'custom-furniture', description: 'Bespoke furniture made to your specifications' }
    ])
    console.log('Categories created')

    const categoryMap = {}
    categories.forEach(c => categoryMap[c.slug] = c._id)

    const products = await Product.insertMany([
      {
        category: categoryMap.beds,
        name: 'Solid Teak King Size Bed',
        slug: 'solid-teak-king-size-bed',
        description: 'Handcrafted from premium teak wood with intricate carving. Features a sturdy frame and elegant headboard design.',
        price: 85000,
        discountPrice: 78000,
        material: 'Teak Wood',
        dimensions: '78" x 80" x 48"',
        availabilityStatus: 'in_stock',
        isActive: true,
        isFeatured: true,
        media: [
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-bed-1.jpg', publicId: 'placeholder-bed-1', altText: 'Solid Teak King Size Bed - Front View', sortOrder: 0 },
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-bed-2.jpg', publicId: 'placeholder-bed-2', altText: 'Solid Teak King Size Bed - Side View', sortOrder: 1 },
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-bed-3.jpg', publicId: 'placeholder-bed-3', altText: 'Solid Teak King Size Bed - Detail View', sortOrder: 2 }
        ]
      },
      {
        category: categoryMap.beds,
        name: 'Sheesham Queen Bed with Storage',
        slug: 'sheesham-queen-bed-storage',
        description: 'Beautiful sheesham wood bed with built-in hydraulic storage. Perfect for maximizing bedroom space.',
        price: 55000,
        material: 'Sheesham Wood',
        dimensions: '66" x 78" x 46"',
        availabilityStatus: 'in_stock',
        isActive: true,
        isFeatured: true,
        media: [
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-bed-queen-1.jpg', publicId: 'placeholder-bed-queen-1', altText: 'Sheesham Queen Bed - Front View', sortOrder: 0 },
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-bed-queen-2.jpg', publicId: 'placeholder-bed-queen-2', altText: 'Sheesham Queen Bed - Storage View', sortOrder: 1 }
        ]
      },
      {
        category: categoryMap.sofas,
        name: 'Chesterfield 3-Seater Sofa',
        slug: 'chesterfield-3-seater-sofa',
        description: 'Classic chesterfield design with deep button tufting. Upholstered in premium fabric over solid wood frame.',
        price: 95000,
        discountPrice: 88000,
        material: 'Teak Wood Frame, Premium Fabric',
        dimensions: '84" x 36" x 32"',
        availabilityStatus: 'in_stock',
        isActive: true,
        isFeatured: true,
        media: [
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-sofa-1.jpg', publicId: 'placeholder-sofa-1', altText: 'Chesterfield 3-Seater Sofa - Front View', sortOrder: 0 },
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-sofa-2.jpg', publicId: 'placeholder-sofa-2', altText: 'Chesterfield 3-Seater Sofa - Detail View', sortOrder: 1 }
        ]
      },
      {
        category: categoryMap.sofas,
        name: 'L-Shaped Sectional Sofa',
        slug: 'l-shaped-sectional-sofa',
        description: 'Spacious L-shaped sectional with chaise. Perfect for large living rooms. Customizable fabric options.',
        price: 135000,
        material: 'Sal Wood Frame, Custom Fabric',
        dimensions: '120" x 90" x 34"',
        availabilityStatus: 'in_stock',
        isActive: true,
        isFeatured: true,
        media: [
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-sectional-1.jpg', publicId: 'placeholder-sectional-1', altText: 'L-Shaped Sectional - Full View', sortOrder: 0 },
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-sectional-2.jpg', publicId: 'placeholder-sectional-2', altText: 'L-Shaped Sectional - Chaise Detail', sortOrder: 1 }
        ]
      },
      {
        category: categoryMap.tables,
        name: 'Solid Wood Dining Table 6-Seater',
        slug: 'solid-wood-dining-table-6-seater',
        description: 'Sturdy dining table for 6 people. Smooth finish with natural wood grain visible.',
        price: 45000,
        discountPrice: 41000,
        material: 'Sheesham Wood',
        dimensions: '72" x 36" x 30"',
        availabilityStatus: 'in_stock',
        isActive: true,
        isFeatured: true,
        media: [
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-dining-1.jpg', publicId: 'placeholder-dining-1', altText: '6-Seater Dining Table - Top View', sortOrder: 0 },
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-dining-2.jpg', publicId: 'placeholder-dining-2', altText: '6-Seater Dining Table - Leg Detail', sortOrder: 1 }
        ]
      },
      {
        category: categoryMap.tables,
        name: 'Extendable Dining Table 8-10 Seater',
        slug: 'extendable-dining-table-8-10-seater',
        description: 'Ingenious extendable mechanism. Seats 8 normally, extends to seat 10 for gatherings.',
        price: 78000,
        material: 'Teak Wood',
        dimensions: '78" x 42" x 30" (Extended: 110" x 42")',
        availabilityStatus: 'in_stock',
        isActive: true,
        isFeatured: true,
        media: [
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-extendable-1.jpg', publicId: 'placeholder-extendable-1', altText: 'Extendable Table - Closed', sortOrder: 0 },
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-extendable-2.jpg', publicId: 'placeholder-extendable-2', altText: 'Extendable Table - Extended', sortOrder: 1 }
        ]
      },
      {
        category: categoryMap.wardrobes,
        name: '3-Door Sliding Wardrobe',
        slug: '3-door-sliding-wardrobe',
        description: 'Spacious wardrobe with smooth sliding doors. Includes hanging rods, shelves, and drawers.',
        price: 75000,
        discountPrice: 68000,
        material: 'Teak Wood, Mirror Doors',
        dimensions: '72" x 24" x 84"',
        availabilityStatus: 'in_stock',
        isActive: true,
        isFeatured: true,
        media: [
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-wardrobe-1.jpg', publicId: 'placeholder-wardrobe-1', altText: '3-Door Sliding Wardrobe - Closed', sortOrder: 0 },
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-wardrobe-2.jpg', publicId: 'placeholder-wardrobe-2', altText: '3-Door Sliding Wardrobe - Open', sortOrder: 1 }
        ]
      },
      {
        category: categoryMap.cabinets,
        name: 'TV Unit with Storage',
        slug: 'tv-unit-with-storage',
        description: 'Modern TV unit with open shelves and closed storage. Cable management included.',
        price: 28000,
        discountPrice: 25000,
        material: 'Mango Wood',
        dimensions: '60" x 16" x 20"',
        availabilityStatus: 'in_stock',
        isActive: true,
        isFeatured: true,
        media: [
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-tvunit-1.jpg', publicId: 'placeholder-tvunit-1', altText: 'TV Unit - Front View', sortOrder: 0 },
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-tvunit-2.jpg', publicId: 'placeholder-tvunit-2', altText: 'TV Unit - Storage Detail', sortOrder: 1 }
        ]
      },
      {
        category: categoryMap.doors,
        name: 'Carved Main Entrance Door',
        slug: 'carved-main-entrance-door',
        description: 'Grand entrance door with intricate hand carving. Includes frame and hardware.',
        price: 65000,
        material: 'Teak Wood',
        dimensions: '36" x 84" x 2.5"',
        availabilityStatus: 'made_to_order',
        isActive: true,
        isFeatured: true,
        media: [
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-door-1.jpg', publicId: 'placeholder-door-1', altText: 'Carved Main Door - Front View', sortOrder: 0 },
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-door-2.jpg', publicId: 'placeholder-door-2', altText: 'Carved Main Door - Carving Detail', sortOrder: 1 }
        ]
      },
      {
        category: categoryMap['modular-kitchen'],
        name: 'L-Shaped Modular Kitchen',
        slug: 'l-shaped-modular-kitchen',
        description: 'Complete L-shaped modular kitchen with soft-close drawers, pull-outs, and accessories.',
        price: 250000,
        discountPrice: 230000,
        material: 'Marine Ply, Acrylic Finish',
        dimensions: 'Custom Dimensions',
        availabilityStatus: 'made_to_order',
        isActive: true,
        isFeatured: true,
        media: [
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-kitchen-1.jpg', publicId: 'placeholder-kitchen-1', altText: 'L-Shaped Modular Kitchen - Full View', sortOrder: 0 },
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-kitchen-2.jpg', publicId: 'placeholder-kitchen-2', altText: 'L-Shaped Modular Kitchen - Interior', sortOrder: 1 }
        ]
      },
      {
        category: categoryMap['custom-furniture'],
        name: 'Custom Built-in Bookshelf',
        slug: 'custom-builtin-bookshelf',
        description: 'Floor-to-ceiling bookshelf designed for your space. Adjustable shelves and optional lighting.',
        price: 45000,
        material: 'Teak Wood',
        dimensions: 'Custom Dimensions',
        availabilityStatus: 'made_to_order',
        isActive: true,
        isFeatured: true,
        media: [
          { mediaType: 'image', mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-bookshelf-1.jpg', publicId: 'placeholder-bookshelf-1', altText: 'Custom Bookshelf - Design View', sortOrder: 0 }
        ]
      }
    ])
    console.log('Products created')

    const productIds = products.map(p => p._id)

    await Inquiry.insertMany([
      { product: productIds[0], customerName: 'Rajesh Kumar', customerPhone: '+91-9876543210', customerEmail: 'rajesh@example.com', message: 'Interested in the Solid Teak King Size Bed. Would like to know delivery timeline to Bangalore.', status: 'new' },
      { product: productIds[2], customerName: 'Priya Sharma', customerPhone: '+91-9876543211', customerEmail: 'priya@example.com', message: 'Looking for the Chesterfield sofa in a different fabric. Can you customize?', status: 'contacted' },
      { product: productIds[4], customerName: 'Amit Patel', customerPhone: '+91-9876543212', message: 'Need 6-seater dining table with 4 chairs. What is the total price?', status: 'in_progress' },
      { product: productIds[6], customerName: 'Sunita Reddy', customerPhone: '+91-9876543213', customerEmail: 'sunita@example.com', message: 'Want to see the 3-door wardrobe in person. Do you have a showroom in Hyderabad?', status: 'completed' },
      { customerName: 'Vikram Singh', customerPhone: '+91-9876543214', customerEmail: 'vikram@example.com', message: 'Interested in custom modular kitchen for my new apartment. Please contact for consultation.', status: 'new' }
    ])
    console.log('Inquiries created')

    await BusinessSettings.create({
      _id: 1,
      businessName: 'Carpenter Furniture Store',
      phone: '+91-9876543210',
      whatsappNumber: '919876543210',
      email: 'info@carpenterfurniture.com',
      address: '123 Furniture Lane, Industrial Area, Bangalore - 560001, Karnataka, India',
      aboutText: 'Established in 1995, Carpenter Furniture Store has been crafting premium handcrafted furniture for over 25 years. We combine traditional woodworking techniques with modern design to create timeless pieces that last generations. Our master carpenters use only the finest sustainably sourced woods including teak, sheesham, mango, and acacia. Every piece is made with attention to detail and built to withstand the test of time.',
      facebookUrl: 'https://facebook.com/carpenterfurniture',
      instagramUrl: 'https://instagram.com/carpenterfurniture',
      youtubeUrl: 'https://youtube.com/carpenterfurniture'
    })
    console.log('Business settings created')

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (adminEmail && adminPassword) {
      if (adminPassword.length < 8) {
        throw new Error('ADMIN_PASSWORD must be at least 8 characters')
      }

      const passwordHash = await bcrypt.hash(adminPassword, 12)
      await Admin.findOneAndUpdate(
        { email: adminEmail.toLowerCase() },
        {
          name: process.env.ADMIN_NAME || 'Admin',
          email: adminEmail.toLowerCase(),
          passwordHash
        },
        { upsert: true, new: true }
      )
      console.log(`Admin account seeded for ${adminEmail}`)
    } else {
      console.log('Skipping admin creation: set ADMIN_EMAIL and ADMIN_PASSWORD, or run npm run create-admin')
    }

    console.log('\nSeed completed successfully!')

  } catch (error) {
    console.error('Seed failed:', error)
  } finally {
    await mongoose.connection.close()
    process.exit(0)
  }
}

seed()