import { useState, useEffect } from 'react'
import { Image, Save } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import api from '../../services/api'
import Button from '../../components/Button'
import Input from '../../components/Input'

export default function AdminSettings() {
  const { success, error } = useToast()
  const [settings, setSettings] = useState({
    business_name: '',
    phone: '',
    whatsapp_number: '',
    email: '',
    address: '',
    about_text: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: ''
  })
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [logoUploading, setLogoUploading] = useState(false)
  
  useEffect(() => {
    fetchSettings()
  }, [])
  
  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/settings')
      const data = response.data.data
      setSettings({
        business_name: data.business_name || '',
        phone: data.phone || '',
        whatsapp_number: data.whatsapp_number || '',
        email: data.email || '',
        address: data.address || '',
        about_text: data.about_text || '',
        facebook_url: data.facebook_url || '',
        instagram_url: data.instagram_url || '',
        youtube_url: data.youtube_url || ''
      })
      if (data.logo_url) setLogoPreview(data.logo_url)
    } catch (err) {
      error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }
  
  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      error('Please select a valid image file (JPEG, PNG, WebP)')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      error('File size must be less than 5MB')
      return
    }
    
    setLogo(file)
    setLogoPreview(URL.createObjectURL(file))
  }
  
  const validateForm = () => {
    const newErrors = {}
    if (!settings.business_name.trim()) newErrors.business_name = 'Business name is required'
    if (!settings.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!settings.whatsapp_number.trim()) newErrors.whatsapp_number = 'WhatsApp number is required'
    if (!settings.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) newErrors.email = 'Invalid email address'
    if (settings.whatsapp_number && !/^[0-9]{10,15}$/.test(settings.whatsapp_number)) {
      newErrors.whatsapp_number = 'WhatsApp number should be digits only (with country code)'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setSaving(true)
    try {
      const formData = new FormData()
      Object.entries(settings).forEach(([key, value]) => {
        formData.append(key, value)
      })
      if (logo) formData.append('logo', logo)
      
      const response = await api.put('/admin/settings', formData)
      
      setSettings(response.data.data)
      if (response.data.data.logo_url) setLogoPreview(response.data.data.logo_url)
      setLogo(null)
      success('Settings saved successfully')
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save settings')
      if (err.response?.data?.errors) {
        const fieldErrors = {}
        err.response.data.errors.forEach(e => { fieldErrors[e.field] = e.message })
        setErrors(fieldErrors)
      }
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">Settings</h1>
        </div>
        <div className="card p-8 max-w-3xl">
          <div className="animate-pulse space-y-6">
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">Settings</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6" noValidate>
        <div className="card p-6">
          <h2 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
            <Image className="w-5 h-5" />
            Business Logo
          </h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-cream-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {logoPreview ? (
                <img src={logoPreview} alt="Business Logo" className="w-full h-full object-cover" />
              ) : (
                <Image className="w-10 h-10 text-cream-400" />
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="logo" className="label">Upload New Logo</label>
              <input
                id="logo"
                name="logo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleLogoChange}
                className="input py-2"
              />
              {errors.logo && <p className="mt-1.5 text-sm text-red-600">{errors.logo}</p>}
              <p className="text-sm text-cream-500 mt-1.5">JPEG, PNG, WebP (max 5MB). Recommended: 200x200px</p>
              {logo && (
                <p className="text-sm text-cream-500 mt-2">New logo will replace current one on save</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <h2 className="font-semibold text-charcoal-900 mb-4">Business Information</h2>
          <div className="space-y-4">
            <Input
              label="Business Name"
              name="business_name"
              value={settings.business_name}
              onChange={handleChange}
              error={errors.business_name}
              required
              placeholder="Carpenter Furniture Store"
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={settings.phone}
              onChange={handleChange}
              error={errors.phone}
              required
              placeholder="+91 98765 43210"
            />
            <Input
              label="WhatsApp Number"
              name="whatsapp_number"
              value={settings.whatsapp_number}
              onChange={handleChange}
              error={errors.whatsapp_number}
              required
              placeholder="919876543210"
              helperText="Digits only with country code (e.g., 919876543210)"
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={settings.email}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="info@carpenterfurniture.com"
            />
            <div>
              <label htmlFor="address" className="label">Address</label>
              <textarea
                id="address"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="input min-h-[100px] resize-y"
                placeholder="Full business address"
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="about_text" className="label">About Us Text</label>
              <textarea
                id="about_text"
                name="about_text"
                value={settings.about_text}
                onChange={handleChange}
                className="input min-h-[120px] resize-y"
                placeholder="Tell customers about your business, history, and values"
                rows={4}
              />
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <h2 className="font-semibold text-charcoal-900 mb-4">Social Media Links (Optional)</h2>
          <div className="space-y-4">
            <Input
              label="Facebook URL"
              name="facebook_url"
              type="url"
              value={settings.facebook_url}
              onChange={handleChange}
              error={errors.facebook_url}
              placeholder="https://facebook.com/yourbusiness"
            />
            <Input
              label="Instagram URL"
              name="instagram_url"
              type="url"
              value={settings.instagram_url}
              onChange={handleChange}
              error={errors.instagram_url}
              placeholder="https://instagram.com/yourbusiness"
            />
            <Input
              label="YouTube URL"
              name="youtube_url"
              type="url"
              value={settings.youtube_url}
              onChange={handleChange}
              error={errors.youtube_url}
              placeholder="https://youtube.com/yourbusiness"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button type="submit" loading={saving} className="flex-1 sm:flex-none">
            <Save className="w-5 h-5 mr-2" />
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  )
}