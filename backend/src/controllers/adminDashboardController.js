import { getDashboardStats } from '../models/Dashboard.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats()
  
  res.json({
    success: true,
    data: stats
  })
})