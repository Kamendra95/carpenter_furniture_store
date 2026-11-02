import { useState } from 'react'
import { MapPin, Phone, Mail, MessageSquare, Clock, Send, Truck, Shield, Heart, MapPin as MapPinIcon } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import api from '../../services/api'
import Button from '../../components/Button'
import Input from '../../components/Input'

const contactInfo = [
  { icon: MapPin, title: 'Visit Our Showroom', details: '123 Furniture Lane, Industrial Area, Bangalore - 560001, Karnataka, India' },
  { icon: Phone, title: 'Call Us', details: '+91 98765 43210', action: 'tel:+919876543210', actionLabel: 'Call Now' },
  { icon: Mail, title: 'Email Us', details: 'info@carpenterfurniture.com', action: 'mailto:info@carpenterfurniture.com', actionLabel: 'Send Email' },
  { icon: MessageSquare, title: 'WhatsApp', details: 'Chat with us instantly', action: 'https://wa.me/919876543210', actionLabel: 'Chat on WhatsApp', external: true }
]

const services = [
  { icon: Truck, title: 'Free Delivery', description: 'On orders over ₹50,000 within city limits' },
  { icon: Shield, title: 'Lifetime Warranty', description: 'Structural warranty on all handcrafted pieces' },
  { icon: Heart, title: 'Custom Design', description: 'Bespoke furniture tailored to your space' },
  { icon: Clock, title: 'Expert Consultation', description: 'Free design consultation for custom projects' }
]

export default function Contact() {
  const { success, error } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState(null)
  
  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/public')
      setSettings(response.data.data)
    } catch {}
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }
  
  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
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
      await api.post('/inquiries', {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        message: `Subject: ${formData.subject}\n\n${formData.message}`
      })
      success('Message sent successfully! We will get back to you within 24 hours.')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      error(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="animate-fade-in">
      <section className="bg-wood-900 text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="container-custom relative">
          <div className="max-w-3xl animate-slide-up">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-cream-200 text-lg leading-relaxed">
              Have questions about our furniture? Need a custom quote? 
              Our team is here to help you create the perfect space.
            </p>
          </div>
        </div>
      </section>
      
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((item, index) => (
              <div key={index} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-cream-100 flex items-center justify-center text-wood-700 mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-charcoal-900 mb-2">{item.title}</h3>
                <p className="text-cream-600 mb-4">{item.details}</p>
                {item.action && (
                  <a
                    href={item.action}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="text-wood-700 font-medium hover:text-wood-800 inline-flex items-center gap-1.5 transition-colors"
                  >
                    {item.actionLabel}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </a>
                )}
              </div>
            ))}
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-3xl font-bold text-charcoal-900 mb-6">Send Us a Message</h2>
              <p className="text-cream-600 mb-8">
                Fill out the form below and we'll get back to you within 24 hours. 
                For urgent inquiries, please call or WhatsApp us directly.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                    placeholder="Your name"
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    required
                    placeholder="+91 98765 43210"
                  />
                  <Input
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={errors.subject}
                    required
                    placeholder="What is this regarding?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="label">Message <span className="text-red-500">*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`input min-h-[150px] resize-y ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Tell us about your project, questions, or requirements..."
                    required
                  />
                  {errors.message && <p className="mt-1.5 text-sm text-red-600" role="alert">{errors.message}</p>}
                </div>
                <Button type="submit" loading={loading} className="w-full sm:w-auto">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
            
            <div>
              <h2 className="font-serif text-3xl font-bold text-charcoal-900 mb-6">Our Services</h2>
              <div className="space-y-4 mb-8">
                {services.map((service, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-cream-50 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center text-wood-700 flex-shrink-0">
                      <service.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-900">{service.title}</h3>
                      <p className="text-cream-600 text-sm">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-wood-900 text-white rounded-2xl p-8">
                <h3 className="font-serif text-2xl font-bold mb-3">Business Hours</h3>
                <div className="space-y-3 text-cream-300">
                  <div className="flex justify-between"><span>Monday - Saturday</span><span className="font-medium">9:00 AM - 7:00 PM</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span className="font-medium">10:00 AM - 4:00 PM</span></div>
                  <div className="flex justify-between"><span>Public Holidays</span><span className="font-medium">Closed</span></div>
                </div>
                <div className="mt-6 pt-6 border-t border-wood-700">
                  <p className="text-cream-400 text-sm">
                    Showroom visits by appointment recommended for custom projects.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section bg-cream-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold text-charcoal-900 mb-4">Visit Our Showroom</h2>
            <p className="text-cream-600 mb-8">
              Experience the quality of our furniture in person. 
              Our showroom features a curated selection of our finest pieces.
            </p>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-200">
              <MapPinIcon className="w-12 h-12 mx-auto text-wood-600 mb-4" />
              <address className="not-italic text-cream-700 leading-relaxed mb-6">
                {settings?.address || '123 Furniture Lane, Industrial Area,<br />Bangalore - 560001, Karnataka, India'}
              </address>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={`https://maps.google.com/?q=${encodeURIComponent(settings?.address || '123 Furniture Lane, Bangalore')}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  Get Directions
                </a>
                <a href="tel:+919876543210" className="btn-outline">
                  <Phone className="w-5 h-5 mr-2" />
                  Call to Schedule
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}