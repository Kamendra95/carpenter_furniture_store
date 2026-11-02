import { Link } from 'react-router-dom'
import { ShoppingBag, Truck, Shield, Heart, Sparkles, ArrowRight, Package, Home as HomeIcon, Sofa, Table, Armchair, Warehouse } from 'lucide-react'
import { formatPrice } from '../../utils/helpers'
import api from '../../services/api'
import { useState, useEffect } from 'react'
import ProductCard from '../../components/ProductCard'
import Button from '../../components/Button'

const features = [
  { icon: Shield, title: 'Premium Quality', description: 'Handcrafted from sustainably sourced premium woods with meticulous attention to detail.' },
  { icon: Heart, title: 'Custom Made', description: 'Bespoke furniture designed to your exact specifications and space requirements.' },
  { icon: Truck, title: 'Free Delivery', description: 'Complimentary delivery and installation within city limits for orders over \u20B950,000.' },
  { icon: Sparkles, title: 'Lifetime Warranty', description: 'We stand behind our craftsmanship with a lifetime structural warranty on all pieces.' }
]

const categoryIcons = {
  beds: HomeIcon,
  sofas: Sofa,
  tables: Table,
  chairs: Armchair,
  wardrobes: Warehouse,
  cabinets: Package
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      const [featuredResponse, categoriesResponse] = await Promise.all([
        api.get('/products/featured?limit=8'),
        api.get('/categories')
      ])
      setFeaturedProducts(featuredResponse.data.data)
      setCategories(categoriesResponse.data.data)
    } catch (error) {
      console.error('Failed to fetch home data:', error)
    } finally {
      setLoading(false)
    }
  }

  const displayCategories = categories.map(category => ({
    ...category,
    icon: categoryIcons[category.slug] || Package
  }))
  
  return (
    <div className="animate-fade-in">
      <section className="relative min-h-[80vh] flex items-center justify-center bg-wood-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-wood-950/90 to-wood-900/70" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="container-custom relative py-20 md:py-32">
          <div className="max-w-3xl animate-slide-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-wood-600/30 text-wood-200 text-sm font-medium mb-6 border border-wood-600/50">
              Handcrafted Since 1995
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Handcrafted Furniture{' '}
              <span className="text-wood-300">Made for Your Home</span>
            </h1>
            <p className="text-cream-200 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              Discover premium solid wood furniture crafted by master carpenters. 
              From elegant bedrooms to inviting living spaces, each piece tells a story of tradition and excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="btn-primary w-full sm:w-auto">
                Shop Furniture
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Link>
              <Link to="/contact" className="btn-outline border-cream-300 text-cream-100 hover:bg-cream-200 hover:text-charcoal-900 w-full sm:w-auto">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path className="text-cream-50" d="M0,0 C300,100 900,100 1200,0 L1200,100 L0,100 Z" />
          </svg>
        </div>
      </section>
      
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 md:p-8 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-cream-100 flex items-center justify-center text-wood-700">
                  <feature.icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-charcoal-900 mb-2">{feature.title}</h3>
                <p className="text-cream-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="section bg-cream-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900">Featured Products</h2>
              <p className="text-cream-600 mt-1">Our most loved pieces, handpicked for you</p>
            </div>
            <Link to="/products" className="hidden sm:block text-wood-700 font-medium hover:text-wood-800 transition-colors flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card img-loading aspect-[4/3] rounded-xl" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-10 md:mt-12">
                <Link to="/products" className="btn-outline inline-flex items-center gap-2">
                  View All Products
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-cream-300 mb-4" aria-hidden="true" />
              <h3 className="text-lg font-medium text-charcoal-700 mb-2">No featured products yet</h3>
              <p className="text-cream-600 mb-6">Check back soon for our featured collection</p>
              <Link to="/products" className="btn-primary">Browse All Products</Link>
            </div>
          )}
        </div>
      </section>
      
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900">Shop by Category</h2>
            <p className="text-cream-600 mt-1">Explore our complete range of handcrafted furniture</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {displayCategories.map((category, index) => (
              <Link
                key={category.slug}
                to={`/categories/${category.slug}`}
                className="card group p-6 text-center hover:border-wood-300 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-cream-100 flex items-center justify-center text-wood-700 group-hover:bg-wood-700 group-hover:text-white transition-colors">
                  <category.icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="font-medium text-charcoal-900 mb-1 group-hover:text-wood-700 transition-colors">{category.name}</h3>
                <p className="text-sm text-cream-500">{category.product_count} products</p>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10 md:mt-12">
            <Link to="/categories" className="btn-outline inline-flex items-center gap-2">
              View All Categories
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      
      <section className="section bg-wood-900 text-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Custom Furniture Made to Order</h2>
              <p className="text-cream-300 leading-relaxed mb-6">
                Have a unique vision? Our master carpenters can bring it to life. 
                From custom dimensions to unique designs, we create bespoke furniture 
                tailored to your exact space and style requirements.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Custom dimensions to fit any space',
                  'Choice of premium wood species',
                  'Personalized finish and hardware',
                  'Design consultation included',
                  'Made in our workshop with precision'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-cream-200">
                    <svg className="w-5 h-5 text-wood-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/custom-furniture" className="btn-whatsapp inline-flex items-center gap-2">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                Request Custom Quote
              </Link>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-wood-800 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-wood-700/50 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sofa className="w-64 h-64 text-wood-300 opacity-50" aria-hidden="true" />
                </div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">Ready to Transform Your Space?</h2>
            <p className="text-cream-600 text-lg mb-8">
              Visit our showroom or contact us for a personalized consultation. 
              Let us help you create the home of your dreams with furniture that lasts generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary text-lg px-8 py-4">
                Get in Touch
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Link>
              <Link to="/custom-furniture" className="btn-outline text-lg px-8 py-4">
                Custom Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}