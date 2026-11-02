import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { config } from './config/index.js'
import { globalRateLimit } from './middleware/rateLimiter.js'
import { sanitizeInput } from './middleware/validation.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

import publicRoutes from './routes/publicRoutes.js'
import adminAuthRoutes from './routes/adminAuthRoutes.js'
import adminProductRoutes from './routes/adminProductRoutes.js'
import adminCategoryRoutes from './routes/adminCategoryRoutes.js'
import adminInquiryRoutes from './routes/adminInquiryRoutes.js'
import adminDashboardRoutes from './routes/adminDashboardRoutes.js'
import adminSettingsRoutes from './routes/adminSettingsRoutes.js'

const app = express()

if (config.nodeEnv === 'production') {
  app.set('trust proxy', 1)
}

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}))

const allowedOrigins = [
  'http://localhost:5173',
  'https://carpenter-furniture-store-6x3w.vercel.app'
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(null, true) // allow all origins in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
app.use(sanitizeInput)
app.use(globalRateLimit)

app.use('/api', publicRoutes)
app.use('/api/admin/auth', adminAuthRoutes)
app.use('/api/admin/products', adminProductRoutes)
app.use('/api/admin/categories', adminCategoryRoutes)
app.use('/api/admin/inquiries', adminInquiryRoutes)
app.use('/api/admin/dashboard', adminDashboardRoutes)
app.use('/api/admin/settings', adminSettingsRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app