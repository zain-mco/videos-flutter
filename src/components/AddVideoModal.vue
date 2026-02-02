<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">{{ isEdit ? 'Edit Video' : 'Add New Video' }}</h3>
            <button class="close-btn" @click="close">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleSubmit" class="modal-form">
            <!-- Video Name -->
            <div class="form-group">
              <label class="form-label">Video Name</label>
              <input 
                v-model="formData.name"
                type="text" 
                class="input"
                placeholder="Enter video name..."
                required
              />
            </div>
            
            <!-- Video File Upload -->
            <div class="form-group" v-if="!isEdit">
              <label class="form-label">Video File</label>
              <div 
                class="upload-area"
                :class="{ 'has-file': formData.videoFile, 'is-dragging': isDragging }"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="handleDrop"
                @click="triggerFileInput"
              >
                <input 
                  ref="fileInput"
                  type="file" 
                  accept="video/*"
                  @change="handleFileChange"
                  hidden
                />
                
                <div v-if="formData.videoFile" class="file-preview">
                  <div class="file-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.5 8.5L15.5 12L9.5 15.5V8.5Z" fill="currentColor"/>
                      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <div class="file-info">
                    <span class="file-name">{{ formData.videoFile.name }}</span>
                    <span class="file-size">{{ formatFileSize(formData.videoFile.size) }}</span>
                  </div>
                  <button type="button" class="remove-file" @click.stop="removeFile">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
                
                <div v-else class="upload-placeholder">
                  <div class="upload-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15V3M12 3L7 8M12 3L17 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3 15V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <p class="upload-text">Drop video here or <span>browse</span></p>
                  <p class="upload-hint">MP4, WebM, MOV up to 100MB</p>
                </div>
              </div>
            </div>
            
            <!-- Error Message -->
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <!-- Actions -->
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="!isValid || isLoading">
                <span v-if="isLoading" class="loading-spinner"></span>
                {{ isEdit ? 'Save Changes' : 'Add Video' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  video: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'submit'])

const fileInput = ref(null)
const isDragging = ref(false)
const isLoading = ref(false)
const error = ref('')

const formData = ref({
  name: '',
  videoFile: null
})

const isEdit = computed(() => !!props.video)

const isValid = computed(() => {
  if (isEdit.value) {
    return formData.value.name.trim() !== ''
  }
  return formData.value.name.trim() !== '' && formData.value.videoFile !== null
})

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.video) {
      formData.value = {
        name: props.video.name,
        videoFile: null
      }
    } else {
      formData.value = {
        name: '',
        videoFile: null
      }
    }
    error.value = ''
  }
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files?.[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const validateAndSetFile = (file) => {
  error.value = ''
  
  // Check file type
  if (!file.type.startsWith('video/')) {
    error.value = 'Please select a valid video file'
    return
  }
  
  // Check file size (100MB limit)
  if (file.size > 100 * 1024 * 1024) {
    error.value = 'File size must be less than 100MB'
    return
  }
  
  formData.value.videoFile = file
  
  // Auto-fill name from filename if empty
  if (!formData.value.name) {
    formData.value.name = file.name.replace(/\.[^/.]+$/, '')
  }
}

const removeFile = () => {
  formData.value.videoFile = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleSubmit = async () => {
  if (!isValid.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    let videoUrl = props.video?.url || null
    let thumbnailUrl = props.video?.thumbnail || null
    
    if (formData.value.videoFile) {
      // Create blob URL for the video
      videoUrl = URL.createObjectURL(formData.value.videoFile)
      
      // Generate thumbnail from video
      thumbnailUrl = await generateThumbnail(formData.value.videoFile)
    }
    
    emit('submit', {
      id: props.video?.id,
      name: formData.value.name.trim(),
      url: videoUrl,
      thumbnail: thumbnailUrl
    })
    
    close()
  } catch (err) {
    error.value = 'Failed to process video. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const generateThumbnail = (file) => {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true
    
    video.onloadeddata = () => {
      video.currentTime = 1 // Capture at 1 second
    }
    
    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob))
        } else {
          resolve(null)
        }
        URL.revokeObjectURL(video.src)
      }, 'image/jpeg', 0.8)
    }
    
    video.onerror = () => {
      resolve(null)
    }
    
    video.src = URL.createObjectURL(file)
  })
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--glass-border);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.modal-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.upload-area {
  border: 2px dashed var(--glass-border);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover,
.upload-area.is-dragging {
  border-color: var(--accent-primary);
  background: rgba(139, 92, 246, 0.05);
}

.upload-area.has-file {
  border-style: solid;
  padding: 1rem;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.upload-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  color: var(--accent-primary);
}

.upload-icon svg {
  width: 24px;
  height: 24px;
}

.upload-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.upload-text span {
  color: var(--accent-primary);
  font-weight: 500;
}

.upload-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 12px;
  color: white;
  flex-shrink: 0;
}

.file-icon svg {
  width: 24px;
  height: 24px;
}

.file-info {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.file-name {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.remove-file {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.1);
  border: none;
  border-radius: 8px;
  color: #ef4444;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.remove-file:hover {
  background: rgba(239, 68, 68, 0.2);
}

.remove-file svg {
  width: 16px;
  height: 16px;
}

.error-message {
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.modal-actions .btn {
  flex: 1;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(20px);
}
</style>
