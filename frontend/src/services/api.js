import axios from 'axios'

const isProduction = import.meta.env.MODE === 'production'
const baseUrl = isProduction
  ? import.meta.env.VITE_API_BASE_URL_PROD || 'https://carpenter-furniture-store.vercel.app/api'
  : import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api