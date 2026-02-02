<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="title-line">Mobile App</span>
          <span class="title-line text-gradient">Video Demos</span>
        </h1>
        <p class="hero-subtitle">
          Explore our collection of stunning mobile application demonstrations
        </p>
      </div>
      
      <!-- Animated Background -->
      <div class="hero-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
    </section>
    
    <!-- Video Showcase -->
    <section class="showcase-section">
      <VideoShowcase 
        v-if="videos.length > 0"
        :videos="videos" 
        @play="openPlayer" 
      />
      
      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 8.5L15.5 12L9.5 15.5V8.5Z" fill="currentColor"/>
            <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h3 class="empty-title">No Videos Yet</h3>
        <p class="empty-text">Add your first video from the dashboard to get started</p>
        <router-link to="/dashboard" class="btn btn-primary">
          Go to Dashboard
        </router-link>
      </div>
    </section>
    
    <!-- Video Player Modal -->
    <VideoPlayer 
      :video="selectedVideo" 
      :is-open="isPlayerOpen" 
      @close="closePlayer" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useVideoStore } from '../stores/videos'
import VideoShowcase from '../components/VideoShowcase.vue'
import VideoPlayer from '../components/VideoPlayer.vue'

const videoStore = useVideoStore()
const videos = computed(() => videoStore.sortedVideos)

const selectedVideo = ref(null)
const isPlayerOpen = ref(false)

const openPlayer = (video) => {
  selectedVideo.value = video
  isPlayerOpen.value = true
}

const closePlayer = () => {
  isPlayerOpen.value = false
  selectedVideo.value = null
}
</script>

<style scoped>
.home-view {
  min-height: calc(100vh - 80px);
}

/* Hero Section */
.hero {
  position: relative;
  padding: 4rem 2rem 2rem;
  text-align: center;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.title-line {
  display: block;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto;
}

/* Animated Orbs */
.hero-bg {
  position: absolute;
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
  filter: blur(80px);
  opacity: 0.5;
  animation: orbFloat 10s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: var(--accent-primary);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: var(--accent-secondary);
  top: 50%;
  right: -100px;
  animation-delay: -3s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: var(--accent-tertiary);
  bottom: -50px;
  left: 30%;
  animation-delay: -6s;
}

@keyframes orbFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* Showcase Section */
.showcase-section {
  padding: 2rem 0;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 3rem;
  text-align: center;
}

.empty-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2));
  border-radius: 50%;
  color: var(--accent-primary);
  margin-bottom: 1.5rem;
}

.empty-icon svg {
  width: 50px;
  height: 50px;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-text {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>
