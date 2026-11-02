import { Router } from 'express'
import { adminLogin, adminLogout, getMe } from '../controllers/authController.js'
import { adminLoginValidator } from '../validators/adminValidators.js'
import { validate } from '../middleware/validation.js'
import { authenticateToken } from '../middleware/auth.js'
import { authRateLimit } from '../middleware/rateLimiter.js'

const router = Router()

router.post('/login', authRateLimit, adminLoginValidator, validate, adminLogin)
router.post('/logout', authenticateToken, adminLogout)
router.get('/me', authenticateToken, getMe)

export default router
