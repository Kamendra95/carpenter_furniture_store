import { useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, X, Video } from 'lucide-react'
import { handleImageFallback } from '../utils/imageFallback'

export default function ImageGallery({ media = [], productName }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const images = media.filter(m => m.media_type === 'image')
  const videos = media.filter(m => m.media_type === 'video')
  const allMedia = [...images, ...videos]
  
  if (allMedia.length === 0) {
    return (
      <div className="aspect-[4/3] bg-cream-100 rounded-xl flex items-center justify-center">
        <Expand className="w-12 h-12 text-cream-400" aria-hidden="true" />
      </div>
    )
  }
  
  const currentMedia = allMedia[currentIndex]
  const isVideo = currentMedia.media_type === 'video'
  
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + allMedia.length) % allMedia.length)
  }
  
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % allMedia.length)
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
    if (e.key === 'Escape') setIsFullscreen(false)
  }
  
  const renderMedia = (item, index) => {
    if (item.media_type === 'video') {
      return (
        <video
          key={index}
          src={item.media_url}
          controls
          className="w-full h-full object-contain"
          poster={images[0]?.media_url || undefined}
        />
      )
    }
    return (
      <img
        key={index}
        src={item.media_url}
        alt={item.alt_text || `${productName} - Image ${index + 1}`}
        className="w-full h-full object-cover"
        loading={index === 0 ? 'eager' : 'lazy'}
        onError={handleImageFallback}
      />
    )
  }
  
  const galleryContent = (
    <div className="relative">
      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-cream-100">
        <button
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm text-charcoal-600 hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
          aria-label="Previous image"
          disabled={allMedia.length <= 1}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="w-full h-full" onClick={() => setIsFullscreen(true)}>
          {renderMedia(currentMedia, currentIndex)}
        </div>
        
        <button
          onClick={goToNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm text-charcoal-600 hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
          aria-label="Next image"
          disabled={allMedia.length <= 1}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {isVideo && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-white text-xs">
            <Video className="w-3 h-3" aria-hidden="true" />
            <span>Video</span>
          </div>
        )}
      </div>
      
      {allMedia.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {allMedia.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex ? 'border-wood-500' : 'border-transparent hover:border-cream-300'
              }`}
              aria-label={`View image ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            >
              {item.media_type === 'video' ? (
                <video src={item.media_url} muted className="w-full h-full object-cover" />
              ) : (
                <img src={item.media_url} alt="" className="w-full h-full object-cover" loading="lazy" onError={handleImageFallback} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
  
  if (isFullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        onClick={() => setIsFullscreen(false)}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Fullscreen gallery"
      >
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-10"
          aria-label="Close fullscreen"
        >
          <X className="w-6 h-6" />
        </button>
        
        <button
          onClick={goToPrevious}
          className="absolute left-4 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-10 hidden sm:block"
          aria-label="Previous"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <div className="max-w-5xl max-h-[90vh] w-full px-4">
          {renderMedia(currentMedia, currentIndex)}
        </div>
        
        <button
          onClick={goToNext}
          className="absolute right-4 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-10 hidden sm:block"
          aria-label="Next"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    )
  }
  
  return <div className="group">{galleryContent}</div>
}