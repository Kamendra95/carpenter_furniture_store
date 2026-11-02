import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Image, ChevronLeft, Plus, Save, Trash2, RotateCcw } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import api from '../../services/api'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { handleImageFallback } from '../../utils/imageFallback'

const AVAILABILITY_OPTIONS = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'limited', label: 'Limited Stock' },
  { value: 'made_to_order', label: 'Made to Order' }
]

const MAX_FILES = 10
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']

function createSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function AdminProductForm() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()
  const { success, error } = useToast()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    slug: '',
    description: '',
    price: '',
    discount_price: '',
    material: '',
    dimensions: '',
    availability_status: 'in_stock',
    is_active: true,
    is_featured: false
  })
  const [categories, setCategories] = useState([])
  const [media, setMedia] = useState([])
  const [newFiles, setNewFiles] = useState([])
  const [removedMediaIds, setRemovedMediaIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchCategories()
    if (isEditing) fetchProduct()
  }, [id])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories')
      setCategories(response.data.data)
    } catch {
      error('Failed to load categories')
    }
  }

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/admin/products/${id}`)
      const product = response.data.data
      setFormData({
        category_id: product.category_id || '',
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        discount_price: product.discount_price?.toString() || '',
        material: product.material || '',
        dimensions: product.dimensions || '',
        availability_status: product.availability_status || 'in_stock',
        is_active: product.is_active,
        is_featured: product.is_featured
      })
      setMedia(product.media || [])
    } catch {
      error('Failed to load product')
      navigate('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const nextValue = type === 'checkbox' ? checked : value

    setFormData(prev => ({
      ...prev,
      [name]: nextValue,
      ...(name === 'name' && !prev.slug ? { slug: createSlug(value) } : {})
    }))

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.category_id) newErrors.category_id = 'Category is required'
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required'
    if (formData.discount_price && parseFloat(formData.discount_price) >= parseFloat(formData.price)) {
      newErrors.discount_price = 'Discount price must be less than regular price'
    }
    if (media.length + newFiles.length > MAX_FILES) {
      newErrors.media = `A product can have at most ${MAX_FILES} media files`
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    setUploadProgress(0)
    try {
      const payload = new FormData()
      payload.append('category_id', formData.category_id)
      payload.append('name', formData.name.trim())
      payload.append('slug', formData.slug.trim())
      payload.append('description', formData.description)
      payload.append('price', formData.price)
      payload.append('discount_price', formData.discount_price || '')
      payload.append('material', formData.material)
      payload.append('dimensions', formData.dimensions)
      payload.append('availability_status', formData.availability_status)
      payload.append('is_active', String(formData.is_active))
      payload.append('is_featured', String(formData.is_featured))

      if (removedMediaIds.length) {
        payload.append('remove_media_ids', JSON.stringify(removedMediaIds))
      }

      newFiles.forEach(item => payload.append('media', item.file))

      const requestConfig = {
        onUploadProgress: (event) => {
          if (!event.total) return
          setUploadProgress(Math.round((event.loaded * 100) / event.total))
        }
      }

      if (isEditing) {
        await api.put(`/admin/products/${id}`, payload, requestConfig)
        success('Product updated successfully')
      } else {
        await api.post('/admin/products', payload, requestConfig)
        success('Product created successfully')
      }

      newFiles.forEach(item => URL.revokeObjectURL(item.preview))
      navigate('/admin/products')
    } catch (err) {
      error(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} product`)
      if (err.response?.data?.errors) {
        const fieldErrors = {}
        err.response.data.errors.forEach(item => { fieldErrors[item.field] = item.message })
        setErrors(fieldErrors)
      }
    } finally {
      setSaving(false)
      setUploadProgress(0)
    }
  }

  const handleFilesSelected = (event) => {
    const files = Array.from(event.target.files || [])
    event.target.value = ''

    if (!files.length) return

    const remainingSlots = MAX_FILES - media.length - newFiles.length
    if (remainingSlots <= 0) {
      error(`A product can have at most ${MAX_FILES} media files`)
      return
    }

    const accepted = []

    for (const file of files.slice(0, remainingSlots)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        error(`${file.name}: unsupported file type`)
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        error(`${file.name}: file is larger than 10MB`)
        continue
      }
      accepted.push({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image',
        name: file.name
      })
    }

    if (accepted.length) {
      setNewFiles(prev => [...prev, ...accepted])
    }
  }

  const removeExistingMedia = (mediaId) => {
    if (!window.confirm('Remove this media? It will be deleted when you save.')) return
    setRemovedMediaIds(prev => (prev.includes(mediaId) ? prev : [...prev, mediaId]))
    setMedia(prev => prev.filter(item => item.id !== mediaId))
  }

  const removeNewFile = (index) => {
    setNewFiles(prev => {
      const item = prev[index]
      if (item) URL.revokeObjectURL(item.preview)
      return prev.filter((_, position) => position !== index)
    })
  }

  const totalMedia = media.length + newFiles.length
  const selectedCategory = categories.find(category => String(category.id) === String(formData.category_id))

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">{isEditing ? 'Edit' : 'Add'} Product</h1>
        </div>
        <div className="card p-8">
          <div className="animate-pulse space-y-6 max-w-3xl">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-cream-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link to="/admin/products" className="text-cream-500 hover:text-wood-700 text-sm flex items-center gap-1 mb-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">{isEditing ? 'Edit' : 'Add'} Product</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products" className="btn-outline">Cancel</Link>
          <Button type="submit" form="product-form" loading={saving}>
            <Save className="w-5 h-5 mr-2" />
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </div>

      {saving && newFiles.length > 0 && (
        <div className="card p-4 mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-charcoal-900">Uploading media...</span>
            <span className="text-cream-600">{uploadProgress}%</span>
          </div>
          <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
            <div
              className="h-full bg-wood-600 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
        {categories.length === 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No categories exist yet.{' '}
            <Link to="/admin/categories" className="font-semibold underline hover:text-amber-900">
              Create a category
            </Link>{' '}
            before adding products.
          </div>
        )}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-wood-100 flex items-center justify-center text-wood-700">
                  <Image className="w-5 h-5" />
                </span>
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="category_id" className="label">
                    Category <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className={`input ${errors.category_id ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {errors.category_id && <p className="mt-1.5 text-sm text-red-600">{errors.category_id}</p>}
                </div>

                <Input
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  placeholder="e.g., Solid Teak King Size Bed"
                />

                <Input
                  label="Slug (URL-friendly)"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  error={errors.slug}
                  required
                  placeholder="auto-generated from name"
                  helperText="Used in product URLs. Lowercase, numbers, hyphens only."
                />

                <div>
                  <label htmlFor="description" className="label">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input min-h-[120px] resize-y"
                    placeholder="Describe the product features, materials, craftsmanship..."
                    rows={5}
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-semibold">
                  {'\u20B9'}
                </span>
                Pricing & Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={`Price (${'\u20B9'})`}
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  error={errors.price}
                  required
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                <Input
                  label={`Discount Price (${'\u20B9'})`}
                  name="discount_price"
                  type="number"
                  value={formData.discount_price}
                  onChange={handleChange}
                  error={errors.discount_price}
                  placeholder="Optional"
                  step="0.01"
                  min="0"
                />
                <Input
                  label="Material"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="e.g., Teak Wood, Sheesham Wood"
                />
                <Input
                  label="Dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  placeholder={'e.g., 78" x 80" x 48"'}
                />
              </div>
              <div className="mt-4">
                <label className="label">Availability Status</label>
                <select
                  name="availability_status"
                  value={formData.availability_status}
                  onChange={handleChange}
                  className="input"
                >
                  {AVAILABILITY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                  <Image className="w-5 h-5" />
                </span>
                Media (Images & Videos)
                <span className="text-sm font-normal text-cream-500 ml-auto">{totalMedia}/{MAX_FILES}</span>
              </h2>

              {totalMedia > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                  {media.map(item => (
                    <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden bg-cream-100 border border-cream-200">
                      {item.media_type === 'video' ? (
                        <video src={item.media_url} muted className="w-full h-full object-cover" />
                      ) : (
                        <img src={item.media_url} alt={item.alt_text || 'Product media'} className="w-full h-full object-cover" onError={handleImageFallback} />
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => removeExistingMedia(item.id)}
                          className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                          aria-label="Remove media"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 text-xs text-white bg-black/60 px-1.5 py-0.5 rounded capitalize">
                        {item.media_type}
                      </span>
                    </div>
                  ))}

                  {newFiles.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="relative group aspect-square rounded-lg overflow-hidden bg-cream-100 border-2 border-dashed border-green-300">
                      {item.type === 'video' ? (
                        <video src={item.preview} muted className="w-full h-full object-cover" />
                      ) : (
                        <img src={item.preview} alt={item.name} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => removeNewFile(index)}
                          className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                          aria-label="Remove selected file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 right-1 truncate text-xs text-white bg-green-700/80 px-1.5 py-0.5 rounded">
                        New: {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-cream-500 text-center py-4">No media uploaded yet</p>
              )}

              {errors.media && <p className="mb-3 text-sm text-red-600">{errors.media}</p>}

              <input
                ref={fileInputRef}
                id="product-media-files"
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                multiple
                className="hidden"
                onChange={handleFilesSelected}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={totalMedia >= MAX_FILES || saving}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isEditing ? 'Add Media' : 'Select Media'}
              </Button>
              <p className="text-sm text-cream-500 mt-2">
                Up to {MAX_FILES} files. Images (JPEG, PNG, WebP) and videos (MP4, WebM, MOV), max 10MB each.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6 sticky top-24">
              <h2 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                  <RotateCcw className="w-5 h-5" />
                </span>
                Status & Visibility
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-charcoal-900">Active</p>
                    <p className="text-sm text-cream-500">Visible on the website</p>
                  </div>
                  <span className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <span className="w-11 h-6 bg-cream-200 peer-focus:ring-4 peer-focus:ring-wood-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cream-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-wood-600" />
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-charcoal-900">Featured</p>
                    <p className="text-sm text-cream-500">Show in featured sections</p>
                  </div>
                  <span className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <span className="w-11 h-6 bg-cream-200 peer-focus:ring-4 peer-focus:ring-wood-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cream-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500" />
                  </span>
                </label>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-semibold text-charcoal-900 mb-4">Preview</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-cream-600">URL:</span>
                  <span className="font-mono text-charcoal-900 truncate">/products/{formData.slug || 'your-product-slug'}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-cream-600">Category:</span>
                  <span className="font-mono text-charcoal-900">{selectedCategory?.name || 'Select category'}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-cream-600">Price:</span>
                  <span className="font-semibold text-wood-700">
                    {formData.price ? `${'\u20B9'}${parseFloat(formData.price).toLocaleString('en-IN')}` : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-cream-600">Status:</span>
                  <span className={`badge ${formData.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {formData.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
