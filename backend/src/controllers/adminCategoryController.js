import {
  findAllCategories,
  findCategoryById,
  findCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProductCount
} from '../models/Category.js'
import { asyncHandler, NotFoundError, ConflictError, ValidationError } from '../middleware/errorHandler.js'
import { serializeCategory } from '../models/serializers.js'

function buildSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const getAdminCategories = asyncHandler(async (req, res) => {
  const categories = await findAllCategories(true)

  res.json({
    success: true,
    data: categories.map(serializeCategory)
  })
})

export const getAdminCategoryById = asyncHandler(async (req, res) => {
  const category = await findCategoryById(req.params.id)

  if (!category) {
    throw new NotFoundError('Category')
  }

  const productCount = await getCategoryProductCount(category._id)

  res.json({
    success: true,
    data: serializeCategory({ ...category, productCount })
  })
})

export const createAdminCategory = asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim()
  const slug = buildSlug(req.body.slug || name)
  const description = req.body.description

  if (name.length < 2) {
    throw new ValidationError('Category name must be at least 2 characters')
  }

  if (!slug) {
    throw new ValidationError('Category slug is required')
  }

  const existingSlug = await findCategoryBySlug(slug)
  if (existingSlug) {
    throw new ConflictError('Category with this slug already exists')
  }

  const category = await createCategory({ name, slug, description })

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: serializeCategory(category)
  })
})

export const updateAdminCategory = asyncHandler(async (req, res) => {
  const category = await findCategoryById(req.params.id)

  if (!category) {
    throw new NotFoundError('Category')
  }

  const name = req.body.name !== undefined ? String(req.body.name).trim() : category.name
  const slug = buildSlug(req.body.slug || name)
  const description = req.body.description !== undefined ? req.body.description : category.description

  if (name.length < 2) {
    throw new ValidationError('Category name must be at least 2 characters')
  }

  if (!slug) {
    throw new ValidationError('Category slug is required')
  }

  if (slug !== category.slug) {
    const existingSlug = await findCategoryBySlug(slug)
    if (existingSlug && existingSlug._id.toString() !== category._id.toString()) {
      throw new ConflictError('Category with this slug already exists')
    }
  }

  const updated = await updateCategory(category._id, { name, slug, description })

  res.json({
    success: true,
    message: 'Category updated successfully',
    data: serializeCategory(updated)
  })
})

export const deleteAdminCategory = asyncHandler(async (req, res) => {
  const category = await findCategoryById(req.params.id)

  if (!category) {
    throw new NotFoundError('Category')
  }

  const productCount = await getCategoryProductCount(category._id)
  if (productCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete category with ${productCount} associated products. Move or delete products first.`,
      code: 'CATEGORY_HAS_PRODUCTS'
    })
  }

  await deleteCategory(category._id)

  res.json({
    success: true,
    message: 'Category deleted successfully'
  })
})
