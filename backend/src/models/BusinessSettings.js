import mongoose from 'mongoose'

const businessSettingsSchema = new mongoose.Schema({
  _id: {
    type: Number,
    default: 1
  },
  businessName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    default: 'Carpenter Furniture Store'
  },
  logoUrl: {
    type: String,
    maxlength: 500
  },
  logoPublicId: {
    type: String,
    maxlength: 200
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
    default: ''
  },
  whatsappNumber: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
    default: ''
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 191,
    default: ''
  },
  address: {
    type: String,
    trim: true,
    maxlength: 500
  },
  aboutText: {
    type: String,
    trim: true,
    maxlength: 3000
  },
  facebookUrl: {
    type: String,
    trim: true,
    maxlength: 255
  },
  instagramUrl: {
    type: String,
    trim: true,
    maxlength: 255
  },
  youtubeUrl: {
    type: String,
    trim: true,
    maxlength: 255
  }
}, {
  timestamps: { createdAt: false, updatedAt: 'updated_at' },
  versionKey: false
})


const BusinessSettings = mongoose.model('BusinessSettings', businessSettingsSchema)

export async function getBusinessSettings() {
  let settings = await BusinessSettings.findById(1).lean()
  if (!settings) {
    settings = await BusinessSettings.create({ _id: 1 })
  }
  return settings
}

export async function getPublicBusinessSettings() {
  let settings = await BusinessSettings.findById(1).select('-logoPublicId').lean()
  if (!settings) {
    settings = await BusinessSettings.create({ _id: 1 })
  }
  return settings
}

export async function updateBusinessSettings(settingsData) {
  const current = await getBusinessSettings()

  const pick = (camelKey, snakeKey) => {
    if (settingsData[camelKey] !== undefined) return settingsData[camelKey]
    if (settingsData[snakeKey] !== undefined) return settingsData[snakeKey]
    return current[camelKey]
  }

  const update = {
    businessName: pick('businessName', 'business_name'),
    logoUrl: pick('logoUrl', 'logo_url') || null,
    logoPublicId: pick('logoPublicId', 'logo_public_id') || null,
    phone: pick('phone', 'phone'),
    whatsappNumber: pick('whatsappNumber', 'whatsapp_number'),
    email: pick('email', 'email'),
    address: pick('address', 'address') || null,
    aboutText: pick('aboutText', 'about_text') || null,
    facebookUrl: pick('facebookUrl', 'facebook_url') || null,
    instagramUrl: pick('instagramUrl', 'instagram_url') || null,
    youtubeUrl: pick('youtubeUrl', 'youtube_url') || null
  }

  const settings = await BusinessSettings.findByIdAndUpdate(
    1,
    update,
    { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
  ).lean()

  return settings
}

export default BusinessSettings