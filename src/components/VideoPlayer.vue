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
          <h2 class="video-title">{{ video?.name }}</h2>
          
          <!-- Phone Frame -->
          <div class="phone-mockup">
            <div class="phone-speaker"></div>
            <div class="phone-screen">
              <video 
                ref="videoElement"
                :src="video?.url"
                class="video"
                controls
                autoplay
                playsinline
              />
            </div>
            <div class="phone-home-bar"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  video: { type: Object, default: null },
  isOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])
const videoElement = ref(null)

const close = () => {
  if (videoElement.value) videoElement.value.pause()
  emit('close')
}

watch(() => props.isOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) {
    const handleEscape = (e) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }
})
</script>

<style scoped>
.video-player-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.player-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.close-btn {
  position: fixed;
  top: 20px;
  right: 20px;
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
}

.close-btn svg {
  width: 22px;
  height: 22px;
}

.video-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  text-align: center;
}

/* Phone Mockup */
.phone-mockup {
  position: relative;
  width: 280px;
  height: 580px;
  background: #1a1a1a;
  border-radius: 36px;
  padding: 10px;
  box-shadow: 
    0 0 0 2px #333,
    0 20px 50px rgba(0, 0, 0, 0.5);
}

.phone-speaker {
  width: 80px;
  height: 6px;
  background: #333;
  border-radius: 3px;
  margin: 8px auto 10px;
}

.phone-screen {
  width: 100%;
  height: calc(100% - 50px);
  background: #000;
  border-radius: 26px;
  overflow: hidden;
}

.video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.phone-home-bar {
  width: 100px;
  height: 4px;
  background: #444;
  border-radius: 2px;
  margin: 12px auto 0;
}

/* Transitions */
.player-enter-active, .player-leave-active {
  transition: opacity 0.3s ease;
}
.player-enter-from, .player-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-height: 700px) {
  .phone-mockup {
    width: 220px;
    height: 460px;
  }
}

@media (max-height: 550px) {
  .phone-mockup {
    width: 180px;
    height: 380px;
  }
  .video-title {
    font-size: 1rem;
  }
}
</style>
