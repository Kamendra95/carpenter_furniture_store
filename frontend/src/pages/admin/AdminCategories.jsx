import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Loader2, Package, AlertCircle, CheckCircle } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import api from '../../services/api'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Modal from '../../components/Modal'

export default function AdminCategories() {
  const { success, error } = useToast()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  
  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/categories')
      setCategories(response.data.data)
    } catch (err) {
      error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchCategories()
  }, [])
  
  const openCreateModal = () => {
    setEditingCategory(null)
    setFormData({ name: '', slug: '', description: '' })
    setErrors({})
    setShowModal(true)
  }
  
  const openEditModal = (category) => {
    setEditingCategory(category)
    setFormData({ name: category.name, slug: category.slug, description: category.description || '' })
    setErrors({})
    setShowModal(true)
  }
  
  const closeModal = () => {
    setShowModal(false)
    setEditingCategory(null)
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    
    if (name === 'name' && !formData.slug) {
      setFormData(prev => ({ ...prev, slug: value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    else if (!/^[a-z0-9-]+$/.test(formData.slug)) newErrors.slug = 'Slug must be lowercase, numbers, and hyphens only'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setSaving(true)
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, formData)
        success('Category updated successfully')
      } else {
        await api.post('/admin/categories', formData)
        success('Category created successfully')
      }
      closeModal()
      fetchCategories()
    } catch (err) {
      error(err.response?.data?.message || `Failed to ${editingCategory ? 'update' : 'create'} category`)
      if (err.response?.data?.errors) {
        const fieldErrors = {}
        err.response.data.errors.forEach(e => { fieldErrors[e.field] = e.message })
        setErrors(fieldErrors)
      }
    } finally {
      setSaving(false)
    }
  }
  
  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}"? This action cannot be undone.`)) return
    if (category.product_count > 0) {
      if (!window.confirm(`This category has ${category.product_count} product(s). Deleting will fail unless products are moved first. Continue anyway?`)) return
    }
    
    setDeletingId(category.id)
    try {
      await api.delete(`/admin/categories/${category.id}`)
      success('Category deleted successfully')
      fetchCategories()
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete category')
    } finally {
      setDeletingId(null)
    }
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">Categories</h1>
          <p className="text-cream-600 mt-1">Manage product categories</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </Button>
      </div>
      
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-4 border-b border-cream-200">
                <div className="w-12 h-12 bg-cream-100 rounded" />
                <div className="flex-1">
                  <div className="h-4 bg-cream-100 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-cream-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead className="bg-cream-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider hidden md:table-cell">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider hidden lg:table-cell">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider">Products</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-cream-600 uppercase tracking-wider hidden xl:table-cell">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-cream-600 uppercase tracking-wider w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {categories.map(category => (
                  <tr key={category.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center">
                          <Package className="w-5 h-5 text-wood-600" />
                        </div>
                        <div>
                          <span className="font-medium text-charcoal-900">
                            {category.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell font-mono text-sm text-cream-600">
                      {category.slug}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-cream-600 truncate max-w-xs">
                      {category.description || '-'}
                    </td>
                    <td className="px-4 py-4">
                      <span className="badge bg-wood-100 text-wood-700">
                        {category.product_count || 0} product{category.product_count !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden xl:table-cell text-cream-500 text-sm">
                      {new Date(category.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(category)}
                          aria-label="Edit category"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category)}
                          disabled={deletingId === category.id}
                          className="text-red-600 hover:bg-red-50"
                          aria-label="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
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
            <Package className="w-16 h-16 mx-auto text-cream-300 mb-4" />
            <h3 className="text-lg font-medium text-charcoal-700 mb-2">No categories yet</h3>
            <p className="text-cream-600 mb-6">Create your first category to organize products</p>
            <Button onClick={openCreateModal}>
              <Plus className="w-5 h-5 mr-2" />
              Add Category
            </Button>
          </div>
        )}
      </div>
      
      <Modal isOpen={showModal} onClose={closeModal} title={editingCategory ? 'Edit Category' : 'Add Category'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="e.g., Beds, Sofas, Tables"
            autoFocus
          />
          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            error={errors.slug}
            required
            placeholder="auto-generated from name"
            helperText="Lowercase, numbers, hyphens only. Used in URLs."
          />
          <div>
            <label htmlFor="description" className="label">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input min-h-[100px] resize-y"
              placeholder="Brief description of this category"
              rows={3}
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={saving} className="flex-1">
              {editingCategory ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}