import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { getWhatsAppLink, getPhoneLink } from '../utils/helpers'
import { handleImageFallback } from '../utils/imageFallback'
import api from '../services/api'
import Button from './Button'
import Input from './Input'
import Modal from './Modal'

export default function InquiryForm({ product, isOpen, onClose }) {
  const { success, error } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [contactInfo, setContactInfo] = useState(null)
  
  const validateForm = () => {
    const newErrors = {}
    if (!formData.customer_name.trim()) newErrors.customer_name = 'Name is required'
    if (!formData.customer_phone.trim()) newErrors.customer_phone = 'Phone number is required'
    if (formData.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = 'Invalid email address'
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const response = await api.post('/inquiries', {
        product_id: product?.id || null,
        ...formData
      })
      
      setContactInfo(response.data.data.contact)
      setSubmitted(true)
      success('Inquiry submitted successfully! We will contact you soon.')
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }
  
  const resetForm = () => {
    setFormData({ customer_name: '', customer_phone: '', customer_email: '', message: '' })
    setErrors({})
    setSubmitted(false)
    setContactInfo(null)
  }
  
  const whatsappUrl = contactInfo?.whatsapp_url
  const phoneUrl = contactInfo?.phone_url
  const email = contactInfo?.email
  
  const defaultMessage = product
    ? `Hi, I'm interested in "${product.name}" (${product.price ? `₹${product.price}` : 'Price on request'}).\n\nName: ${formData.customer_name}\nPhone: ${formData.customer_phone}\nMessage: ${formData.message}`
    : `Hi, I have an inquiry.\n\nName: ${formData.customer_name}\nPhone: ${formData.customer_phone}\nMessage: ${formData.message}`
  
  return (
    <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose() }} title="Contact for Purchase" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {product && (
          <div className="p-4 bg-cream-50 rounded-lg border border-cream-200">
            <h4 className="font-medium text-charcoal-900 mb-2">Product Details</h4>
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-lg bg-cream-100 flex-shrink-0 overflow-hidden">
                {product.media?.[0]?.media_url ? (
                  <img src={product.media[0].media_url} alt={product.name} className="w-full h-full object-cover" onError={handleImageFallback} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-cream-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-charcoal-900 truncate">{product.name}</h5>
                <p className="text-wood-700 font-semibold">{product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on request'}</p>
                <p className="text-sm text-cream-500">Product ID: {product.id}</p>
              </div>
            </div>
          </div>
        )}
        
        {!submitted ? (
          <>
            <Input
              label="Your Name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              error={errors.customer_name}
              required
              placeholder="Enter your full name"
            />
            <Input
              label="Phone Number"
              name="customer_phone"
              type="tel"
              value={formData.customer_phone}
              onChange={handleChange}
              error={errors.customer_phone}
              required
              placeholder="+91 98765 43210"
            />
            <Input
              label="Email (Optional)"
              name="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={handleChange}
              error={errors.customer_email}
              placeholder="your@email.com"
            />
            <div className="w-full">
              <label htmlFor="message" className="label">Message <span className="text-red-500">*</span></label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`input min-h-[120px] resize-y ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Describe your requirements, preferred timeline, or any questions..."
                required
              />
              {errors.message && <p className="mt-1.5 text-sm text-red-600" role="alert">{errors.message}</p>}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="submit" loading={loading} className="flex-1">
                Submit Inquiry
              </Button>
              <Button type="button" variant="outline" onClick={() => { resetForm(); onClose() }}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-charcoal-900 mb-2">Inquiry Submitted!</h4>
              <p className="text-cream-600">We have received your inquiry and will contact you shortly.</p>
            </div>
            
            <div className="p-4 bg-cream-50 rounded-lg border border-cream-200">
              <h5 className="font-medium text-charcoal-900 mb-3">Quick Contact Options</h5>
              <div className="flex flex-col sm:flex-row gap-3">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp flex-1 justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.48-1.653-1.68-.173-.2-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.472.099-.174.05-.372-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.42.01-.643.078-.223.068-.482.175-.67.472-.198.297-.768.967-.768 1.594 0 .627.42 1.225.573 1.392.14.157.198.23.245.444.057.223-.01.381-.125.53-.125.149-.381.373-.617.616-.234.24-.538.463-.826.726-.35.314-.643.5-.883.673-.249.18-.51.347-.787.526-.277.18-.56.32-.887.48-.316.15-.69.247-1.077.31-.387.062-.76.024-1.134-.074-.375-.098-.74-.255-1.082-.482-.34-.228-.68-.492-.97-.816-.292-.323-.525-.597-.778-.88-.253-.282-.42-.5-.545-.652-.135-.163-.214-.327-.214-.494 0-.174.106-.458.267-.725.174-.297.598-.804 1.124-1.412.525-.608 1.18-1.37 1.606-1.657.427-.286.883-.494 1.337-.683.454-.188.932-.293 1.403-.307.47-.014.94.06 1.39.26.45.199.876.52 1.257.87.38.35.703.77.966 1.25.26.48.38.894.382 1.154.003.277-.068.56-.21.838-.149.3-.41.75-.64 1.003-.23.25-.53.55-.87.886-.34.334-.71.75-.97 1.038-.26.28-.55.52-.85.813-.3.29-.68.55-1.01.77-.33.22-.72.403-1.11.57-.39.166-.84.278-1.32.323-.47.045-.972.013-1.458-.125-.485-.138-.94-.376-1.36-.726-.42-.35-.81-.75-1.16-1.2-.35-.45-.62-.94-.82-1.416-.2-.47-.32-.97-.32-1.5 0-.42.09-.813.26-1.16.17-.347.49-.805.88-1.29.39-.48.95-1.064 1.47-1.526.52-.46 1.08-.87 1.68-1.236.6-.36 1.25-.637 1.95-.93.7-.293 1.45-.52 2.25-.75.8-.23 1.65-.43 2.56-.57.91-.14 1.87-.24 2.88-.29.996-.05 2.02-.07 3.07-.07 1.05 0 2.07.02 3.1.07 1.01.05 1.97.15 2.88.29.9.22 1.75.42 2.56.57.7.293 1.35.57 1.95.93.6.366 1.16.778 1.68 1.236.52.462 1.08 1.046 1.47 1.526.39.485.71.943.88 1.29.17.347.26.74.26 1.16 0 .53-.12 1.03-.32 1.5-.2.47-.47.96-.82 1.416-.35.45-.74.85-1.16 1.2-.42.35-.875.588-1.36.726-.486.138-.988.17-1.458.125-.39-.045-.84-.158-1.23-.323-.33-.167-.72-.35-1.01-.77-.3-.293-.58-.553-.85-.813-.26-.288-.52-.532-.97-1.038-.34-.336-.64-.64-.87-.886-.23-.253-.49-.697-.64-1.003-.142-.278-.21-.56-.21-.838 0-.26.12-.674.382-1.154.263-.477.586-.896.966-1.25.38-.35.806-.672 1.256-.87.45-.2.92-.272 1.39-.26.472.014.95.118 1.402.308.454.188.91.397 1.336.683.427.287.98.65 1.606 1.657.527.608.95 1.115 1.124 1.412.16.267.266.55.266.725 0 .167-.08.33-.214.494-.125.152-.292.376-.545.652-.252.283-.486.557-.778.88-.29.324-.63.588-.97.816-.34.227-.712.384-1.082.482-.374.063-.748.16-1.134.31-.327.16-.61.3-.887.48-.277.18-.538.347-.787.526-.24.173-.533.36-.883.673-.288.263-.592.486-.826.726-.236.243-.49.467-.617.616-.115.149-.272.307-.495.53-.223.068-.445.078-.643.078-.198 0-.397-.002-.57.01-.182.01-.427.007-.669.51-.247.595-.916 2.059-.916 2.207-.075.148-.124.346-.025.52.099.174.148.298.298.472.148.173.312.387.446.52.148.148.304.402.13.606-.173.2-.77.892-1.653 1.68-1.134 1.012-2.092 1.325-2.39 1.475-.297.148-.471.124-.644-.075-.172-.198-.742-.867-.94-1.164-.199-.298-.397-.347-.67-.15-.272.1-.1733.819-2.03.967-.453.238-.904.358-1.36.358-.457 0-.908-.12-1.36-.358z"/></svg>
                    WhatsApp
                  </a>
                )}
                {phoneUrl && (
                  <a href={phoneUrl} className="btn-primary flex-1 justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    Call Us
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="btn-secondary flex-1 justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    Email
                  </a>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { resetForm(); onClose() }} className="flex-1">
                Close
              </Button>
              <Button variant="secondary" onClick={resetForm} className="flex-1">
                New Inquiry
              </Button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  )
}