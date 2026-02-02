<template>
  <div class="app">
    <nav class="main-nav">
      <div class="nav-brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 8.5L15.5 12L9.5 15.5V8.5Z" fill="currentColor"/>
            <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <span class="brand-text">VideoShowcase</span>
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-link">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          <span>Showcase</span>
        </router-link>
        <router-link v-if="authStore.isAuthenticated" to="/dashboard" class="nav-link">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>Dashboard</span>
        </router-link>
        <router-link v-if="!authStore.isAuthenticated" to="/login" class="nav-link">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Login</span>
        </router-link>
        <button v-if="authStore.isAuthenticated" @click="handleLogout" class="nav-link logout-btn">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(15, 15, 25, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 12px;
  color: white;
}

.brand-icon svg {
  width: 24px;
  height: 24px;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link svg {
  width: 20px;
  height: 20px;
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.nav-link.router-link-exact-active {
  color: var(--accent-primary);
  background: rgba(139, 92, 246, 0.15);
}

.logout-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

.logout-btn:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.main-content {
  flex: 1;
  padding-top: 80px;
}
</style>
