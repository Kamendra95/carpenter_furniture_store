import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, MessageSquare, TrendingUp, Plus, CheckCircle, AlertCircle, ChevronRight, Tag, Star } from 'lucide-react'
import { formatPrice, formatDateTime } from '../../utils/helpers'
import { handleImageFallback } from '../../utils/imageFallback'
import api from '../../services/api'
import { useToast } from '../../context/ToastContext'

const statCards = [
  { title: 'Total Products', icon: Package, color: 'bg-blue-100 text-blue-600', key: 'total', section: 'products' },
  { title: 'Categories', icon: Tag, color: 'bg-indigo-100 text-indigo-600', key: 'total', section: 'categories' },
  { title: 'Active Products', icon: CheckCircle, color: 'bg-green-100 text-green-600', key: 'active', section: 'products' },
  { title: 'Featured Products', icon: Star, color: 'bg-amber-100 text-amber-600', key: 'featured', section: 'products' },
  { title: 'Total Inquiries', icon: MessageSquare, color: 'bg-purple-100 text-purple-600', key: 'total', section: 'inquiries' },
  { title: 'New Inquiries', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-600', key: 'new', section: 'inquiries' }
]

export default function AdminDashboard() {
  const { error } = useToast()
  const [stats, setStats] = useState(null)
  const [recentProducts, setRecentProducts] = useState([])
  const [recentInquiries, setRecentInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchDashboardData()
  }, [])
  
  const fetchDashboardData = async () => {
    try {
      const [statsRes, productsRes, inquiriesRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/products?limit=5&sort=created_at&order=DESC'),
        api.get('/admin/inquiries?limit=5&sort=created_at&order=DESC')
      ])
      
      setStats(statsRes.data.data)
      setRecentProducts(productsRes.data.data.products)
      setRecentInquiries(inquiriesRes.data.data.inquiries)
    } catch (err) {
      error('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 img-loading h-24" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6 img-loading h-64" />
          <div className="card p-6 img-loading h-64" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">Dashboard</h1>
          <p className="text-cream-600 mt-1">Overview of your furniture store</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products/new" className="btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {stats && statCards.map((card, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cream-600 font-medium">{card.title}</p>
                <p className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
                  {stats[card.section]?.[card.key] ?? 0}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm text-cream-500">
              <TrendingUp className="w-4 h-4" />
              <span>Updated {formatDateTime(new Date().toISOString())}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-6 border-b border-cream-200 flex items-center justify-between">
            <h2 className="font-semibold text-charcoal-900 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Recent Products
            </h2>
            <Link to="/admin/products" className="text-sm text-wood-700 hover:text-wood-800 font-medium flex items-center gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-cream-200">
            {recentProducts.length > 0 ? (
              recentProducts.map(product => (
                <Link key={product.id} to={`/admin/products/${product.id}/edit`} className="p-4 flex items-center gap-4 hover:bg-cream-50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-cream-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {product.media?.[0]?.media_url ? (
                      <img src={product.media[0].media_url} alt={product.name} className="w-full h-full object-cover" onError={handleImageFallback} />
                    ) : (
                      <Package className="w-6 h-6 text-cream-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-charcoal-900 truncate">{product.name}</h3>
                    <p className="text-sm text-cream-600">{product.category_name} {'\u00B7'} {formatPrice(product.price)}</p>
                  </div>
                  <span className={`badge ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-6 text-center text-cream-500">
                <Package className="w-12 h-12 mx-auto mb-2" />
                <p>No products yet</p>
                <Link to="/admin/products/new" className="btn-primary mt-4 inline-block">Add First Product</Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="card">
          <div className="p-6 border-b border-cream-200 flex items-center justify-between">
            <h2 className="font-semibold text-charcoal-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Recent Inquiries
            </h2>
            <Link to="/admin/inquiries" className="text-sm text-wood-700 hover:text-wood-800 font-medium flex items-center gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-cream-200">
            {recentInquiries.length > 0 ? (
              recentInquiries.map(inquiry => (
                <Link key={inquiry.id} to="/admin/inquiries" className="p-4 hover:bg-cream-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-charcoal-900">{inquiry.customer_name}</h3>
                        <span className={`badge ${inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' : inquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' : inquiry.status === 'in_progress' ? 'bg-purple-100 text-purple-800' : inquiry.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {inquiry.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      <p className="text-sm text-cream-600">{inquiry.product_name ? `Re: ${inquiry.product_name}` : 'General Inquiry'}</p>
                      <p className="text-sm text-cream-500 mt-1">{inquiry.customer_phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-cream-500">{formatDateTime(inquiry.created_at)}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-6 text-center text-cream-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-2" />
                <p>No inquiries yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}