import { Router } from 'express'
import { getProducts, getFeatured, getProductById, getCategories, getCategoryProducts } from '../controllers/productController.js'
import { createInquiryPublic } from '../controllers/inquiryController.js'
import { getPublicSettings } from '../controllers/settingsController.js'
import { paginationValidator, productFilterValidator, inquiryValidator } from '../validators/adminValidators.js'
import { validate } from '../middleware/validation.js'
import { inquiryRateLimit } from '../middleware/rateLimiter.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() })
})

router.get('/products', paginationValidator, productFilterValidator, validate, getProducts)
router.get('/products/featured', getFeatured)
router.get('/products/:idOrSlug', getProductById)

router.get('/categories', getCategories)
router.get('/categories/:slug/products', getCategoryProducts)

router.get('/settings/public', getPublicSettings)

router.post('/inquiries', inquiryRateLimit, inquiryValidator, validate, createInquiryPublic)

export default router