<template>
  <div class="dashboard-view">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1 class="page-title">Video Dashboard</h1>
        <p class="page-subtitle">Manage your mobile app demo videos</p>
      </div>
      <button class="btn btn-primary" @click="openAddModal">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Add Video
      </button>
    </header>
    
    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 8.5L15.5 12L9.5 15.5V8.5Z" fill="currentColor"/>
            <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ videoStore.videoCount }}</span>
          <span class="stat-label">Total Videos</span>
        </div>
      </div>
      <div class="stats-actions">
        <button v-if="videos.length > 0" class="btn btn-secondary action-btn-small" @click="downloadConfig" title="Download configuration to make videos visible to everyone">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15V3M12 15L8 11M12 15L16 11M2 17L2.621 19.484C2.8465 20.386 3.655 21 4.586 21H19.414C20.345 21 21.1535 20.386 21.379 19.484L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Download Config
        </button>
        <button v-if="videos.length > 0" class="btn btn-secondary clear-btn danger-hover" @click="showClearConfirm = true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Clear All
        </button>
      </div>
    </div>

    
    <!-- Video Grid -->
    <div class="video-grid" v-if="videos.length > 0">
      <div 
        v-for="(video, index) in videos" 
        :key="video.id"
        class="video-item"
        :style="{ '--delay': `${index * 0.05}s` }"
      >
        <!-- Thumbnail -->
        <div class="item-thumbnail" @click="playVideo(video)">
          <img v-if="video.thumbnail" :src="video.thumbnail" :alt="video.name" />
          <div v-else class="thumbnail-placeholder">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 8.5L15.5 12L9.5 15.5V8.5Z" fill="currentColor"/>
              <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="play-overlay">
            <div class="play-btn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5.5L19 12L8 18.5V5.5Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Info -->
        <div class="item-info">
          <h3 class="item-name">{{ video.name }}</h3>
          <span class="item-date">{{ formatDate(video.createdAt) }}</span>
        </div>
        
        <!-- Actions -->
        <div class="item-actions">
          <button class="action-btn" @click="openEditModal(video)" title="Edit">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.44772 4 3 4.44772 3 5V20C3 20.5523 3.44772 21 4 21H19C19.5523 21 20 20.5523 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M18.5 2.5L21.5 5.5L12 15H9V12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="action-btn danger" @click="confirmDelete(video)" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h3 class="empty-title">No Videos Yet</h3>
      <p class="empty-text">Click the "Add Video" button to upload your first video</p>
    </div>
    
    <!-- Add/Edit Modal -->
    <AddVideoModal 
      :is-open="isModalOpen"
      :video="editingVideo"
      @close="closeModal"
      @submit="handleSubmit"
    />
    
    <!-- Video Player -->
    <VideoPlayer 
      :video="playingVideo" 
      :is-open="isPlayerOpen" 
      @close="closePlayer" 
    />
    
    <!-- Delete Confirmation -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="deletingVideo" class="modal-overlay" @click.self="deletingVideo = null">
          <div class="confirm-dialog">
            <div class="confirm-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 7V13M12 16V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3 class="confirm-title">Delete Video?</h3>
            <p class="confirm-text">
              Are you sure you want to delete "<strong>{{ deletingVideo.name }}</strong>"? This action cannot be undone.
            </p>
            <div class="confirm-actions">
              <button class="btn btn-secondary" @click="deletingVideo = null">Cancel</button>
              <button class="btn btn-danger" @click="deleteVideo">Delete</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    
    <!-- Clear All Confirmation -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showClearConfirm" class="modal-overlay" @click.self="showClearConfirm = false">
          <div class="confirm-dialog">
            <div class="confirm-icon warning">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3 class="confirm-title">Clear All Videos?</h3>
            <p class="confirm-text">
              This will remove all {{ videos.length }} videos from the list. This is useful to clear old data that's no longer working.
            </p>
            <div class="confirm-actions">
              <button class="btn btn-secondary" @click="showClearConfirm = false">Cancel</button>
              <button class="btn btn-danger" @click="clearAllVideos">Clear All</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useVideoStore } from '../stores/videos'
import AddVideoModal from '../components/AddVideoModal.vue'
import VideoPlayer from '../components/VideoPlayer.vue'

const videoStore = useVideoStore()
const videos = computed(() => videoStore.sortedVideos)

// Modal state
const isModalOpen = ref(false)
const editingVideo = ref(null)

// Player state
const isPlayerOpen = ref(false)
const playingVideo = ref(null)

// Delete confirmation
const deletingVideo = ref(null)

// Clear all confirmation
const showClearConfirm = ref(false)

const clearAllVideos = () => {
  localStorage.removeItem('showcase-videos')
  videoStore.videos.splice(0, videoStore.videos.length)
  showClearConfirm.value = false
}

const downloadConfig = () => {
  const data = JSON.stringify(videoStore.videos, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'videos-config.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const openAddModal = () => {
  editingVideo.value = null
  isModalOpen.value = true
}

const openEditModal = (video) => {
  editingVideo.value = video
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingVideo.value = null
}

const handleSubmit = (data) => {
  if (data.id) {
    // Update existing video
    videoStore.updateVideo(data.id, {
      name: data.name,
      url: data.url,
      thumbnail: data.thumbnail
    })
  } else {
    // Add new video
    videoStore.addVideo({
      name: data.name,
      url: data.url,
      thumbnail: data.thumbnail
    })
  }
}

const playVideo = (video) => {
  playingVideo.value = video
  isPlayerOpen.value = true
}

const closePlayer = () => {
  isPlayerOpen.value = false
  playingVideo.value = null
}

const confirmDelete = (video) => {
  deletingVideo.value = video
}

const deleteVideo = () => {
  if (deletingVideo.value) {
    videoStore.deleteVideo(deletingVideo.value.id)
    deletingVideo.value = null
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
.dashboard-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.page-subtitle {
  color: var(--text-secondary);
}

/* Stats Bar */
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
}

.stats-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.action-btn-small {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}

.action-btn-small svg {
  width: 18px;
  height: 18px;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}

.clear-btn.danger-hover:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.confirm-icon.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 12px;
  color: white;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Video Grid */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.video-item {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: itemAppear 0.4s ease backwards;
  animation-delay: var(--delay);
}

@keyframes itemAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

.video-item:hover {
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.item-thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--bg-tertiary);
  cursor: pointer;
  overflow: hidden;
}

.item-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-item:hover .item-thumbnail img {
  transform: scale(1.05);
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.thumbnail-placeholder svg {
  width: 48px;
  height: 48px;
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
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-item:hover .play-overlay {
  opacity: 1;
}

.play-btn {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-primary);
  border-radius: 50%;
  color: white;
  transition: transform 0.3s ease;
}

.video-item:hover .play-btn {
  transform: scale(1.1);
}

.play-btn svg {
  width: 24px;
  height: 24px;
  margin-left: 2px;
}

.item-info {
  padding: 1rem 1.25rem;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  padding: 0 1.25rem 1.25rem;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.action-btn.danger:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 3rem;
  text-align: center;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.1);
  border: 2px dashed var(--accent-primary);
  border-radius: 50%;
  color: var(--accent-primary);
  margin-bottom: 1.5rem;
}

.empty-icon svg {
  width: 32px;
  height: 32px;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-text {
  color: var(--text-secondary);
}

/* Confirm Dialog */
.confirm-dialog {
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.confirm-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
  color: #ef4444;
  margin: 0 auto 1.5rem;
}

.confirm-icon svg {
  width: 32px;
  height: 32px;
}

.confirm-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.confirm-text {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.confirm-text strong {
  color: var(--text-primary);
}

.confirm-actions {
  display: flex;
  gap: 0.75rem;
}

.confirm-actions .btn {
  flex: 1;
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .confirm-dialog,
.modal-leave-to .confirm-dialog {
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-view {
    padding: 1rem;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .video-grid {
    grid-template-columns: 1fr;
  }
}
</style>
