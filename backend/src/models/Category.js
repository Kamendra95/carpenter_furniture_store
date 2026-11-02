import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 120,
    match: /^[a-z0-9-]+$/
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

categorySchema.index({ name: 1 })

categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
})

categorySchema.set('toJSON', { virtuals: true })
categorySchema.set('toObject', { virtuals: true })

const Category = mongoose.model('Category', categorySchema)

export async function findAllCategories(includeCount = false) {
  const query = Category.find().sort({ name: 1 })
  if (includeCount) {
    return Category.aggregate([
      { $sort: { name: 1 } },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $addFields: {
          productCount: { $size: '$products' }
        }
      },
      {
        $project: { products: 0 }
      }
    ])
  }
  return query.lean()
}

export async function findCategoryById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null
  return Category.findById(id).lean()
}

export async function findCategoryBySlug(slug) {
  return Category.findOne({ slug }).lean()
}

export async function createCategory({ name, slug, description }) {
  const category = await Category.create({ name, slug, description: description || null })
  return category.toObject()
}

export async function updateCategory(id, { name, slug, description }) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null
  const category = await Category.findByIdAndUpdate(
    id,
    { name, slug, description: description || null },
    { new: true, runValidators: true }
  ).lean()
  return category
}

export async function deleteCategory(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null
  const productCount = await mongoose.model('Product').countDocuments({ category: id })
  if (productCount > 0) {
    throw new Error('Cannot delete category with associated products')
  }
  return Category.findByIdAndDelete(id)
}

export async function getCategoryProductCount(categoryId) {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) return 0
  return mongoose.model('Product').countDocuments({ category: categoryId, isActive: true })
}

export default Category