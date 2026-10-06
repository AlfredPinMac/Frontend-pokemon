import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

// LDAP Auth API base URL (running on port 8000)
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8000'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('jwt_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user_info') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const username = computed(() => user.value?.username || 'Invitado')
  const userDn = computed(() => user.value?.dn || '')

  // Actions
  async function login(usernameInput, passwordInput) {
    loading.value = true
    error.value = null

    try {
      console.log(`%c[LDAP AUTH] Initiating authentication request for user: ${usernameInput}`, 'color: #3b82f6; font-weight: bold;')
      
      const response = await axios.post(`${AUTH_API_URL}/login`, {
        username: usernameInput,
        password: passwordInput
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = response.data
      console.log(`%c[LDAP AUTH SUCCESS] Received JWT from LDAP API:`, 'color: #10b981; font-weight: bold;', data.access_token)

      // Save token and user into state
      token.value = data.access_token
      user.value = {
        username: data.username,
        dn: data.dn,
        authenticated: data.authenticated
      }

      // Persist to localStorage for session persistence
      localStorage.setItem('jwt_token', data.access_token)
      localStorage.setItem('user_info', JSON.stringify(user.value))

      return { success: true, data }
    } catch (err) {
      console.error('[LDAP AUTH ERROR]', err)
      const message = err.response?.data?.detail || 'Error al autenticarse en el servidor LDAP'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  function logout() {
    console.log('%c[AUTH] Logging out user and clearing JWT token', 'color: #ef4444; font-weight: bold;')
    token.value = null
    user.value = null
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_info')
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    username,
    userDn,
    login,
    logout
  }
})
