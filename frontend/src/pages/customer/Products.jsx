import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, X, ChevronDown, Loader2 } from 'lucide-react'
import { formatPrice } from '../../utils/helpers'
import api from '../../services/api'
import ProductCard from '../../components/ProductCard'
import Button from '../../components/Button'

const AVAILABILITY_OPTIONS = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'limited', label: 'Limited Stock' },
  { value: 'made_to_order', label: 'Made to Order' }
]

const SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Newest First' },
  { value: 'created_at_asc', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' }
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 })
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    availability: '',
    sort: 'created_at_desc'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [filterExpanded, setFilterExpanded] = useState({ price: true, category: true, availability: false })
  
  const page = parseInt(searchParams.get('page')) || 1
  const categoryParam = searchParams.get('category')
  
  useEffect(() => {
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }))
    }
    fetchCategories()
  }, [categoryParam])
  
  useEffect(() => {
    fetchProducts()
  }, [page, filters.search, filters.category, filters.minPrice, filters.maxPrice, filters.availability, filters.sort])
  
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }
  
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      })
      
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.minPrice) params.append('min_price', filters.minPrice)
      if (filters.maxPrice) params.append('max_price', filters.maxPrice)
      if (filters.availability) params.append('availability', filters.availability)
      
      const [sort, order] = filters.sort.split('_')
      params.append('sort', sort)
      params.append('order', order)
      
      const response = await api.get(`/products?${params.toString()}`)
      setProducts(response.data.data.products)
      setPagination(response.data.data.pagination)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }, [page, filters])
  
  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }))
    setSearchParams({ page: '1' }, { replace: true })
  }
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setSearchParams({ page: '1' }, { replace: true })
  }
  
  const handleSortChange = (value) => {
    setFilters(prev => ({ ...prev, sort: value }))
  }
  
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      availability: '',
      sort: 'created_at_desc'
    })
    setSearchParams({ page: '1' }, { replace: true })
  }
  
  const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.availability
  
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setSearchParams({ page: newPage.toString() }, { replace: true })
    }
  }
  
  return (
    <div className="animate-fade-in">
      <div className="bg-wood-900 text-white py-12 md:py-16">
        <div className="container-custom">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">All Furniture</h1>
          <p className="text-cream-300">Discover our complete collection of handcrafted pieces</p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-charcoal-900">Filters</h3>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm">
                      <X className="w-3.5 h-3.5 mr-1" /> Clear
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="search" className="label">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-500" aria-hidden="true" />
                    <input
                      id="search"
                      type="text"
                      value={filters.search}
                      onChange={handleSearchChange}
                      placeholder="Search products..."
                      className="input pl-10"
                    />
                  </div>
                </div>
                
                <div className="border-t border-cream-200 pt-4 space-y-4">
                  <div>
                    <button
                      onClick={() => setFilterExpanded(prev => ({ ...prev, category: !prev.category }))}
                      className="flex items-center justify-between w-full font-medium text-charcoal-900"
                    >
                      <span>Category</span>
                      <ChevronDown className={`w-4 h-4 text-cream-500 transition-transform ${filterExpanded.category ? 'rotate-180' : ''}`} />
                    </button>
                    {filterExpanded.category && (
                      <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                        {categories.map(cat => (
                          <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="category"
                              value={cat.slug}
                              checked={filters.category === cat.slug}
                              onChange={e => handleFilterChange('category', e.target.value)}
                              className="w-4 h-4 text-wood-600 border-cream-300 focus:ring-wood-500"
                            />
                            <span className="text-sm text-charcoal-700">{cat.name} ({cat.product_count || 0})</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <button
                      onClick={() => setFilterExpanded(prev => ({ ...prev, price: !prev.price }))}
                      className="flex items-center justify-between w-full font-medium text-charcoal-900"
                    >
                      <span>Price Range</span>
                      <ChevronDown className={`w-4 h-4 text-cream-500 transition-transform ${filterExpanded.price ? 'rotate-180' : ''}`} />
                    </button>
                    {filterExpanded.price && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={e => handleFilterChange('minPrice', e.target.value)}
                          className="input text-sm py-2"
                          min="0"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={e => handleFilterChange('maxPrice', e.target.value)}
                          className="input text-sm py-2"
                          min="0"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <button
                      onClick={() => setFilterExpanded(prev => ({ ...prev, availability: !prev.availability }))}
                      className="flex items-center justify-between w-full font-medium text-charcoal-900"
                    >
                      <span>Availability</span>
                      <ChevronDown className={`w-4 h-4 text-cream-500 transition-transform ${filterExpanded.availability ? 'rotate-180' : ''}`} />
                    </button>
                    {filterExpanded.availability && (
                      <div className="mt-2 space-y-2">
                        {AVAILABILITY_OPTIONS.map(opt => (
                          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="availability"
                              value={opt.value}
                              checked={filters.availability === opt.value}
                              onChange={e => handleFilterChange('availability', e.target.value)}
                              className="w-4 h-4 text-wood-600 border-cream-300 focus:ring-wood-500"
                            />
                            <span className="text-sm text-charcoal-700">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>
          
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-cream-600">
                  {pagination.total} product{pagination.total !== 1 ? 's' : ''} found
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-cream-500" aria-hidden="true" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="hidden sm:flex"
                >
                  Filters {hasActiveFilters && <span className="ml-1.5 w-2 h-2 bg-red-500 rounded-full" />}
                </Button>
                
                <select
                  value={filters.sort}
                  onChange={e => handleSortChange(e.target.value)}
                  className="input w-auto py-2 text-sm appearance-none bg-white"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {showFilters && (
              <div className="lg:hidden mb-6 p-4 bg-cream-50 rounded-lg border border-cream-200 animate-slide-up">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="mobile-search" className="label">Search</label>
                    <input
                      id="mobile-search"
                      type="text"
                      value={filters.search}
                      onChange={handleSearchChange}
                      placeholder="Search products..."
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Category</label>
                    <select
                      value={filters.category}
                      onChange={e => handleFilterChange('category', e.target.value)}
                      className="input"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={e => handleFilterChange('minPrice', e.target.value)}
                      className="input"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={e => handleFilterChange('maxPrice', e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Availability</label>
                    <select
                      value={filters.availability}
                      onChange={e => handleFilterChange('availability', e.target.value)}
                      className="input"
                    >
                      <option value="">All</option>
                      {AVAILABILITY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card img-loading aspect-[4/3] rounded-xl" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {pagination.totalPages > 1 && (
                  <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      aria-label="Previous page"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                    </Button>
                    
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i
                      } else {
                        pageNum = pagination.page - 2 + i
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.page === pageNum ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                          aria-label={`Page ${pageNum}`}
                          aria-current={pagination.page === pageNum ? 'page' : undefined}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      aria-label="Next page"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                    </Button>
                  </nav>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto text-cream-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                <h3 className="text-lg font-medium text-charcoal-700 mb-2">No products found</h3>
                <p className="text-cream-600 mb-6">Try adjusting your filters or search terms</p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}