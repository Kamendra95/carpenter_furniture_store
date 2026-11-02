import {
  findProducts,
  findProductById,
  findProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  addProductMedia,
  addManyProductMedia,
  removeProductMedia,
  removeProductMediaByIds,
  isMediaReferencedElsewhere
} from '../models/Product.js'
import { findCategoryById } from '../models/Category.js'
import { cloudinaryUpload, cloudinaryDelete } from '../config/cloudinary.js'
import { asyncHandler, NotFoundError, ConflictError, ValidationError } from '../middleware/errorHandler.js'
import { serializeProduct, serializeMedia } from '../models/serializers.js'

const MAX_MEDIA_FILES = 10
const MEDIA_FOLDER = 'carpenter-furniture/products'

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback
  if (typeof value === 'boolean') return value
  return ['true', '1', 'on', 'yes'].includes(String(value).toLowerCase())
}

function parseNumber(value, fallback = undefined) {
  if (value === undefined || value === null || value === '') {
    return value === null || value === '' ? null : fallback
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseIdList(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)

  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed.filter(Boolean)
  } catch {
  }

  return String(value).split(',').map(item => item.trim()).filter(Boolean)
}

function safePublicId(name, index) {
  const base = String(name || 'media')
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'media'

  return `${Date.now()}-${index}-${base}`
}

async function uploadFiles(files = [], productName = '', startOrder = 0) {
  const uploaded = []

  for (let index = 0; index < files.length; index++) {
    const file = files[index]
    const isVideo = file.mimetype.startsWith('video/')

    try {
      const result = await cloudinaryUpload(file.buffer, {
        folder: MEDIA_FOLDER,
        resource_type: isVideo ? 'video' : 'image',
        public_id: safePublicId(file.originalname, startOrder + index)
      })

      uploaded.push({
        mediaType: isVideo ? 'video' : 'image',
        mediaUrl: result.secure_url,
        publicId: result.public_id,
        altText: productName ? `${productName} ${isVideo ? 'video' : 'image'}` : null,
        sortOrder: startOrder + index
      })
    } catch (error) {
      await cleanupUploaded(uploaded)
      throw new ValidationError(`Failed to upload ${file.originalname}: ${error.message}`)
    }
  }

  return uploaded
}

async function cleanupUploaded(mediaItems = []) {
  for (const item of mediaItems) {
    try {
      await cloudinaryDelete(item.publicId, item.mediaType)
    } catch (error) {
      console.error('Failed to clean up Cloudinary media:', item.publicId, error.message)
    }
  }
}

async function deleteCloudinaryMedia(mediaItems = [], excludeProductId) {
  for (const item of mediaItems) {
    const publicId = item.publicId || item.public_id
    const mediaType = item.mediaType || item.media_type || 'image'

    try {
      const referenced = await isMediaReferencedElsewhere(publicId, excludeProductId)
      if (!referenced) {
        await cloudinaryDelete(publicId, mediaType)
      }
    } catch (error) {
      console.error('Failed to delete Cloudinary media:', publicId, error.message)
    }
  }
}

function validateMediaCount(files = []) {
  if (files.length > MAX_MEDIA_FILES) {
    throw new ValidationError(`You can upload a maximum of ${MAX_MEDIA_FILES} files at once`)
  }
}

function buildProductData(body, current = null) {
  const has = key => Object.prototype.hasOwnProperty.call(body, key)
  const valueOrCurrent = (bodyKey, currentKey) => {
    if (has(bodyKey)) return body[bodyKey]
    return current ? current[currentKey] : undefined
  }

  const name = has('name') ? String(body.name).trim() : current?.name
  const slug = has('slug') ? String(body.slug).trim().toLowerCase() : current?.slug
  const price = has('price') ? parseNumber(body.price) : current?.price

  if (!name || String(name).length < 2) {
    throw new ValidationError('Product name must be at least 2 characters')
  }

  if (!slug) {
    throw new ValidationError('Product slug is required')
  }

  if (price === null || price === undefined || Number(price) < 0) {
    throw new ValidationError('Price must be a non-negative number')
  }

  const discountPrice = has('discount_price') || has('discountPrice')
    ? parseNumber(has('discount_price') ? body.discount_price : body.discountPrice)
    : current?.discount_price ?? null

  if (discountPrice !== null && discountPrice !== undefined && Number(discountPrice) >= Number(price)) {
    throw new ValidationError('Discount price must be less than the regular price')
  }

  return {
    name,
    slug,
    description: valueOrCurrent('description', 'description') ?? null,
    price: Number(price),
    discountPrice: discountPrice === null || discountPrice === undefined ? null : Number(discountPrice),
    material: valueOrCurrent('material', 'material') || null,
    dimensions: valueOrCurrent('dimensions', 'dimensions') || null,
    availabilityStatus: valueOrCurrent('availability_status', 'availability_status') || 'in_stock',
    isActive: has('is_active')
      ? parseBoolean(body.is_active, true)
      : current?.is_active ?? true,
    isFeatured: has('is_featured')
      ? parseBoolean(body.is_featured, false)
      : current?.is_featured ?? false
  }
}

export const getAdminProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    status,
    category,
    sort = 'created_at',
    order = 'DESC'
  } = req.query

  let isActive
  if (status === 'active') isActive = true
  else if (status === 'inactive') isActive = false

  const result = await findProducts({
    page: parseInt(page, 10),
    limit: Math.min(parseInt(limit, 10), 100),
    search,
    isActive,
    category,
    sort,
    order
  })

  res.json({
    success: true,
    data: {
      products: result.products.map(serializeProduct),
      pagination: result.pagination
    }
  })
})

export const getAdminProductById = asyncHandler(async (req, res) => {
  const product = await findProductById(req.params.id)

  if (!product) {
    throw new NotFoundError('Product')
  }

  res.json({
    success: true,
    data: serializeProduct(product)
  })
})

export const createAdminProduct = asyncHandler(async (req, res) => {
  const files = req.files || []
  validateMediaCount(files)

  const categoryId = req.body.category_id || req.body.categoryId
  const category = await findCategoryById(categoryId)
  if (!category) {
    throw new NotFoundError('Category')
  }

  const productData = buildProductData(req.body)
  const existingSlug = await findProductBySlug(productData.slug)
  if (existingSlug) {
    throw new ConflictError('A product with this slug already exists')
  }

  const uploaded = await uploadFiles(files, productData.name)
  let product = null

  try {
    product = await createProduct({ ...productData, category: category._id })

    if (uploaded.length) {
      await addManyProductMedia(product._id, uploaded)
    }

    const saved = await findProductById(product._id)

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: serializeProduct(saved)
    })
  } catch (error) {
    if (product) {
      try {
        await deleteProduct(product._id)
      } catch (cleanupError) {
        console.error('Failed to clean up product after upload error:', cleanupError.message)
      }
    }
    await cleanupUploaded(uploaded)
    throw error
  }
})

export const updateAdminProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  const existingRaw = await findProductById(id)

  if (!existingRaw) {
    throw new NotFoundError('Product')
  }

  const existing = serializeProduct(existingRaw)
  const files = req.files || []
  validateMediaCount(files)

  if (req.body.category_id || req.body.categoryId) {
    const categoryId = req.body.category_id || req.body.categoryId
    const category = await findCategoryById(categoryId)
    if (!category) {
      throw new NotFoundError('Category')
    }
  }

  const productData = buildProductData(req.body, existing)

  if (productData.slug !== existing.slug) {
    const slugOwner = await findProductBySlug(productData.slug)
    if (slugOwner && slugOwner._id.toString() !== existing.id) {
      throw new ConflictError('A product with this slug already exists')
    }
  }

  const removeIds = parseIdList(
    req.body.remove_media_ids ?? req.body.removeMediaIds ?? req.body.removed_media
  )

  const removedMedia = removeIds.length
    ? existingRaw.media.filter(item => removeIds.some(removeId => item._id.toString() === String(removeId)))
    : []

  const remainingMediaCount = Math.max(0, existing.media.length - removedMedia.length)
  if (remainingMediaCount + files.length > MAX_MEDIA_FILES) {
    throw new ValidationError(`A product can have at most ${MAX_MEDIA_FILES} media files`)
  }

  const uploaded = await uploadFiles(files, productData.name, existing.media.length)

  try {
    await updateProduct(id, {
      ...productData,
      category: req.body.category_id || req.body.categoryId || existing.category_id
    })

    if (removedMedia.length) {
      await removeProductMediaByIds(id, removedMedia.map(item => item._id.toString()))
    }

    if (uploaded.length) {
      await addManyProductMedia(id, uploaded)
    }

    await deleteCloudinaryMedia(removedMedia, id)

    const saved = await findProductById(id)

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: serializeProduct(saved)
    })
  } catch (error) {
    await cleanupUploaded(uploaded)
    throw error
  }
})

export const deleteAdminProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  const product = await findProductById(id)

  if (!product) {
    throw new NotFoundError('Product')
  }

  const media = product.media || []
  await deleteProduct(id)
  await deleteCloudinaryMedia(media, id)

  res.json({
    success: true,
    message: 'Product deleted successfully'
  })
})

export const updateAdminProductStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const product = await findProductById(id)

  if (!product) {
    throw new NotFoundError('Product')
  }

  const isActive = parseBoolean(req.body.is_active, !product.isActive)
  const updated = await updateProductStatus(id, isActive)
  const saved = await findProductById(updated._id)

  res.json({
    success: true,
    message: `Product ${isActive ? 'activated' : 'deactivated'} successfully`,
    data: serializeProduct(saved)
  })
})

export const uploadProductMedia = asyncHandler(async (req, res) => {
  const { id } = req.params
  const product = await findProductById(id)

  if (!product) {
    throw new NotFoundError('Product')
  }

  if (!req.file) {
    throw new ValidationError('No file uploaded')
  }

  if ((product.media?.length || 0) >= MAX_MEDIA_FILES) {
    throw new ValidationError(`A product can have at most ${MAX_MEDIA_FILES} media files`)
  }

  const isVideo = req.file.mimetype.startsWith('video/')
  const sortOrder = parseInt(req.body.sort_order, 10)
  const startOrder = Number.isFinite(sortOrder) ? sortOrder : product.media?.length || 0

  const uploaded = await uploadFiles([req.file], product.name, startOrder)
  const media = await addProductMedia(id, {
    ...uploaded[0],
    mediaType: req.body.media_type === 'video' || isVideo ? 'video' : 'image',
    altText: req.body.alt_text || uploaded[0].altText,
    sortOrder: startOrder
  })

  res.status(201).json({
    success: true,
    message: 'Media uploaded successfully',
    data: serializeMedia(media)
  })
})

export const deleteAdminProductMedia = asyncHandler(async (req, res) => {
  const { id, mediaId } = req.params

  const media = await removeProductMedia(id, mediaId)
  if (!media) {
    throw new NotFoundError('Media')
  }

  await deleteCloudinaryMedia([media], id)

  res.json({
    success: true,
    message: 'Media deleted successfully'
  })
})
