import {
  findInquiries,
  findInquiryById,
  updateInquiryStatus,
  getInquiryStats
} from '../models/Inquiry.js'
import { asyncHandler, NotFoundError, ValidationError } from '../middleware/errorHandler.js'
import { serializeInquiry } from '../models/serializers.js'

const ALLOWED_STATUSES = ['new', 'contacted', 'in_progress', 'completed', 'cancelled']

export const getAdminInquiries = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    product_id,
    productId,
    search,
    sort = 'created_at',
    order = 'DESC'
  } = req.query

  const result = await findInquiries({
    page: parseInt(page, 10),
    limit: Math.min(parseInt(limit, 10), 100),
    status,
    productId: product_id || productId || undefined,
    search,
    sort,
    order
  })

  res.json({
    success: true,
    data: {
      inquiries: result.inquiries.map(serializeInquiry),
      pagination: result.pagination
    }
  })
})

export const getAdminInquiryById = asyncHandler(async (req, res) => {
  const inquiry = await findInquiryById(req.params.id)

  if (!inquiry) {
    throw new NotFoundError('Inquiry')
  }

  res.json({
    success: true,
    data: serializeInquiry(inquiry)
  })
})

export const updateAdminInquiryStatus = asyncHandler(async (req, res) => {
  const { status, admin_notes } = req.body

  if (!ALLOWED_STATUSES.includes(status)) {
    throw new ValidationError(`Status must be one of: ${ALLOWED_STATUSES.join(', ')}`)
  }

  const inquiry = await findInquiryById(req.params.id)
  if (!inquiry) {
    throw new NotFoundError('Inquiry')
  }

  const updated = await updateInquiryStatus(req.params.id, status, admin_notes)

  res.json({
    success: true,
    message: 'Inquiry updated successfully',
    data: serializeInquiry(updated)
  })
})

export const getAdminInquiryStats = asyncHandler(async (req, res) => {
  const stats = await getInquiryStats()

  res.json({
    success: true,
    data: stats
  })
})
