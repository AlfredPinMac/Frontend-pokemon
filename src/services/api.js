import axios from 'axios'
import { useAuthStore } from '../stores/auth'

// Pokémon Backend API URL (running on port 5000)
const POKEMON_API_URL = import.meta.env.VITE_POKEMON_API_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: POKEMON_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// REQUEST INTERCEPTOR: Injects the Bearer JWT from Pinia into every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      
      // Log request without exposing sensitive JWT token in console
      console.group(`🚀 [HTTP REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
      console.log(
        `%c🔑 [JWT INJECTED VIA PINIA] Authorization: Bearer [PROTECTED]`,
        'color: #10b981; font-weight: bold; background: #064e3b; padding: 3px 6px; border-radius: 4px;'
      )
      if (config.data) {
        console.log('📦 Body Data:', config.data)
      }
      console.groupEnd()
    } else {
      console.warn(`⚠️ [HTTP REQUEST] ${config.method?.toUpperCase()} ${config.url} - No JWT token found in Pinia store!`)
    }

    return config
  },
  (error) => {
    console.error('❌ [REQUEST ERROR]', error)
    return Promise.reject(error)
  }
)

// RESPONSE INTERCEPTOR: Handles errors, token expirations, and logs responses
apiClient.interceptors.response.use(
  (response) => {
    console.groupCollapsed(`✅ [HTTP RESPONSE ${response.status}] ${response.config.method?.toUpperCase()} ${response.config.url}`)
    console.log('📥 Response Data:', response.data)
    console.groupEnd()
    return response
  },
  (error) => {
    console.group(`❌ [HTTP ERROR ${error.response?.status || 'NETWORK'}] ${error.config?.url}`)
    console.error('Error Details:', error.response?.data || error.message)
    console.groupEnd()

    // If 401 Unauthorized, automatically log out
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      console.warn('⚠️ Token inválido o expirado. Cerrando sesión...')
      authStore.logout()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default apiClient
