import { Link } from 'react-router-dom'
import { Home, Search, Package, ArrowLeft, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-cream-50 px-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center">
          <Package className="w-12 h-12 text-wood-500" />
        </div>
        <h1 className="font-serif text-6xl font-bold text-charcoal-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-charcoal-700 mb-4">Page Not Found</h2>
        <p className="text-cream-600 mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link to="/products" className="btn-outline inline-flex items-center gap-2">
            <Search className="w-5 h-5" />
            Browse Products
          </Link>
        </div>
        
        <div className="mt-12 p-6 bg-white rounded-xl border border-cream-200">
          <h3 className="font-semibold text-charcoal-900 mb-3">Popular Destinations</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/products" className="p-3 rounded-lg bg-cream-50 hover:bg-cream-100 transition-colors text-left">
              <Package className="w-5 h-5 text-wood-600 mb-1" />
              <p className="text-sm font-medium text-charcoal-900">Shop Furniture</p>
            </Link>
            <Link to="/categories" className="p-3 rounded-lg bg-cream-50 hover:bg-cream-100 transition-colors text-left">
              <Sparkles className="w-5 h-5 text-wood-600 mb-1" />
              <p className="text-sm font-medium text-charcoal-900">Categories</p>
            </Link>
            <Link to="/custom-furniture" className="p-3 rounded-lg bg-cream-50 hover:bg-cream-100 transition-colors text-left">
              <Sparkles className="w-5 h-5 text-wood-600 mb-1" />
              <p className="text-sm font-medium text-charcoal-900">Custom Orders</p>
            </Link>
            <Link to="/contact" className="p-3 rounded-lg bg-cream-50 hover:bg-cream-100 transition-colors text-left">
              <Sparkles className="w-5 h-5 text-wood-600 mb-1" />
              <p className="text-sm font-medium text-charcoal-900">Contact Us</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}