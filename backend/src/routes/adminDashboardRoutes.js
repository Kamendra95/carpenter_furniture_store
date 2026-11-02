import { Router } from 'express'
import { getAdminDashboardStats } from '../controllers/adminDashboardController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.use(authenticateToken)

router.get('/stats', getAdminDashboardStats)

export default router