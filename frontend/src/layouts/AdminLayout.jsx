import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  Tag,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  ExternalLink
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const adminNavigation = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/products/new', label: 'Add Product', icon: PackagePlus },
  { path: '/admin/categories', label: 'Categories', icon: Tag },
  { path: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { path: '/admin/settings', label: 'Settings', icon: Settings }
]

function isNavItemActive(itemPath, pathname) {
  if (itemPath === '/admin/products') {
    return pathname === '/admin/products' || /^\/admin\/products\/[^/]+\/edit$/.test(pathname)
  }
  return pathname === itemPath
}

export default function AdminLayout() {
  const { admin, logout } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }

  const activeItem = adminNavigation.find(item => isNavItemActive(item.path, location.pathname))
  const pageTitle = location.pathname.endsWith('/edit') ? 'Edit Product' : activeItem?.label || 'Admin Panel'

  return (
    <div className="min-h-screen bg-cream-50">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85%] bg-[#fffdf9] border-r border-cream-300 shadow-warm-sm flex flex-col transition-transform duration-300 md:w-64 md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Admin sidebar"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-cream-300 bg-gradient-to-r from-cream-100/80 to-transparent">
          <Link to="/admin/dashboard" className="flex items-center gap-2 text-wood-900" aria-label="Admin Dashboard">
            <div className="w-8 h-8 rounded-md bg-gradient-to-b from-wood-600 to-wood-800 flex items-center justify-center shadow-warm-sm">
              <ShoppingBag className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-semibold text-lg">Admin Panel</span>
          </Link>
          <button
            className="md:hidden p-2 rounded-lg text-charcoal-600 hover:bg-cream-100"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
          {adminNavigation.map(item => {
            const isActive = isNavItemActive(item.path, location.pathname)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-wood-100 text-wood-800 shadow-[inset_3px_0_0_#a35b42]'
                    : 'text-charcoal-600 hover:bg-cream-100 hover:text-charcoal-900'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-cream-300 bg-cream-50/50 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-charcoal-600 hover:bg-cream-100 hover:text-charcoal-900 transition-colors"
          >
            <ExternalLink className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <span>View Store</span>
          </Link>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-wood-100 flex items-center justify-center flex-shrink-0">
              <span className="text-wood-700 font-medium text-sm">
                {admin.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal-900 truncate">{admin.name}</p>
              <p className="text-xs text-cream-500 truncate">{admin.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-charcoal-600 hover:bg-cream-100 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="md:pl-64 min-w-0">
        <header className="sticky top-0 z-30 bg-[#fffdf9]/95 backdrop-blur-sm border-b border-cream-300 shadow-warm-sm">
          <div className="flex items-center justify-between gap-4 h-16 px-4 md:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="md:hidden p-2 -ml-2 rounded-lg text-charcoal-600 hover:bg-cream-100"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="admin-sidebar"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="font-semibold text-lg text-charcoal-900 truncate">{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-3 min-w-0">
              <div className="hidden sm:block text-right min-w-0">
                <p className="text-sm font-medium text-charcoal-900 truncate">{admin.name}</p>
                <p className="text-xs text-cream-500 truncate">{admin.email}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-wood-100 flex items-center justify-center flex-shrink-0">
                <span className="text-wood-700 font-medium text-sm">
                  {admin.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
