<template>
  <div class="showcase-container">
    <!-- 3D Carousel -->
    <div class="carousel-wrapper">
      <div class="carousel-track">
        <div 
          v-for="(video, index) in videos"
          :key="video.id"
          class="carousel-item"
          :class="{ 'is-active': index === activeIndex }"
          :style="getItemStyle(index)"
          @click="handleItemClick(index, video)"
        >
          <VideoCard :video="video" :index="index" @play="handlePlay" />
        </div>
      </div>
    </div>
    
    <!-- Navigation Controls -->
    <div class="carousel-nav" v-if="videos.length > 1">
      <button class="nav-btn prev" @click="prev" :disabled="activeIndex === 0">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <div class="nav-dots">
        <button 
          v-for="(_, index) in videos" 
          :key="index"
          class="nav-dot"
          :class="{ 'is-active': index === activeIndex }"
          @click="goTo(index)"
        />
      </div>
      
      <button class="nav-btn next" @click="next" :disabled="activeIndex === videos.length - 1">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    
    <!-- Counter -->
    <div class="carousel-counter" v-if="videos.length > 0">
      <span class="current">{{ String(activeIndex + 1).padStart(2, '0') }}</span>
      <span class="separator">/</span>
      <span class="total">{{ String(videos.length).padStart(2, '0') }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import VideoCard from './VideoCard.vue'

const props = defineProps({
  videos: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['play'])

const activeIndex = ref(0)
const cardWidth = ref(280)

const updateCardWidth = () => {
  if (window.innerWidth <= 480) {
    cardWidth.value = 200
  } else if (window.innerWidth <= 768) {
    cardWidth.value = 240
  } else {
    cardWidth.value = 280
  }
}

onMounted(() => {
  updateCardWidth()
  window.addEventListener('resize', updateCardWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCardWidth)
})

const getItemStyle = (index) => {
  const diff = index - activeIndex.value
  const absDistance = Math.abs(diff)
  
  // Responsive spacing
  const spacing = cardWidth.value * 1.15
  const translateX = diff * spacing
  const translateZ = -absDistance * 100
  const rotateY = diff * -20
  const scale = Math.max(0.75, 1 - absDistance * 0.12)
  const opacity = Math.max(0, 1 - absDistance * 0.5)
  
  return {
    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity: absDistance > 2 ? 0 : opacity,
    zIndex: 100 - absDistance,
    pointerEvents: absDistance > 1 ? 'none' : 'auto',
    width: `${cardWidth.value}px`
  }
}

const handleItemClick = (index, video) => {
  if (index === activeIndex.value) {
    emit('play', video)
  } else {
    goTo(index)
  }
}

const handlePlay = (video) => {
  emit('play', video)
}

const prev = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--
  }
}

const next = () => {
  if (activeIndex.value < props.videos.length - 1) {
    activeIndex.value++
  }
}

const goTo = (index) => {
  activeIndex.value = index
}
</script>

<style scoped>
.showcase-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 1rem;
  min-height: calc(100vh - 200px);
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
  overflow: hidden;
}

.carousel-track {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}

.carousel-item {
  position: absolute;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-style: preserve-3d;
  cursor: pointer;
}

.carousel-item.is-active {
  z-index: 100 !important;
}

/* Navigation */
.carousel-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(139, 92, 246, 0.2);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-btn svg {
  width: 20px;
  height: 20px;
}

.nav-dots {
  display: flex;
  gap: 0.5rem;
}

.nav-dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-dot:hover {
  background: rgba(255, 255, 255, 0.4);
}

.nav-dot.is-active {
  width: 24px;
  border-radius: 4px;
  background: var(--accent-gradient);
}

/* Counter */
.carousel-counter {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.carousel-counter .current {
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.carousel-counter .separator {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0 0.25rem;
}

.carousel-counter .total {
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .showcase-container {
    gap: 1.5rem;
    padding: 0.5rem;
  }
  
  .carousel-wrapper {
    height: 420px;
  }
  
  .nav-btn {
    width: 40px;
    height: 40px;
  }
  
  .nav-btn svg {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 480px) {
  .carousel-wrapper {
    height: 380px;
  }
  
  .carousel-nav {
    gap: 0.75rem;
  }
  
  .nav-btn {
    width: 36px;
    height: 36px;
  }
  
  .carousel-counter .current {
    font-size: 1.25rem;
  }
}
</style>
