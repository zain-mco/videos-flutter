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
import { ref } from 'vue'
import VideoCard from './VideoCard.vue'

const props = defineProps({
  videos: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['play'])

const activeIndex = ref(0)

const getItemStyle = (index) => {
  const diff = index - activeIndex.value
  const absDistance = Math.abs(diff)
  
  // Calculate position - items on left go negative, items on right go positive
  const translateX = diff * 320 // Card width + gap
  const translateZ = -absDistance * 150
  const rotateY = diff * -25
  const scale = Math.max(0.7, 1 - absDistance * 0.15)
  const opacity = Math.max(0, 1 - absDistance * 0.4)
  
  return {
    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity: absDistance > 2 ? 0 : opacity,
    zIndex: 100 - absDistance,
    pointerEvents: absDistance > 1 ? 'none' : 'auto'
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
  gap: 3rem;
  padding: 2rem;
  min-height: calc(100vh - 80px);
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
  overflow: visible;
}

.carousel-track {
  position: relative;
  width: 280px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}

.carousel-item {
  position: absolute;
  width: 280px;
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
  gap: 1.5rem;
}

.nav-btn {
  width: 50px;
  height: 50px;
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
  transform: scale(1.1);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-btn svg {
  width: 24px;
  height: 24px;
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
  font-family: 'Inter', monospace;
}

.carousel-counter .current {
  font-size: 2rem;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.carousel-counter .separator {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin: 0 0.25rem;
}

.carousel-counter .total {
  font-size: 1rem;
  color: var(--text-muted);
}

/* Responsive */
@media (max-width: 768px) {
  .carousel-wrapper {
    height: 450px;
  }
  
  .carousel-track {
    width: 220px;
  }
  
  .carousel-item {
    width: 220px;
  }
}
</style>
