<template>
  <Teleport to="body">
    <Transition name="player">
      <div v-if="isOpen" class="video-player-overlay" @click.self="close">
        <div class="player-container">
          <!-- Close Button -->
          <button class="close-btn" @click="close">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          
          <!-- Video Title -->
          <div class="player-header">
            <h2 class="video-title">{{ video?.name }}</h2>
          </div>
          
          <!-- Video Player -->
          <div class="player-wrapper">
            <!-- Loading State -->
            <div v-if="isLoading" class="loading-overlay">
              <div class="spinner"></div>
              <p>Loading video...</p>
            </div>
            
            <!-- Error State -->
            <div v-if="hasError" class="error-overlay">
              <p>Failed to load video</p>
              <button class="retry-btn" @click="retryLoad">Retry</button>
            </div>
            
            <video 
              ref="videoElement"
              :src="video?.url"
              class="main-video"
              controls
              autoplay
              playsinline
              @loadstart="isLoading = true"
              @canplay="isLoading = false"
              @error="handleError"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  video: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const videoElement = ref(null)
const isLoading = ref(false)
const hasError = ref(false)

const close = () => {
  if (videoElement.value) {
    videoElement.value.pause()
  }
  emit('close')
}

const handleError = (e) => {
  console.error('Video playback error:', e)
  isLoading.value = false
  hasError.value = true
}

const retryLoad = () => {
  hasError.value = false
  isLoading.value = true
  if (videoElement.value) {
    videoElement.value.load()
  }
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    isLoading.value = true
    hasError.value = false
    document.body.style.overflow = 'hidden'
    const handleEscape = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.video-player-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.player-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
}

.close-btn {
  position: absolute;
  top: -50px;
  right: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.close-btn svg {
  width: 24px;
  height: 24px;
}

.player-header {
  text-align: center;
}

.video-title {
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.player-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}

.main-video {
  width: 100%;
  max-height: 70vh;
  display: block;
  background: black;
}

/* Loading & Error Overlays */
.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 5;
  color: white;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--accent-primary, #8b5cf6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.retry-btn {
  padding: 0.5rem 1.5rem;
  background: var(--accent-primary, #8b5cf6);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  cursor: pointer;
}

.retry-btn:hover {
  opacity: 0.8;
}

/* Transitions */
.player-enter-active,
.player-leave-active {
  transition: all 0.3s ease;
}

.player-enter-from,
.player-leave-to {
  opacity: 0;
}

.player-enter-from .player-container,
.player-leave-to .player-container {
  transform: scale(0.95);
}
</style>
