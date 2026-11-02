import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/carpenter_store',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  
  admin: {
    phone: process.env.ADMIN_PHONE || '',
    whatsapp: process.env.ADMIN_WHATSAPP || ''
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'production' ? 300 : 2000
  },
  
  upload: {
    maxFileSize: 10 * 1024 * 1024,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedVideoTypes: ['video/mp4', 'video/webm', 'video/quicktime']
  }
}

export function validateConfig() {
  const required = [
    'db.uri',
    'jwt.secret'
  ]
  
  const missing = []
  
  for (const key of required) {
    const value = key.split('.').reduce((obj, k) => obj?.[k], config)
    if (!value || (typeof value === 'string' && (value.includes('your_') || value.includes('change_in')))) {
      missing.push(key)
    }
  }
  
  const cloudinaryMissing = !config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret

  if (missing.length > 0) {
    console.warn('[config] Missing or default configuration values:', missing.join(', '))
  }

  if (cloudinaryMissing) {
    console.warn('[config] Cloudinary not configured - media uploads will not work')
  }

  if (config.nodeEnv === 'production' && (missing.length > 0 || cloudinaryMissing)) {
    const problems = [...missing]
    if (cloudinaryMissing) problems.push('cloudinary')
    throw new Error(`Missing required production configuration: ${problems.join(', ')}`)
  }

  return missing.length === 0 && !cloudinaryMissing
}