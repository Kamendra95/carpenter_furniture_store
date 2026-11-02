import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import Admin from '../models/Admin.js'

function getRequestToken(req) {
  const authHeader = req.headers['authorization']
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  return req.cookies?.admin_token || null
}

export async function authenticateToken(req, res, next) {
  const token = getRequestToken(req)

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    })
  }
  
  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    
    const admin = await Admin.findById(decoded.id).lean()
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found'
      })
    }
    
    req.admin = admin
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      })
    }
    
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    })
  }
}

export function optionalAuth(req, res, next) {
  const token = getRequestToken(req)

  if (!token) {
    return next()
  }
  
  try {
    const decoded = jwt.verify(token, config.jwt.secret)
    req.adminId = decoded.id
  } catch {
  }
  
  next()
}

export function generateToken(admin) {
  return jwt.sign(
    { id: admin._id.toString(), email: admin.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  )
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret)
}