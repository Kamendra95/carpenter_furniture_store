import { Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Eye, Edit, MessageSquare, Loader2, ChevronLeft, ChevronRight, Phone, Send, CheckCircle, AlertCircle, XCircle, Clock, User } from 'lucide-react'
import { formatDate } from '../../utils/helpers'
import { getWhatsAppLink, getPhoneLink } from '../../utils/helpers'
import api from '../../services/api'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/Button'
import Modal from '../../components/Modal'

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled'
}

export default function AdminInquiries() {
  const { success, error } = useToast()
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 0 })
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    productId: '',
    sort: 'created_at',
    order: 'DESC'
  })
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [settings, setSettings] = useState(null)
  
  const fetchInquiries = useCallback(async () => {
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
      if (filters.productId) params.append('productId', filters.productId)
      
      const response = await api.get(`/admin/inquiries?${params.toString()}`)
      setInquiries(response.data.data.inquiries)
      setPagination(response.data.data.pagination)
    } catch (err) {
      error('Failed to load inquiries')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, filters])
  
  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/public')
      setSettings(response.data.data)
    } catch {}
  }
  
  useEffect(() => {
    fetchInquiries()
    fetchSettings()
  }, [fetchInquiries])
  
  const handleStatusChange = async (inquiry, newStatus) => {
    setUpdatingStatus(inquiry.id)
    try {
      await api.patch(`/admin/inquiries/${inquiry.id}/status`, { status: newStatus })
      success(`Inquiry marked as ${STATUS_LABELS[newStatus]}`)
      fetchInquiries()
      if (selectedInquiry?.id === inquiry.id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus })
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingStatus(null)
    }
  }
  
  const openDetail = (inquiry) => {
    setSelectedInquiry(inquiry)
    setShowDetailModal(true)
  }
  
  const whatsappUrl = (phone) => settings?.whatsapp_number ? getWhatsAppLink(settings.whatsapp_number, `Hi ${phone}, this is regarding your inquiry.`) : '#'
  const phoneUrl = (phone) => getPhoneLink(phone)
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">Inquiries</h1>
          <p className="text-cream-600 mt-1">Manage customer inquiries</p>
        </div>
      </div>
      
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-cream-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-500" />
              <input
                type="text"
                placeholder="Search name, phone, message..."
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && fetchInquiries()}
                className="input pl-10"
              />
            </div>
            
            <select
              value={filters.status}
              onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="input w-auto"
            >
              {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 border-b border-cream-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-cream-100 rounded" />
                  <div className="flex-1">
                    <div className="h-4 bg-cream-100 rounded w-1/3 mb-1" />
                    <div className="h-3 bg-cream-100 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : inquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead className="bg-cream-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider hidden md:table-cell">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider hidden lg:table-cell">Message Preview</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-cream-600 uppercase tracking-wider w-48">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {inquiries.map(inquiry => (
                  <tr key={inquiry.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-charcoal-900">{inquiry.customer_name}</p>
                        <p className="text-sm text-cream-500">{inquiry.customer_phone}</p>
                        {inquiry.customer_email && <p className="text-sm text-cream-500">{inquiry.customer_email}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      {inquiry.product_name ? (
                        <Link to={`/admin/products/${inquiry.product_id}/edit`} className="text-wood-700 hover:text-wood-800 font-medium">
                          {inquiry.product_name}
                        </Link>
                      ) : (
                        <span className="text-cream-500">General Inquiry</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge ${STATUS_COLORS[inquiry.status]}`}>
                        {STATUS_LABELS[inquiry.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-cream-500 text-sm">
                      {formatDate(inquiry.created_at)}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-cream-600 max-w-xs truncate">
                      {inquiry.message?.substring(0, 100)}...
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetail(inquiry)}
                          aria-label="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto text-cream-300 mb-4" />
            <h3 className="text-lg font-medium text-charcoal-700 mb-2">No inquiries found</h3>
            <p className="text-cream-600">Customer inquiries will appear here</p>
          </div>
        )}
        
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-cream-200 flex items-center justify-between">
            <p className="text-sm text-cream-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} inquiries
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
      
      <Modal isOpen={showDetailModal} onClose={() => { setShowDetailModal(false); setSelectedInquiry(null) }} title="Inquiry Details" size="lg">
        {selectedInquiry && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-cream-50 rounded-lg">
              <div>
                <p className="text-sm text-cream-500">Customer Name</p>
                <p className="font-medium text-charcoal-900">{selectedInquiry.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-cream-500">Phone</p>
                <p className="font-medium text-charcoal-900">{selectedInquiry.customer_phone}</p>
              </div>
              {selectedInquiry.customer_email && (
                <div>
                  <p className="text-sm text-cream-500">Email</p>
                  <p className="font-medium text-charcoal-900">{selectedInquiry.customer_email}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-cream-500">Product</p>
                <p className="font-medium text-charcoal-900">
                  {selectedInquiry.product_name ? (
                    <Link to={`/admin/products/${selectedInquiry.product_id}/edit`} className="text-wood-700 hover:text-wood-800">
                      {selectedInquiry.product_name} (₹{selectedInquiry.product_price?.toLocaleString('en-IN')})
                    </Link>
                  ) : 'General Inquiry'}
                </p>
              </div>
              <div>
                <p className="text-sm text-cream-500">Status</p>
                <span className={`badge ${STATUS_COLORS[selectedInquiry.status]}`}>
                  {STATUS_LABELS[selectedInquiry.status]}
                </span>
              </div>
              <div>
                <p className="text-sm text-cream-500">Submitted</p>
                <p className="font-medium text-charcoal-900">{formatDate(selectedInquiry.created_at, { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-cream-500 mb-2">Message</p>
              <div className="p-4 bg-cream-50 rounded-lg border border-cream-200 whitespace-pre-wrap text-cream-700">
                {selectedInquiry.message}
              </div>
            </div>
            
            <div className="border-t border-cream-200 pt-4">
              <p className="font-medium text-charcoal-900 mb-3">Quick Actions</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={whatsappUrl(selectedInquiry.customer_phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  WhatsApp
                </a>
                <a
                  href={phoneUrl(selectedInquiry.customer_phone)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
                {selectedInquiry.customer_email && (
                  <a
                    href={`mailto:${selectedInquiry.customer_email}`}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Email
                  </a>
                )}
              </div>
            </div>
            
            <div className="border-t border-cream-200 pt-4">
              <p className="font-medium text-charcoal-900 mb-3">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.filter(o => o.value).map(opt => (
                  <Button
                    key={opt.value}
                    variant={selectedInquiry.status === opt.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(selectedInquiry, opt.value)}
                    disabled={updatingStatus === selectedInquiry.id}
                  >
                    {updatingStatus === selectedInquiry.id ? <Loader2 className="w-4 h-4 animate-spin" /> : STATUS_LABELS[opt.value]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}