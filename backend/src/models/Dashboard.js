import Product from './Product.js'
import Category from './Category.js'
import Inquiry from './Inquiry.js'
import { serializeProduct, serializeInquiry } from './serializers.js'

export async function getDashboardStats() {
  const [
    totalProducts,
    activeProducts,
    inactiveProducts,
    featuredProducts,
    categories,
    totalInquiries,
    newInquiries,
    recentProducts,
    recentInquiries
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: false }),
    Product.countDocuments({ isFeatured: true }),
    Category.countDocuments(),
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: 'new' }),
    Product.find()
      .populate('category', 'name slug')
      .sort({ created_at: -1 })
      .limit(5)
      .lean(),
    Inquiry.find()
      .populate('product', 'name price slug')
      .sort({ created_at: -1 })
      .limit(5)
      .lean()
  ])

  return {
    products: {
      total: totalProducts,
      active: activeProducts,
      inactive: inactiveProducts,
      featured: featuredProducts
    },
    categories: {
      total: categories
    },
    inquiries: {
      total: totalInquiries,
      new: newInquiries
    },
    recentProducts: (recentProducts || []).map(serializeProduct),
    recentInquiries: (recentInquiries || []).map(serializeInquiry)
  }
}
