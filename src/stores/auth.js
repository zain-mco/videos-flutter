import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Credentials (in production, this would be handled by a backend)
const VALID_EMAIL = 'zain@flutter.com'
const VALID_PASSWORD = 'Zen@@12345$$'

export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated = ref(false)
    const user = ref(null)
    const loginError = ref('')

    // Check if already logged in on init
    const checkAuth = () => {
        const saved = sessionStorage.getItem('showcase-auth')
        if (saved) {
            const data = JSON.parse(saved)
            if (data.email === VALID_EMAIL) {
                isAuthenticated.value = true
                user.value = { email: data.email }
            }
        }
    }

    // Login
    const login = (email, password) => {
        loginError.value = ''

        if (email === VALID_EMAIL && password === VALID_PASSWORD) {
            isAuthenticated.value = true
            user.value = { email }
            sessionStorage.setItem('showcase-auth', JSON.stringify({ email }))
            return true
        } else {
            loginError.value = 'Invalid email or password'
            return false
        }
    }

    // Logout
    const logout = () => {
        isAuthenticated.value = false
        user.value = null
        sessionStorage.removeItem('showcase-auth')
    }

    // Initialize
    checkAuth()

    return {
        isAuthenticated,
        user,
        loginError,
        login,
        logout,
        checkAuth
    }
})
