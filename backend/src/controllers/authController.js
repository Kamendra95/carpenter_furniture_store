import { findAdminByEmail, verifyAdminPassword } from '../models/Admin.js'
import { generateToken } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { serializeAdmin } from '../models/serializers.js'
import { config } from '../config/index.js'

const COOKIE_NAME = 'admin_token'
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000

function cookieOptions() {
  const isProduction = config.nodeEnv === 'production'

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/'
  }
}

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const admin = await findAdminByEmail(email)
  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  }

  const isValid = await verifyAdminPassword(admin, password)
  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  }

  const token = generateToken(admin)
  res.cookie(COOKIE_NAME, token, cookieOptions())

  res.set('Cache-Control', 'no-store')

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      admin: serializeAdmin(admin)
    }
  })
})

export const adminLogout = asyncHandler(async (req, res) => {
  const options = cookieOptions()
  delete options.maxAge

  res.clearCookie(COOKIE_NAME, options)

  res.json({
    success: true,
    message: 'Logged out successfully'
  })
})

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: serializeAdmin(req.admin)
  })
})
