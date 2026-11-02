import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, TreePine, Ruler, Palette, Truck, Shield, Heart, Clock, ChevronRight, CheckCircle, MessageSquare, Phone, Home, Sofa, Table, Armchair, Warehouse } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import api from '../../services/api'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { getWhatsAppLink, getPhoneLink } from '../../utils/helpers'

const processSteps = [
  { number: '01', title: 'Consultation', description: 'We discuss your vision, space requirements, and design preferences.' },
  { number: '02', title: 'Design & Quote', description: 'Our designers create detailed drawings and provide a transparent quote.' },
  { number: '03', title: 'Material Selection', description: 'Choose from premium woods, finishes, and hardware options.' },
  { number: '04', title: 'Crafting', description: 'Master carpenters handcraft your piece with precision and care.' },
  { number: '05', title: 'Delivery & Install', description: 'Professional delivery and installation in your home.' }
]

const customTypes = [
  { icon: Home, title: 'Built-in Wardrobes', description: 'Floor-to-ceiling storage solutions tailored to your room dimensions.' },
  { icon: Table, title: 'Custom Dining Tables', description: 'Unique tables in any size, shape, and wood species.' },
  { icon: Sofa, title: 'Bespoke Sofas', description: 'Custom dimensions, fabric, and configuration for your living room.' },
  { icon: Armchair, title: 'Ergonomic Office Furniture', description: 'Desks and chairs designed for your workflow and space.' },
  { icon: Warehouse, title: 'Modular Kitchen Units', description: 'Complete kitchen solutions customized to your layout.' },
  { icon: Sparkles, title: 'Any Custom Piece', description: 'If you can imagine it, we can craft it. Share your vision with us.' }
]

export default function CustomFurniture() {
  const { success, error } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project_type: '',
    description: '',
    budget_range: '',
    timeline: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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
    if (!formData.project_type.trim()) newErrors.project_type = 'Please select a project type'
    if (!formData.description.trim()) newErrors.description = 'Project description is required'
    else if (formData.description.trim().length < 20) newErrors.description = 'Please provide more details (at least 20 characters)'
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
        message: `Custom Furniture Request\n\nType: ${formData.project_type}\nBudget: ${formData.budget_range || 'Not specified'}\nTimeline: ${formData.timeline || 'Not specified'}\n\nDetails:\n${formData.description}`
      })
      success('Custom furniture request submitted! Our design team will contact you within 24 hours.')
      setSubmitted(true)
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit request. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const whatsappUrl = settings?.whatsapp_number ? getWhatsAppLink(settings.whatsapp_number, 'Hi, I would like to discuss a custom furniture project.') : '#'
  const phoneUrl = settings?.phone ? getPhoneLink(settings.phone) : '#'
  
  return (
    <div className="animate-fade-in">
      <section className="bg-wood-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="container-custom relative">
          <div className="max-w-3xl animate-slide-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-wood-600/30 text-wood-200 text-sm font-medium mb-6 border border-wood-600/50">
              Bespoke Furniture
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Custom Furniture{' '}
              <span className="text-wood-300">Made for You</span>
            </h1>
            <p className="text-cream-200 text-lg leading-relaxed mb-8 max-w-2xl">
              Your vision, our craftsmanship. From concept to creation, we bring your 
              unique furniture ideas to life with master carpentry expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp inline-flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                WhatsApp Consultation
              </a>
              <a href={phoneUrl} className="btn-outline border-cream-300 text-cream-100 hover:bg-cream-200 hover:text-charcoal-900 inline-flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">Our Custom Process</h2>
            <p className="text-cream-600 text-lg">Five steps to your perfect piece</p>
          </div>
          
          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-wood-200 -translate-x-1/2" />
            <div className="space-y-12">
              {processSteps.map((step, index) => (
                <div key={index} className="relative flex lg:flex-row items-start gap-8">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-wood-100 flex items-center justify-center relative z-10 lg:w-20 lg:h-20">
                    <span className="font-serif text-xl font-bold text-wood-700">{step.number}</span>
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute left-1/2 top-20 w-0.5 h-full bg-wood-200 -translate-x-1/2" />
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-serif text-xl font-semibold text-charcoal-900 mb-2">{step.title}</h3>
                    <p className="text-cream-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section className="section bg-cream-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">What Can We Create?</h2>
            <p className="text-cream-600 text-lg">Some popular custom furniture categories</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customTypes.map((type, index) => (
              <Link
                key={index}
                to="/custom-furniture"
                className="card p-6 hover:shadow-xl transition-shadow"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('project_type')?.focus()
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-cream-100 flex items-center justify-center text-wood-700 mb-4">
                  <type.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-charcoal-900 mb-2">{type.title}</h3>
                <p className="text-cream-600">{type.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900 mb-6">Why Choose Custom?</h2>
              <div className="space-y-6 mb-8">
                {[
                  { icon: TreePine, title: 'Perfect Fit', desc: 'Furniture designed to the millimeter for your exact space' },
                  { icon: Palette, title: 'Your Style', desc: 'Choose wood, finish, hardware, and design details' },
                  { icon: Heart, title: 'Heirloom Quality', desc: 'Traditional joinery techniques for generational durability' },
                  { icon: Shield, title: 'Expert Guidance', desc: 'Our designers help refine your ideas into reality' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center text-wood-700 flex-shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-900">{item.title}</h3>
                      <p className="text-cream-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-wood-900 text-white rounded-2xl p-6">
                <h3 className="font-serif text-xl font-bold mb-3">Ready to Start?</h3>
                <p className="text-cream-300 mb-4">Schedule a free design consultation with our experts.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp justify-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    WhatsApp Consultation
                  </a>
                  <a href={phoneUrl} className="btn-outline border-cream-300 text-cream-100 hover:bg-cream-200 hover:text-charcoal-900 justify-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
            
            {!submitted ? (
              <div className="card p-6 md:p-8 sticky top-24">
                <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-6">Request a Custom Quote</h3>
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                  <div>
                    <label htmlFor="project_type" className="label">Project Type <span className="text-red-500">*</span></label>
                    <select
                      id="project_type"
                      name="project_type"
                      value={formData.project_type}
                      onChange={handleChange}
                      className={`input ${errors.project_type ? 'border-red-500 focus:ring-red-500' : ''}`}
                      required
                    >
                      <option value="">Select project type</option>
                      <option value="built-in-wardrobe">Built-in Wardrobe</option>
                      <option value="custom-dining-table">Custom Dining Table</option>
                      <option value="bespoke-sofa">Bespoke Sofa</option>
                      <option value="office-furniture">Office Furniture</option>
                      <option value="modular-kitchen">Modular Kitchen</option>
                      <option value="other">Other Custom Piece</option>
                    </select>
                    {errors.project_type && <p className="mt-1.5 text-sm text-red-600">{errors.project_type}</p>}
                  </div>
                  <div>
                    <label htmlFor="budget_range" className="label">Budget Range (Optional)</label>
                    <select
                      id="budget_range"
                      name="budget_range"
                      value={formData.budget_range}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-50k">Under ₹50,000</option>
                      <option value="50k-100k">₹50,000 - ₹1,00,000</option>
                      <option value="100k-250k">₹1,00,000 - ₹2,50,000</option>
                      <option value="250k-500k">₹2,50,000 - ₹5,00,000</option>
                      <option value="500k-plus">₹5,00,000+</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="timeline" className="label">Preferred Timeline (Optional)</label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">As soon as possible</option>
                      <option value="1-2-months">1-2 months</option>
                      <option value="2-3-months">2-3 months</option>
                      <option value="3-6-months">3-6 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="description" className="label">Project Details <span className="text-red-500">*</span></label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`input min-h-[120px] resize-y ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Describe your vision, space dimensions, preferred wood, style references, or any specific requirements..."
                      required
                    />
                    {errors.description && <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>}
                  </div>
                  <Button type="submit" loading={loading} className="w-full">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Submit Custom Request
                  </Button>
                </form>
              </div>
            ) : (
              <div className="card p-6 md:p-8 sticky top-24 text-center animate-slide-up">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-3">Request Submitted!</h3>
                <p className="text-cream-600 mb-6">
                  Our design team will review your requirements and contact you 
                  within 24 hours to schedule a consultation.
                </p>
                <div className="space-y-3">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full justify-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Chat on WhatsApp Now
                  </a>
                  <a href={phoneUrl} className="btn-primary w-full justify-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Us
                  </a>
                  <Button variant="outline" onClick={() => setSubmitted(false)} className="w-full">
                    Submit Another Request
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <section className="section bg-wood-900 text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Truck, title: 'Free Design Consultation', desc: 'Expert advice at no cost' },
              { icon: Shield, title: 'Transparent Pricing', desc: 'Detailed quotes with no hidden costs' },
              { icon: Heart, title: 'Lifetime Warranty', desc: 'Structural guarantee on all custom pieces' }
            ].map((item, index) => (
              <div key={index} className="p-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-wood-800 flex items-center justify-center text-wood-400">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-cream-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}