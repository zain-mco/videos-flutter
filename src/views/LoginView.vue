<template>
  <div class="login-view">
    <!-- Background Effects -->
    <div class="login-bg">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>
    
    <!-- Login Card -->
    <div class="login-card">
      <div class="login-header">
        <div class="login-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
          </svg>
        </div>
        <h1 class="login-title">Dashboard Login</h1>
        <p class="login-subtitle">Enter your credentials to access the dashboard</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Email -->
        <div class="form-group">
          <label class="form-label">Email</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" stroke-width="2"/>
              <path d="M2 7L12 13L22 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input 
              v-model="email"
              type="email" 
              class="input"
              placeholder="Enter your email"
              required
              autocomplete="email"
            />
          </div>
        </div>
        
        <!-- Password -->
        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input 
              v-model="password"
              :type="showPassword ? 'text' : 'password'" 
              class="input"
              placeholder="Enter your password"
              required
              autocomplete="current-password"
            />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                <path d="M2 12C4 7 7.5 4 12 4C16.5 4 20 7 22 12C20 17 16.5 20 12 20C7.5 20 4 17 2 12Z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M10.5 10.5C9.9 11.1 9.5 12 9.5 12.5C9.5 14.1 10.9 15.5 12.5 15.5C13 15.5 13.9 15.1 14.5 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M6.5 6.5C4.5 8 3 10 2 12C4 17 7.5 20 12 20C14 20 15.8 19.5 17.5 18.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M19.5 14.5C20.5 13.5 21.5 12.5 22 12C20 7 16.5 4 12 4C11.5 4 11 4 10.5 4.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Error Message -->
        <Transition name="error">
          <div v-if="authStore.loginError" class="error-message">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 7V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="16.5" r="1" fill="currentColor"/>
            </svg>
            {{ authStore.loginError }}
          </div>
        </Transition>
        
        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary login-btn" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          <span v-else>Sign In</span>
        </button>
      </form>
      
      <!-- Back Link -->
      <div class="login-footer">
        <router-link to="/" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back to Showcase
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const success = authStore.login(email.value, password.value)
  
  if (success) {
    router.push('/dashboard')
  }
  
  isLoading.value = false
}
</script>

<style scoped>
.login-view {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
}

/* Background */
.login-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
  animation: orbFloat 15s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: var(--accent-primary);
  top: -200px;
  right: -200px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: var(--accent-secondary);
  bottom: -150px;
  left: -150px;
  animation-delay: -5s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-30px, 30px); }
}

/* Login Card */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: rgba(18, 18, 31, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.5rem;
  animation: cardAppear 0.5s ease;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 16px;
  margin: 0 auto 1.5rem;
  color: white;
}

.login-icon svg {
  width: 32px;
  height: 32px;
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: var(--text-secondary);
  font-size: 0.9375rem;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  pointer-events: none;
}

.input-wrapper .input {
  padding-left: 3rem;
  padding-right: 3rem;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.toggle-password:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.toggle-password svg {
  width: 20px;
  height: 20px;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  color: #ef4444;
  font-size: 0.875rem;
}

.error-message svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.error-enter-active,
.error-leave-active {
  transition: all 0.3s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Login Button */
.login-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Footer */
.login-footer {
  margin-top: 2rem;
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--accent-primary);
}

.back-link svg {
  width: 18px;
  height: 18px;
}

/* Responsive */
@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
}
</style>
