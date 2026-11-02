import { Fragment, useEffect } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

export default function Modal({ isOpen, onClose, title, children, size = 'md', showClose = true }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
  }
  
  const modalContent = (
    <Fragment>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`${sizes[size]} w-full bg-white rounded-xl shadow-xl overflow-hidden animate-slide-up`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          onClick={e => e.stopPropagation()}
        >
          {(title || showClose) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-charcoal-900">{title}</h2>
              )}
              {showClose && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-cream-500 hover:text-charcoal-600 hover:bg-cream-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </Fragment>
  )
  
  return createPortal(modalContent, document.body)
}