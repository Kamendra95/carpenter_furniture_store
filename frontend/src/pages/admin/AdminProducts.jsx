import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Edit, Eye, Trash2, X, Package } from 'lucide-react'
import { formatPrice, formatDate } from '../../utils/helpers'
import { handleImageFallback } from '../../utils/imageFallback'
import api from '../../services/api'
import Button from '../../components/Button'

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    sort: 'created_at',
    order: 'DESC'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [error, setError] = useState('')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: filters.sort,
        order: filters.order
      })

      if (filters.search) params.append('search', filters.search)
      if (filters.status) params.append('status', filters.status)
      if (filters.category) params.append('category', filters.category)

      const response = await api.get('/admin/products?' + params.toString())
      setProducts(response.data.data.products)
      setPagination(response.data.data.pagination)
    } catch (err) {
      console.error('Failed to load products:', err)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, filters])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories')
      setCategories(response.data.data)
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [fetchProducts])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return

    setDeletingId(id)
    setError('')
    try {
      await api.delete('/admin/products/' + id)
      await fetchProducts()
    } catch (err) {
      console.error('Failed to delete product:', err)
      setError(err.response?.data?.message || 'Failed to delete product. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleStatusToggle = async (product) => {
    setUpdatingId(product.id)
    setError('')
    try {
      await api.patch('/admin/products/' + product.id + '/status', {
        is_active: !product.is_active
      })
      await fetchProducts()
    } catch (err) {
      console.error('Failed to update product status:', err)
      setError(err.response?.data?.message || 'Failed to update product status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const clearFilters = () => {
    setFilters({ search: '', status: '', category: '', sort: 'created_at', order: 'DESC' })
  }

  const hasActiveFilters = filters.search || filters.status || filters.category

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">Products</h1>
          <p className="text-cream-600 mt-1">Manage your furniture catalog</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <X className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-cream-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && fetchProducts()}
                className="input pl-10"
              />
            </div>

            <select
              value={filters.status}
              onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="input w-auto"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="input w-auto"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>

            <Button
              variant={showFilters ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="whitespace-nowrap"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters {hasActiveFilters && <span className="ml-1.5 w-2 h-2 bg-red-500 rounded-full" />}
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-cream-200 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Sort By</label>
                  <select
                    value={filters.sort + '_' + filters.order}
                    onChange={e => {
                      const [sort, order] = e.target.value.split('_')
                      setFilters(prev => ({ ...prev, sort, order }))
                    }}
                    className="input"
                  >
                    <option value="created_at_DESC">Newest First</option>
                    <option value="created_at_ASC">Oldest First</option>
                    <option value="price_ASC">Price: Low to High</option>
                    <option value="price_DESC">Price: High to Low</option>
                    <option value="name_ASC">Name: A-Z</option>
                    <option value="name_DESC">Name: Z-A</option>
                  </select>
                </div>
                <div>
                  <label className="label">Items Per Page</label>
                  <select
                    value={pagination.limit}
                    onChange={e => {
                      setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))
                    }}
                    className="input"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-4 border-b border-cream-200">
                <div className="w-12 h-12 bg-cream-100 rounded" />
                <div className="flex-1">
                  <div className="h-4 bg-cream-100 rounded w-[75%] mb-2" />
                  <div className="h-3 bg-cream-100 rounded w-[50%]" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-cream-300 mb-4" />
            <h3 className="text-lg font-medium text-charcoal-700 mb-2">No products found</h3>
            <p className="text-cream-600 mb-6">{hasActiveFilters ? 'Try adjusting your filters' : 'Get started by adding your first product'}</p>
            {!hasActiveFilters && (
              <Link to="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add Product
              </Link>
            )}
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            )}
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead className="bg-cream-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider hidden lg:table-cell">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider hidden xl:table-cell">Featured</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider">Created</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-cream-600 uppercase tracking-wider w-40">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-cream-200">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-cream-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {product.media?.[0]?.media_url ? (
                              <img src={product.media[0].media_url} alt={product.name} className="w-full h-full object-cover" onError={handleImageFallback} />
                            ) : (
                              <Package className="w-5 h-5 text-cream-400" />
                            )}
                          </div>
                          <div>
                            <Link to={"/admin/products/" + product.id + "/edit"} className="font-medium text-charcoal-900 hover:text-wood-700 block truncate max-w-xs">
                              {product.name}
                            </Link>
                            <p className="text-sm text-cream-500">{product.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="badge bg-cream-200 text-charcoal-700">{product.category_name}</span>
                      </td>

                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-charcoal-900">{formatPrice(product.price)}</span>
                          {product.discount_price && (
                            <span className="text-sm text-cream-500 line-through">{formatPrice(product.discount_price)}</span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(product)}
                          disabled={updatingId === product.id}
                          className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors " + (
                            product.is_active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          )}
                        >
                          <span className={"w-2 h-2 rounded-full " + (product.is_active ? 'bg-green-500' : 'bg-red-500')} />
                          {product.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      <td className="px-4 py-4 hidden xl:table-cell">
                        <span className={"badge " + (product.is_featured ? 'bg-yellow-100 text-yellow-800' : 'bg-cream-200 text-cream-600')}>
                          {product.is_featured ? 'Yes' : 'No'}
                        </span>
                      </td>

                      <td className="px-4 py-4 hidden xl:table-cell text-cream-500 text-sm">
                        {formatDate(product.created_at)}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="p-2 rounded-lg text-cream-500 hover:text-wood-700 hover:bg-cream-100 transition-colors"
                            aria-label="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <a
                            href={`/products/${product.slug || product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-cream-500 hover:text-wood-700 hover:bg-cream-100 transition-colors"
                            aria-label="View on site"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                            className="p-2 rounded-lg text-cream-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            aria-label="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-cream-200 flex items-center justify-between">
                <p className="text-sm text-cream-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
                </p>
                <nav className="flex items-center gap-2" aria-label="Pagination">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum
                    if (pagination.totalPages <= 5) pageNum = i + 1
                    else if (pagination.page <= 3) pageNum = i + 1
                    else if (pagination.page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i
                    else pageNum = pagination.page - 2 + i

                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                        aria-label={"Page " + pageNum}
                        aria-current={pagination.page === pageNum ? 'page' : undefined}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
