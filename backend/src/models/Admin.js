import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 191
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})


adminSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash)
}

adminSchema.statics.hashPassword = async function(password) {
  return bcrypt.hash(password, 12)
}

adminSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash
    delete ret.__v
    return ret
  }
})

const Admin = mongoose.model('Admin', adminSchema)

export async function findAdminByEmail(email) {
  return Admin.findOne({ email }).select('+passwordHash').lean()
}

export async function findAdminById(id) {
  return Admin.findById(id).lean()
}

export async function createAdmin({ name, email, password }) {
  const passwordHash = await Admin.hashPassword(password)
  const admin = await Admin.create({ name, email, passwordHash })
  return admin.toObject()
}

export async function verifyAdminPassword(admin, password) {
  return bcrypt.compare(password, admin.passwordHash)
}

export async function updateAdminPassword(id, newPassword) {
  const passwordHash = await Admin.hashPassword(newPassword)
  return Admin.findByIdAndUpdate(id, { passwordHash }, { new: true }).select('-passwordHash').lean()
}

export default Admin