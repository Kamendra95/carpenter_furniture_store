import mongoose from 'mongoose'

const productMediaSchema = new mongoose.Schema({
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  mediaUrl: {
    type: String,
    required: true,
    maxlength: 500
  },
  publicId: {
    type: String,
    required: true,
    maxlength: 200
  },
  altText: {
    type: String,
    maxlength: 255
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
})

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 220,
    match: /^[a-z0-9-]+$/
  },
  description: {
    type: String,
    trim: true,
    maxlength: 5000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0,
    validate: {
      validator: function(value) {
        return !value || value < this.price
      },
      message: 'Discount price must be less than regular price'
    }
  },
  material: {
    type: String,
    trim: true,
    maxlength: 200
  },
  dimensions: {
    type: String,
    trim: true,
    maxlength: 200
  },
  availabilityStatus: {
    type: String,
    enum: ['in_stock', 'out_of_stock', 'limited', 'made_to_order'],
    default: 'in_stock'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  media: [productMediaSchema]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

productSchema.index({ category: 1 })
productSchema.index({ isActive: 1 })
productSchema.index({ isFeatured: 1 })
productSchema.index({ price: 1 })
productSchema.index({ created_at: -1 })
productSchema.index({ name: 'text', description: 'text' })

const Product = mongoose.model('Product', productSchema)

function normalizeSort(sort) {
  const map = {
    created_at: 'created_at',
    createdAt: 'created_at',
    updated_at: 'updated_at',
    updatedAt: 'updated_at',
    name: 'name',
    price: 'price'
  }
  return map[sort] || 'created_at'
}

export async function findProducts(options = {}) {
  const {
    page = 1,
    limit = 12,
    category,
    categoryId,
    minPrice,
    maxPrice,
    search,
    availability,
    featured,
    isActive,
    sort = 'created_at',
    order = 'DESC'
  } = options

  const query = {}

  if (typeof isActive === 'boolean') query.isActive = isActive

  if (categoryId) {
    query.category = categoryId
  } else if (category) {
    const cat = await mongoose.model('Category').findOne({ slug: category }).lean()
    if (!cat) {
      return {
        products: [],
        pagination: { page, limit, total: 0, totalPages: 0 }
      }
    }
    query.category = cat._id
  }

  if (minPrice !== undefined) query.price = { ...query.price, $gte: minPrice }
  if (maxPrice !== undefined) query.price = { ...query.price, $lte: maxPrice }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ]
  }

  if (availability) query.availabilityStatus = availability
  if (featured !== undefined) query.isFeatured = featured

  const sortField = normalizeSort(sort)
  const sortOrder = String(order).toUpperCase() === 'ASC' ? 1 : -1
  const sortObj = { [sortField]: sortOrder }

  const skip = (page - 1) * limit

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query)
  ])

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export async function findProductById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null
  return Product.findById(id).populate('category', 'name slug').lean()
}

export async function findProductBySlug(slug) {
  return Product.findOne({ slug }).populate('category', 'name slug').lean()
}

export async function findProductByIdOrSlug(idOrSlug) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    return findProductById(idOrSlug)
  }
  return findProductBySlug(idOrSlug)
}

export async function getProductMedia(productId) {
  if (!mongoose.Types.ObjectId.isValid(productId)) return []
  const product = await Product.findById(productId).select('media').lean()
  return (product?.media || []).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export async function createProduct(productData) {
  const {
    category,
    name,
    slug,
    description,
    price,
    discountPrice,
    material,
    dimensions,
    availabilityStatus,
    isActive,
    isFeatured
  } = productData

  const product = await Product.create({
    category,
    name,
    slug,
    description: description || null,
    price,
    discountPrice: discountPrice || null,
    material: material || null,
    dimensions: dimensions || null,
    availabilityStatus: availabilityStatus || 'in_stock',
    isActive: isActive !== false,
    isFeatured: isFeatured === true
  })

  return findProductById(product._id)
}

export async function updateProduct(id, productData) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null

  const {
    category,
    name,
    slug,
    description,
    price,
    discountPrice,
    material,
    dimensions,
    availabilityStatus,
    isActive,
    isFeatured
  } = productData

  const update = {}

  if (category !== undefined) update.category = category
  if (name !== undefined) update.name = name
  if (slug !== undefined) update.slug = slug
  if (description !== undefined) update.description = description
  if (price !== undefined) update.price = price
  if (discountPrice !== undefined) update.discountPrice = discountPrice
  if (material !== undefined) update.material = material
  if (dimensions !== undefined) update.dimensions = dimensions
  if (availabilityStatus !== undefined) update.availabilityStatus = availabilityStatus
  if (isActive !== undefined) update.isActive = isActive
  if (isFeatured !== undefined) update.isFeatured = isFeatured

  const product = await Product.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true
  }).populate('category', 'name slug').lean()

  return product
}

export async function deleteProduct(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null
  return Product.findByIdAndDelete(id)
}

export async function updateProductStatus(id, isActive) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null
  return Product.findByIdAndUpdate(id, { isActive }, { new: true })
    .populate('category', 'name slug')
    .lean()
}

export async function addProductMedia(productId, mediaData) {
  if (!mongoose.Types.ObjectId.isValid(productId)) return null

  const { mediaType, mediaUrl, publicId, altText, sortOrder = 0 } = mediaData

  const product = await Product.findByIdAndUpdate(
    productId,
    {
      $push: {
        media: {
          mediaType,
          mediaUrl,
          publicId,
          altText: altText || null,
          sortOrder
        }
      }
    },
    { new: true }
  ).lean()

  return product?.media?.slice(-1)[0] || null
}

export async function addManyProductMedia(productId, mediaItems) {
  if (!mongoose.Types.ObjectId.isValid(productId)) return []
  if (!mediaItems.length) return []

  const product = await Product.findByIdAndUpdate(
    productId,
    { $push: { media: { $each: mediaItems } } },
    { new: true }
  ).lean()

  return product?.media || []
}

export async function removeProductMedia(productId, mediaId) {
  if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(mediaId)) {
    return null
  }

  const product = await Product.findById(productId).lean()
  const media = product?.media?.find(item => item._id.toString() === mediaId.toString()) || null

  if (!media) return null

  await Product.findByIdAndUpdate(productId, { $pull: { media: { _id: mediaId } } })

  return media
}

export async function removeProductMediaByIds(productId, mediaIds) {
  if (!mongoose.Types.ObjectId.isValid(productId)) return []

  const validIds = mediaIds.filter(id => mongoose.Types.ObjectId.isValid(id))
  if (!validIds.length) return []

  const product = await Product.findById(productId).lean()
  const removed = (product?.media || []).filter(item =>
    validIds.some(id => item._id.toString() === id.toString())
  )

  if (!removed.length) return []

  await Product.findByIdAndUpdate(productId, {
    $pull: { media: { _id: { $in: validIds } } }
  })

  return removed
}

export async function isMediaReferencedElsewhere(publicId, excludeProductId) {
  if (!publicId) return false

  const query = { 'media.publicId': publicId }
  if (excludeProductId && mongoose.Types.ObjectId.isValid(excludeProductId)) {
    query._id = { $ne: excludeProductId }
  }

  const count = await Product.countDocuments(query)
  return count > 0
}

export async function getFeaturedProducts(limit = 8) {
  return Product.find({ isActive: true, isFeatured: true })
    .populate('category', 'name slug')
    .sort({ created_at: -1 })
    .limit(limit)
    .lean()
}

export async function getProductsByCategory(categorySlug, limit = 20) {
  const category = await mongoose.model('Category').findOne({ slug: categorySlug }).lean()
  if (!category) return []

  return Product.find({ isActive: true, category: category._id })
    .populate('category', 'name slug')
    .sort({ created_at: -1 })
    .limit(limit)
    .lean()
}

export async function searchProducts(searchTerm, limit = 20) {
  const term = searchTerm.trim()
  if (!term) return []

  return Product.find({
    isActive: true,
    $or: [
      { name: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } }
    ]
  })
    .populate('category', 'name slug')
    .sort({ created_at: -1 })
    .limit(limit)
    .lean()
}

export default Product
