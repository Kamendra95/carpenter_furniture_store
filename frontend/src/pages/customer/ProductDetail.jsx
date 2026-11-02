import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Truck, Shield, Heart, Share2, MapPin, Phone, MessageSquare, Tag, Package, Ruler, TreePine, CheckCircle } from 'lucide-react'
import { formatPrice } from '../../utils/helpers'
import api from '../../services/api'
import ImageGallery from '../../components/ImageGallery'
import ProductCard from '../../components/ProductCard'
import InquiryForm from '../../components/InquiryForm'
import Button from '../../components/Button'
import { useToast } from '../../context/ToastContext'
import { getWhatsAppLink, getPhoneLink } from '../../utils/helpers'

function RelatedProducts({ categoryId, excludeId }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchRelated()
  }, [categoryId, excludeId])
  
  const fetchRelated = async () => {
    try {
      const response = await api.get(`/products?category_id=${categoryId}&limit=4`)
      const filtered = response.data.data.products.filter(p => p.id !== excludeId).slice(0, 4)
      setProducts(filtered)
    } catch {}
    finally { setLoading(false) }
  }
  
  if (loading || products.length === 0) return null
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}

export default function ProductDetail() {
  const { idOrSlug } = useParams()
  const { success, error } = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [settings, setSettings] = useState(null)
  
  useEffect(() => {
    fetchProduct()
    fetchSettings()
  }, [idOrSlug])
  
  const fetchProduct = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const response = await api.get(`/products/${idOrSlug}`)
      setProduct(response.data.data)
    } catch (err) {
      setErrorMsg('Product not found')
      console.error('Failed to fetch product:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/public')
      setSettings(response.data.data)
    } catch {}
  }
  
  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="aspect-[4/3] img-loading rounded-xl" />
          <div className="space-y-6">
            <div className="h-6 img-loading rounded w-3/4" />
            <div className="h-8 img-loading rounded w-1/2" />
            <div className="h-10 img-loading rounded w-2/3" />
            <div className="h-20 img-loading rounded" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-10 img-loading rounded" />
              <div className="h-10 img-loading rounded" />
              <div className="h-10 img-loading rounded" />
            </div>
          </div>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="h-32 img-loading rounded-xl" />
          <div className="h-32 img-loading rounded-xl" />
          <div className="h-32 img-loading rounded-xl" />
        </div>
      </div>
    )
  }
  
  if (errorMsg || !product) {
    return (
      <div className="container-custom py-20 text-center">
        <svg className="w-16 h-16 mx-auto text-cream-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <h2 className="text-xl font-semibold text-charcoal-700 mb-2">Product Not Found</h2>
        <p className="text-cream-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    )
  }
  
  const hasDiscount = product.discount_price && product.discount_price < product.price
  const displayPrice = hasDiscount ? product.discount_price : product.price
  const whatsappUrl = settings?.whatsapp_number ? getWhatsAppLink(settings.whatsapp_number, `Hi, I'm interested in "${product.name}" (${formatPrice(displayPrice)}).`) : '#'
  const phoneUrl = settings?.phone ? getPhoneLink(settings.phone) : '#'
  
  const specs = [
    { icon: Tag, label: 'Category', value: product.category_name },
    { icon: TreePine, label: 'Material', value: product.material || 'Not specified' },
    { icon: Ruler, label: 'Dimensions', value: product.dimensions || 'Not specified' },
    { icon: Package, label: 'Availability', value: product.availability_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) }
  ].filter(spec => spec.value !== 'Not specified')
  
  return (
    <div className="animate-fade-in">
      <nav className="container-custom py-4" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-cream-500">
          <li><Link to="/" className="hover:text-wood-700">Home</Link></li>
          <li className="flex items-center"><ChevronRight className="w-4 h-4" /> <Link to="/products" className="hover:text-wood-700">Products</Link></li>
          <li className="flex items-center"><ChevronRight className="w-4 h-4" /> <Link to={`/categories/${product.category_slug}`} className="hover:text-wood-700">{product.category_name}</Link></li>
          <li className="flex items-center"><ChevronRight className="w-4 h-4" /> <span className="text-charcoal-900 truncate max-w-[200px]">{product.name}</span></li>
        </ol>
      </nav>
      
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="sticky top-24 lg:sticky">
            <ImageGallery media={product.media} productName={product.name} />
            
            <div className="flex flex-wrap gap-3 mt-6">
              <Button variant="outline" onClick={() => setInquiryOpen(true)} className="flex-1 sm:flex-none">
                <MessageSquare className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp flex-1 sm:flex-none justify-center"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                WhatsApp
              </a>
              <a
                href={phoneUrl}
                className="btn-primary flex-1 sm:flex-none justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call
              </a>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <span className="badge bg-wood-100 text-wood-700">{product.category_name}</span>
              {product.is_featured && <span className="badge bg-yellow-100 text-yellow-800 ml-2">Featured</span>}
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900">{product.name}</h1>
            
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-wood-700 font-semibold text-3xl">{formatPrice(displayPrice)}</span>
              {hasDiscount && (
                <span className="text-cream-500 line-through text-xl">{formatPrice(product.price)}</span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-cream-600">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Free delivery on orders {'\u20B9'}50,000+</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Lifetime structural warranty</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Professional assembly available</span>
            </div>
            
            <div className="border-t border-cream-200 pt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {specs.map((spec, index) => (
                  <div key={index} className="p-4 bg-cream-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-cream-600 mb-1">
                      <spec.icon className="w-4 h-4" />
                      <span>{spec.label}</span>
                    </div>
                    <p className="font-medium text-charcoal-900">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {product.description && (
              <div className="border-t border-cream-200 pt-6">
                <h3 className="font-semibold text-charcoal-900 mb-3">Description</h3>
                <div className="prose prose-cream max-w-none text-cream-700 leading-relaxed">
                  {product.description.split('\n').map((para, i) => (
                    <p key={i} className="mb-4">{para}</p>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t border-cream-200 pt-6">
              <h3 className="font-semibold text-charcoal-900 mb-4">Why Choose This Piece</h3>
              <ul className="space-y-3">
                {[
                  'Handcrafted by master carpenters with 20+ years experience',
                  'Made from sustainably sourced premium hardwood',
                  'Traditional joinery techniques for maximum durability',
                  'Customizable finishes available on request',
                  'Quality inspected at every stage of production'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-cream-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-6">You May Also Like</h2>
          <RelatedProducts categoryId={product.category_id} excludeId={product.id} />
        </div>
        
        <InquiryForm product={product} isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
      </div>
    </div>
    )
}