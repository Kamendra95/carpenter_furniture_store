import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingBag, Phone, MessageSquare, Home, Package, Info, Mail, MapPin, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getWhatsAppLink, getPhoneLink } from '../utils/helpers'
import api from '../services/api'

export default function CustomerLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [settings, setSettings] = useState(null)
  const location = useLocation()
  
  useEffect(() => {
    fetchSettings()
    setIsMenuOpen(false)
  }, [location.pathname])
  
  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/public')
      setSettings(response.data.data)
    } catch {
    }
  }
  
  const whatsappUrl = settings?.whatsapp_number ? getWhatsAppLink(settings.whatsapp_number) : '#'
  const phoneUrl = settings?.phone ? getPhoneLink(settings.phone) : '#'
  
  const navigation = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/products', label: 'Shop', icon: Package },
    { path: '/categories', label: 'Categories', icon: ShoppingBag },
    { path: '/custom-furniture', label: 'Custom Furniture', icon: MessageSquare },
    { path: '/about', label: 'About Us', icon: Info },
    { path: '/contact', label: 'Contact', icon: Mail }
  ]
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="site-header sticky top-0 z-40 backdrop-blur-sm">
        <nav className="container-custom" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2 text-wood-900 hover:opacity-80 transition-opacity" aria-label="Go to homepage">
              <div className="w-10 h-10 rounded-lg bg-wood-700 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <span className="font-serif text-xl font-semibold hidden sm:block">Carpenter Furniture</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              {navigation.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors ${
                    location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                      ? 'text-wood-700'
                      : 'text-charcoal-600 hover:text-wood-700'
                  }`}
                >
                  <item.icon className="w-4 h-4" aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <a
                href={phoneUrl}
                className="flex items-center gap-1.5 text-sm font-medium text-charcoal-600 hover:text-wood-700 transition-colors"
                aria-label="Call us"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{settings?.phone || 'Call Us'}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp px-4 py-2 text-sm"
                aria-label="Contact on WhatsApp"
              >
                <MessageSquare className="w-4 h-4 mr-2" aria-hidden="true" />
                WhatsApp
              </a>
            </div>
            
            <button
              className="md:hidden p-2 rounded-lg text-charcoal-600 hover:bg-cream-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          <div id="mobile-menu" className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col gap-2">
              {navigation.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                      ? 'bg-wood-100 text-wood-700'
                      : 'text-charcoal-600 hover:bg-cream-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-cream-200 my-2" />
              <a
                href={phoneUrl}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-charcoal-600 hover:bg-cream-100 transition-colors"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call: {settings?.phone || 'Contact Us'}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-green-600 hover:bg-green-50 transition-colors"
              >
                <MessageSquare className="w-5 h-5" aria-hidden="true" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </nav>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="site-footer text-cream-100">
        <div className="container-custom py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6" aria-label="Go to homepage">
                <div className="w-12 h-12 rounded-lg bg-wood-600 flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <span className="font-serif text-2xl font-semibold">Carpenter Furniture</span>
              </Link>
              <p className="text-cream-400 text-base leading-relaxed max-w-xs mb-6">
                Handcrafted premium furniture made with passion and precision. Bringing warmth and elegance to your home since 1995.
              </p>
              <div className="flex gap-6">
                {settings?.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-cream-400 hover:text-white transition-colors" aria-label="Facebook">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                )}
                {settings?.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-cream-400 hover:text-white transition-colors" aria-label="Instagram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {settings?.youtube_url && (
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-cream-400 hover:text-white transition-colors" aria-label="YouTube">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-cream-400">
                <li><Link to="/products" className="hover:text-white transition-colors">Shop Furniture</Link></li>
                <li><Link to="/categories" className="hover:text-white transition-colors">Categories</Link></li>
                <li><Link to="/custom-furniture" className="hover:text-white transition-colors">Custom Furniture</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3 text-cream-400">
                {settings?.phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    <a href={phoneUrl} className="hover:text-white transition-colors">{settings.phone}</a>
                  </li>
                )}
                {settings?.whatsapp_number && (
                  <li className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" aria-hidden="true" />
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
                  </li>
                )}
                {settings?.email && (
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">{settings.email}</a>
                  </li>
                )}
                {settings?.address && (
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <address className="not-italic">{settings.address}</address>
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-charcoal-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cream-400 text-sm">
              © {new Date().getFullYear()} Carpenter Furniture Store. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-sm text-cream-400 hover:text-white transition-colors"
              >
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                Admin Login
              </Link>
              <p className="text-cream-400 text-sm">
                Handcrafted with care in India
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}