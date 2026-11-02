import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Package, Home, Sofa, Table, Armchair, Warehouse, Box, Sparkles } from 'lucide-react'
import api from '../../services/api'
import Button from '../../components/Button'

const categoryIcons = {
  beds: Home,
  sofas: Sofa,
  tables: Table,
  chairs: Armchair,
  wardrobes: Warehouse,
  cabinets: Box,
  doors: Home,
  'modular-kitchen': Package,
  'custom-furniture': Sparkles
}

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchCategories()
  }, [])
  
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const getIcon = (slug) => {
    const Icon = categoryIcons[slug] || Package
    return Icon
  }
  
  return (
    <div className="animate-fade-in">
      <section className="bg-wood-900 text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="container-custom relative">
          <div className="max-w-3xl animate-slide-up">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Furniture Categories</h1>
            <p className="text-cream-200 text-lg leading-relaxed">
              Explore our complete range of handcrafted furniture, 
              organized by category for easy browsing.
            </p>
          </div>
        </div>
      </section>
      
      <section className="section bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="card p-8 img-loading h-48" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
                const Icon = getIcon(category.slug)
                return (
                  <Link
                    key={category.id}
                    to={`/categories/${category.slug}`}
                    className="card group p-6 flex flex-col items-center text-center hover:border-wood-300 hover:shadow-xl transition-all"
                  >
                    <div className="w-20 h-20 rounded-xl bg-cream-100 flex items-center justify-center text-wood-700 mb-4 group-hover:bg-wood-700 group-hover:text-white transition-colors">
                      <Icon className="w-10 h-10" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-charcoal-900 mb-1 group-hover:text-wood-700 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-cream-500 text-sm mb-4">{category.product_count || 0} products</p>
                    <div className="mt-auto flex items-center gap-1.5 text-wood-700 font-medium group-hover:gap-2 transition-all">
                      View Collection
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-cream-300 mb-4" />
              <h3 className="text-lg font-medium text-charcoal-700 mb-2">No categories found</h3>
              <p className="text-cream-600">Check back soon for our furniture categories</p>
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link to="/custom-furniture" className="btn-whatsapp inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Can't Find What You Need? Custom Order
            </Link>
          </div>
        </div>
      </section>
      
      <section className="section bg-cream-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold text-charcoal-900 mb-4">Need Something Unique?</h2>
            <p className="text-cream-600 text-lg mb-8">
              Can't find exactly what you're looking for? Our master carpenters can create 
              custom furniture tailored to your exact specifications, space, and style.
            </p>
            <Link to="/custom-furniture" className="btn-primary text-lg px-8 py-4">
              Request Custom Furniture
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}