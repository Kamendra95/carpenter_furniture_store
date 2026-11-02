import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carpenter_store'

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 191 },
  passwordHash: { type: String, required: true, select: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

const Admin = mongoose.model('Admin', adminSchema)

async function createAdmin() {
  const args = process.argv.slice(2)
  const options = {}

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email') options.email = args[i + 1]
    if (args[i] === '--password') options.password = args[i + 1]
    if (args[i] === '--name') options.name = args[i + 1]
  }

  if (!options.email || !options.password || !options.name) {
    console.error('Usage: node create-admin.js --email admin@example.com --password "secure_password" --name "Admin Name"')
    process.exit(1)
  }

  if (options.password.length < 8) {
    console.error('Password must be at least 8 characters')
    process.exit(1)
  }

  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    const existing = await Admin.findOne({ email: options.email })
    if (existing) {
      console.error('Admin with this email already exists')
      process.exit(1)
    }

    const passwordHash = await bcrypt.hash(options.password, 12)
    const admin = await Admin.create({ name: options.name, email: options.email, passwordHash })

    console.log('✅ Admin created successfully!')
    console.log(`   ID: ${admin._id}`)
    console.log(`   Name: ${options.name}`)
    console.log(`   Email: ${options.email}`)
  } catch (error) {
    console.error('❌ Failed to create admin:', error.message)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
  }
}

createAdmin()