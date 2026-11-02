import { body, param, query } from 'express-validator'

const OPTIONAL = { values: 'falsy' }

export const adminLoginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
]

export const adminCreateValidator = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain number')
]

export const categoryValidator = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('slug').optional(OPTIONAL).trim().isSlug().withMessage('Slug must be URL-friendly'),
  body('description').optional(OPTIONAL).trim().isLength({ max: 1000 }).withMessage('Description max 1000 characters')
]

export const productValidator = [
  body('category_id').optional(OPTIONAL).isMongoId().withMessage('Valid category ID required'),
  body('name').optional(OPTIONAL).trim().isLength({ min: 2, max: 200 }).withMessage('Name must be 2-200 characters'),
  body('slug').optional(OPTIONAL).trim().isSlug().withMessage('Slug must be URL-friendly'),
  body('description').optional(OPTIONAL).trim().isLength({ max: 5000 }).withMessage('Description max 5000 characters'),
  body('price').optional(OPTIONAL).isFloat({ min: 0 }).withMessage('Price must be positive number'),
  body('discount_price').optional({ nullable: true, values: 'falsy' }).isFloat({ min: 0 }).withMessage('Discount price must be positive'),
  body('material').optional(OPTIONAL).trim().isLength({ max: 200 }).withMessage('Material max 200 characters'),
  body('dimensions').optional(OPTIONAL).trim().isLength({ max: 200 }).withMessage('Dimensions max 200 characters'),
  body('availability_status').optional(OPTIONAL).isIn(['in_stock', 'out_of_stock', 'limited', 'made_to_order'])
    .withMessage('Invalid availability status'),
  body('is_active').optional(OPTIONAL).isIn(['true', 'false', '1', '0', true, false]).withMessage('is_active must be boolean'),
  body('is_featured').optional(OPTIONAL).isIn(['true', 'false', '1', '0', true, false]).withMessage('is_featured must be boolean')
]

export const productMediaValidator = [
  body('media_type').optional(OPTIONAL).isIn(['image', 'video']).withMessage('Media type must be image or video'),
  body('alt_text').optional(OPTIONAL).trim().isLength({ max: 255 }).withMessage('Alt text max 255 characters'),
  body('sort_order').optional(OPTIONAL).isInt({ min: 0 }).withMessage('Sort order must be non-negative integer')
]

export const inquiryValidator = [
  body('product_id').optional({ nullable: true, values: 'falsy' }).isMongoId().withMessage('Invalid product ID'),
  body('customer_name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('customer_phone').trim().matches(/^[+]?[0-9][0-9\s\-()]{6,19}$/)
    .withMessage('Valid phone number required'),
  body('customer_email').optional({ nullable: true, values: 'falsy' }).isEmail().normalizeEmail().withMessage('Valid email if provided'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters')
]

export const inquiryStatusValidator = [
  body('status').isIn(['new', 'contacted', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  body('admin_notes').optional(OPTIONAL).trim().isLength({ max: 1000 }).withMessage('Notes max 1000 characters')
]

export const settingsValidator = [
  body('business_name').optional(OPTIONAL).trim().isLength({ min: 2, max: 200 }).withMessage('Business name 2-200 characters'),
  body('phone').optional(OPTIONAL).trim().matches(/^[+]?[0-9][0-9\s\-()]{6,19}$/)
    .withMessage('Valid phone number'),
  body('whatsapp_number').optional(OPTIONAL).trim().matches(/^[0-9]{10,15}$/).withMessage('WhatsApp number digits only'),
  body('email').optional(OPTIONAL).isEmail().normalizeEmail().withMessage('Valid email'),
  body('address').optional(OPTIONAL).trim().isLength({ max: 500 }).withMessage('Address max 500 characters'),
  body('about_text').optional(OPTIONAL).trim().isLength({ max: 3000 }).withMessage('About text max 3000 characters'),
  body('facebook_url').optional(OPTIONAL).trim().isURL().withMessage('Valid Facebook URL'),
  body('instagram_url').optional(OPTIONAL).trim().isURL().withMessage('Valid Instagram URL'),
  body('youtube_url').optional(OPTIONAL).trim().isURL().withMessage('Valid YouTube URL')
]

export const paginationValidator = [
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit 1-100'),
  query('sort').optional().trim().isIn(['name', 'price', 'createdAt', 'updatedAt', 'created_at', 'updated_at']).withMessage('Invalid sort field'),
  query('order').optional().trim().toLowerCase().isIn(['asc', 'desc']).withMessage('Order must be asc or desc')
]

export const productFilterValidator = [
  query('category').optional().trim().isSlug().withMessage('Invalid category slug'),
  query('min_price').optional().isFloat({ min: 0 }).toFloat().withMessage('Min price must be positive'),
  query('max_price').optional().isFloat({ min: 0 }).toFloat().withMessage('Max price must be positive'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search max 100 characters'),
  query('availability').optional().isIn(['in_stock', 'out_of_stock', 'limited', 'made_to_order']).withMessage('Invalid availability'),
  query('featured').optional().isBoolean().withMessage('Featured must be boolean')
]

export const idParamValidator = (field = 'id') => [
  param(field).isMongoId().withMessage(`${field} must be a valid ID`)
]

export const slugParamValidator = (field = 'slug') => [
  param(field).trim().isSlug().withMessage(`${field} must be valid slug`)
]
