import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, ShoppingBag } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/Button'
import Input from '../../components/Input'

export default function AdminLogin() {
  const { login, admin, loading: authLoading } = useAuth()
  const { error: toastError } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-wood-200 border-t-wood-700 rounded-full animate-spin" aria-label="Loading" />
      </div>
    )
  }

  if (admin) {
    return <Navigate to={from} replace />
  }

  const validateForm = () => {
    const newErrors = {}
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email address'
    if (!password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid credentials. Please try again.'
      setErrors({ form: message })
      toastError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <div className="w-14 h-14 rounded-xl bg-wood-700 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">Admin Login</h1>
          <p className="text-cream-600 mt-2">Sign in to manage your furniture store</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {errors.form && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{errors.form}</p>
              </div>
            )}

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: '' })) }}
              error={errors.email}
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({ ...prev, password: '' })) }}
                error={errors.password}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-cream-500 hover:text-charcoal-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-cream-200">
            <p className="text-sm text-cream-600 text-center">
              Need an admin account? Run{' '}
              <code className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">npm run create-admin</code>{' '}
              in the backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
