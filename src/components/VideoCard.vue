<template>
  <div class="video-card" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @click="$emit('play', video)">
    <div class="card-inner" :style="cardStyle">
      <!-- Video Preview / Thumbnail -->
      <div class="card-media">
        <video 
          v-if="isHovered && video.url" 
          ref="videoRef" 
          :src="video.url" 
          class="preview-video"
          muted
          loop
          playsinline
        />
        <div v-else class="thumbnail">
          <img v-if="video.thumbnail" :src="video.thumbnail" :alt="video.name" />
          <div v-else class="thumbnail-placeholder">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 8.5L15.5 12L9.5 15.5V8.5Z" fill="currentColor"/>
              <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
        </div>
        
        <!-- Play Button Overlay -->
        <div class="play-overlay" :class="{ 'is-hidden': isHovered }">
          <div class="play-button">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5.5L19 12L8 18.5V5.5Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
        
        <!-- Glow Effect -->
        <div class="card-glow"></div>
      </div>
      
      <!-- Card Info -->
      <div class="card-info">
        <h3 class="card-title">{{ video.name }}</h3>
        <p class="card-date">{{ formatDate(video.createdAt) }}</p>
      </div>
    </div>
    
    <!-- Floating Particles -->
    <div class="particles">
      <span v-for="i in 3" :key="i" class="particle" :style="{ '--delay': `${i * 0.5}s` }"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  video: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

defineEmits(['play'])

const isHovered = ref(false)
const videoRef = ref(null)

const cardStyle = computed(() => ({
  '--delay': `${props.index * 0.1}s`
}))

const handleMouseEnter = async () => {
  isHovered.value = true
  await nextTick()
  if (videoRef.value) {
    videoRef.value.currentTime = 0
    videoRef.value.play().catch(() => {})
  }
}

const handleMouseLeave = () => {
  isHovered.value = false
  if (videoRef.value) {
    videoRef.value.pause()
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<style scoped>
.video-card {
  position: relative;
  cursor: pointer;
  perspective: 1000px;
}

.card-inner {
  position: relative;
  background: linear-gradient(145deg, rgba(26, 26, 46, 0.8), rgba(15, 15, 25, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: cardAppear 0.6s ease backwards;
  animation-delay: var(--delay);
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.video-card:hover .card-inner {
  transform: translateY(-10px) scale(1.02);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 60px rgba(139, 92, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.card-media {
  position: relative;
  aspect-ratio: 9 / 16;
  overflow: hidden;
  background: var(--bg-tertiary);
}

.preview-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 50%;
  color: white;
}

.thumbnail-placeholder svg {
  width: 40px;
  height: 40px;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.play-overlay.is-hidden {
  opacity: 0;
}

.play-button {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  transition: all 0.3s ease;
}

.video-card:hover .play-button {
  transform: scale(1.1);
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
}

.play-button svg {
  width: 30px;
  height: 30px;
  margin-left: 4px;
}

.card-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.video-card:hover .card-glow {
  opacity: 1;
}

.card-info {
  padding: 1.25rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Floating Particles */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: 20px;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--accent-primary);
  border-radius: 50%;
  opacity: 0;
  filter: blur(1px);
}

.video-card:hover .particle {
  animation: floatParticle 2s ease-in-out infinite;
  animation-delay: var(--delay);
}

.particle:nth-child(1) { left: 20%; bottom: 0; }
.particle:nth-child(2) { left: 50%; bottom: 0; }
.particle:nth-child(3) { left: 80%; bottom: 0; }

@keyframes floatParticle {
  0% {
    opacity: 0;
    transform: translateY(0) scale(1);
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
    transform: translateY(-200px) scale(0);
  }
}
</style>
