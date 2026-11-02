import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminProtectedRoute({ children }) {
  const { admin, loading } = useAuth()
  const location = useLocation()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="w-8 h-8 border-4 border-wood-500 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    )
  }
  
  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }
  
  return children
}