import {
  findProducts,
  findProductByIdOrSlug,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts
} from '../models/Product.js'
import { findAllCategories, findCategoryBySlug } from '../models/Category.js'
import { asyncHandler, NotFoundError } from '../middleware/errorHandler.js'
import { serializeProduct, serializeCategory } from '../models/serializers.js'

export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    category_id,
    min_price,
    max_price,
    search,
    availability,
    featured,
    sort = 'created_at',
    order = 'DESC'
  } = req.query

  const result = await findProducts({
    page: parseInt(page, 10),
    limit: Math.min(parseInt(limit, 10), 50),
    category,
    categoryId: category_id,
    minPrice: min_price ? parseFloat(min_price) : undefined,
    maxPrice: max_price ? parseFloat(max_price) : undefined,
    search,
    availability,
    featured: featured === 'true' ? true : undefined,
    isActive: true,
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

export const getProductById = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params
  const product = await findProductByIdOrSlug(idOrSlug)

  if (!product || !product.isActive) {
    throw new NotFoundError('Product')
  }

  res.json({
    success: true,
    data: serializeProduct(product)
  })
})

export const getFeatured = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query
  const products = await getFeaturedProducts(parseInt(limit, 10))

  res.json({
    success: true,
    data: products.map(serializeProduct)
  })
})

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await findAllCategories(true)

  res.json({
    success: true,
    data: categories.map(serializeCategory)
  })
})

export const getCategoryProducts = asyncHandler(async (req, res) => {
  const { slug } = req.params
  const { limit = 20 } = req.query

  const category = await findCategoryBySlug(slug)
  if (!category) {
    throw new NotFoundError('Category')
  }

  const products = await getProductsByCategory(slug, parseInt(limit, 10))

  res.json({
    success: true,
    data: {
      category: serializeCategory(category),
      products: products.map(serializeProduct)
    }
  })
})

export const search = asyncHandler(async (req, res) => {
  const { q = '', limit = 20 } = req.query
  const products = await searchProducts(String(q), parseInt(limit, 10))

  res.json({
    success: true,
    data: products.map(serializeProduct)
  })
})
