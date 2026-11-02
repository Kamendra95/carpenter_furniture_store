import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Tag } from 'lucide-react'
import { formatPrice, getAvailabilityStatusColor, getAvailabilityStatusLabel } from '../utils/helpers'
import { handleImageFallback } from '../utils/imageFallback'

export default function ProductCard({ product }) {
  const primaryImage = product.media?.find(m => m.media_type === 'image')?.media_url
  const hasDiscount = product.discount_price && product.discount_price < product.price
  const displayPrice = hasDiscount ? product.discount_price : product.price
  const originalPrice = hasDiscount ? product.price : null
  
  return (
    <article className="card group">
      <Link to={`/products/${product.id}`} className="block" aria-label={`View ${product.name}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={handleImageFallback}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cream-400">
              <ShoppingBag className="w-12 h-12" aria-hidden="true" />
            </div>
          )}
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_featured && (
              <span className="badge bg-wood-700 text-white">Featured</span>
            )}
            <span className={`${getAvailabilityStatusColor(product.availability_status)} text-xs px-2 py-1`}>
              {getAvailabilityStatusLabel(product.availability_status)}
            </span>
          </div>
          
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-charcoal-600 hover:text-wood-700 hover:bg-white shadow-lg transition-colors" aria-label="Add to wishlist">
              <Heart className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="badge bg-cream-200 text-charcoal-700 text-xs">
              {product.category_name}
            </span>
          </div>
          
          <h3 className="font-serif text-lg font-medium text-charcoal-900 mb-2 line-clamp-1 group-hover:text-wood-700 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <span className="text-wood-700 font-semibold text-lg">{formatPrice(displayPrice)}</span>
            {originalPrice && (
              <span className="text-cream-500 line-through text-sm">{formatPrice(originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}