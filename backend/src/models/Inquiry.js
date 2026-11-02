import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 191
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in_progress', 'completed', 'cancelled'],
    default: 'new'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

inquirySchema.index({ product: 1 })
inquirySchema.index({ status: 1 })
inquirySchema.index({ created_at: -1 })
inquirySchema.index({ customerPhone: 1 })
inquirySchema.index({ customerName: 'text', customerPhone: 'text', message: 'text' })

inquirySchema.virtual('productDetails', {
  ref: 'Product',
  localField: 'product',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name price slug' }
})

inquirySchema.set('toJSON', { virtuals: true })
inquirySchema.set('toObject', { virtuals: true })

const Inquiry = mongoose.model('Inquiry', inquirySchema)

const PRODUCT_FIELDS = 'name price slug'

function normalizeSort(sort) {
  const map = {
    created_at: 'created_at',
    createdAt: 'created_at',
    updated_at: 'updated_at',
    updatedAt: 'updated_at',
    customerName: 'customerName',
    customer_name: 'customerName',
    status: 'status'
  }
  return map[sort] || 'created_at'
}

export async function createInquiry(inquiryData) {
  const { product, customerName, customerPhone, customerEmail, message } = inquiryData

  const inquiry = await Inquiry.create({
    product: product || null,
    customerName,
    customerPhone,
    customerEmail: customerEmail || null,
    message
  })

  return Inquiry.findById(inquiry._id).populate('product', PRODUCT_FIELDS).lean()
}

export async function findInquiryById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null
  return Inquiry.findById(id).populate('product', PRODUCT_FIELDS).lean()
}

export async function findInquiries(options = {}) {
  const {
    page = 1,
    limit = 20,
    status,
    productId,
    search,
    sort = 'created_at',
    order = 'DESC'
  } = options

  const query = {}

  if (status) query.status = status
  if (productId) query.product = productId
  if (search) {
    query.$or = [
      { customerName: { $regex: search, $options: 'i' } },
      { customerPhone: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } }
    ]
  }

  const sortField = normalizeSort(sort)
  const sortOrder = String(order).toUpperCase() === 'ASC' ? 1 : -1
  const sortObj = { [sortField]: sortOrder }

  const skip = (page - 1) * limit

  const [inquiries, total] = await Promise.all([
    Inquiry.find(query)
      .populate('product', PRODUCT_FIELDS)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean(),
    Inquiry.countDocuments(query)
  ])

  return {
    inquiries,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export async function updateInquiryStatus(id, status, adminNotes = null) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null

  const update = { status }
  if (adminNotes !== null && adminNotes !== undefined) update.adminNotes = adminNotes

  return Inquiry.findByIdAndUpdate(id, update, { new: true })
    .populate('product', PRODUCT_FIELDS)
    .lean()
}

export async function getInquiryStats() {
  const stats = await Inquiry.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
        contacted: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
        in_progress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
      }
    }
  ])

  return stats[0] || {
    total: 0,
    new: 0,
    contacted: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0
  }
}

export async function getRecentInquiries(limit = 5) {
  return Inquiry.find()
    .populate('product', PRODUCT_FIELDS)
    .sort({ created_at: -1 })
    .limit(limit)
    .lean()
}

export default Inquiry
