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
            
            <!-- Video File -->
            <div class="form-group">
              <label class="form-label">Video File (MP4, WebM)</label>
              <div class="file-upload-container" :class="{ 'has-file': videoFile }">
                <input 
                  type="file" 
                  ref="videoInput"
                  accept="video/mp4,video/webm"
                  @change="handleVideoChange"
                  class="file-input-hidden"
                />
                <div class="file-drop-area" @click="$refs.videoInput.click()">
                  <div class="upload-icon" v-if="!videoFile">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 16.2091 19.2091 18 17 18H7C4.79086 18 3 16.2091 3 14C3 11.7909 4.79086 10 7 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 12V15M12 12L10 13.5M12 12L14 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="file-info" v-else>
                    <span class="file-name">{{ videoFile.name }}</span>
                    <span class="file-size">{{ formatSize(videoFile.size) }}</span>
                  </div>
                  <p class="upload-text" v-if="!videoFile">Click to select video</p>
                  <button v-else type="button" class="remove-file" @click.stop="videoFile = null">Remove</button>
                </div>
              </div>
              <div class="input-fallback" v-if="!videoFile">
                <span>Or enter filename:</span>
                <input v-model="formData.filename" placeholder="video.mp4" class="input input-sm" />
              </div>
            </div>
            
            <!-- Thumbnail File -->
            <div class="form-group">
              <label class="form-label">Thumbnail (Optional)</label>
              <div class="file-upload-container thumb-upload" :class="{ 'has-file': thumbFile }">
                <input 
                  type="file" 
                  ref="thumbInput"
                  accept="image/jpeg,image/png,image/webp"
                  @change="handleThumbChange"
                  class="file-input-hidden"
                />
                <div class="file-drop-area" @click="$refs.thumbInput.click()">
                  <div class="upload-icon" v-if="!thumbFile">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 16L8.58579 11.4142C9.36683 10.6332 10.6332 10.6332 11.4142 11.4142L16 16M14 14L15.5858 12.4142C16.3668 11.6332 17.6332 11.6332 18.4142 12.4142L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <img v-else :src="thumbPreview" class="thumb-preview" />
                  <p class="upload-text" v-if="!thumbFile">Click to select thumbnail</p>
                  <button v-else type="button" class="remove-file" @click.stop="removeThumb">Remove</button>
                </div>
              </div>
              <div class="input-fallback" v-if="!thumbFile">
                <span>Or enter filename:</span>
                <input v-model="formData.thumbnailFilename" placeholder="thumb.jpg" class="input input-sm" />
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div v-if="isUploading" class="upload-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
              </div>
              <span class="progress-text">Uploading... {{ uploadProgress }}%</span>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <!-- Actions -->
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="close" :disabled="isUploading">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="!isValid || isUploading">
                <span v-if="isUploading">Uploading...</span>
                <span v-else>{{ isEdit ? 'Save Changes' : 'Add Video' }}</span>
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

const error = ref('')
const isUploading = ref(false)
const uploadProgress = ref(0)

const videoFile = ref(null)
const thumbFile = ref(null)
const thumbPreview = ref(null)

const formData = ref({
  name: '',
  filename: '',
  thumbnailFilename: ''
})

const isEdit = computed(() => !!props.video)

const isValid = computed(() => {
  return formData.value.name.trim() !== '' && (formData.value.filename.trim() !== '' || videoFile.value)
})

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.video) {
      const videoFilename = props.video.url ? props.video.url.replace('/uploaded-video/', '') : ''
      const thumbFilename = props.video.thumbnail ? props.video.thumbnail.replace('/uploaded-video/', '') : ''
      
      formData.value = {
        name: props.video.name,
        filename: videoFilename,
        thumbnailFilename: thumbFilename
      }
    } else {
      formData.value = {
        name: '',
        filename: '',
        thumbnailFilename: ''
      }
    }
    videoFile.value = null
    thumbFile.value = null
    thumbPreview.value = null
    error.value = ''
    isUploading.value = false
    uploadProgress.value = 0
  }
})

const handleVideoChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    videoFile.value = file
    formData.value.filename = file.name
  }
}

const handleThumbChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    thumbFile.value = file
    formData.value.thumbnailFilename = file.name
    thumbPreview.value = URL.createObjectURL(file)
  }
}

const removeThumb = () => {
  thumbFile.value = null
  thumbPreview.value = null
  formData.value.thumbnailFilename = ''
}

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleSubmit = async () => {
  if (!isValid.value) return
  
  isUploading.value = true
  error.value = ''
  uploadProgress.value = 10

  try {
    let finalVideoUrl = props.video?.url || `/uploaded-video/${formData.value.filename.trim()}`
    let finalThumbUrl = props.video?.thumbnail || (formData.value.thumbnailFilename.trim() ? `/uploaded-video/${formData.value.thumbnailFilename.trim()}` : null)

    // Handle real file uploads if present
    if (videoFile.value || thumbFile.value) {
      const formDataUpload = new FormData()
      if (videoFile.value) formDataUpload.append('video', videoFile.value)
      if (thumbFile.value) formDataUpload.append('thumbnail', thumbFile.value)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to upload files to local storage')
      }

      const result = await response.json()
      
      if (videoFile.value && result.files.video) {
        finalVideoUrl = `/uploaded-video/${result.files.video[0].originalFilename}`
      }
      if (thumbFile.value && result.files.thumbnail) {
        finalThumbUrl = `/uploaded-video/${result.files.thumbnail[0].originalFilename}`
      }
      
      uploadProgress.value = 100
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    emit('submit', {
      id: props.video?.id,
      name: formData.value.name.trim(),
      url: finalVideoUrl,
      thumbnail: finalThumbUrl
    })
    
    close()
  } catch (e) {
    console.error(e)
    error.value = e.message
  } finally {
    isUploading.value = false
  }
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
  max-width: 520px;
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

.modal-form {
  padding: 1.5rem;
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

.file-upload-container {
  position: relative;
  background: var(--bg-tertiary);
  border: 2px dashed var(--glass-border);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.file-upload-container:hover {
  border-color: var(--accent-primary);
  background: rgba(139, 92, 246, 0.05);
}

.file-upload-container.has-file {
  border-style: solid;
  border-color: var(--accent-primary);
}

.file-input-hidden {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.file-drop-area {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.upload-icon {
  width: 40px;
  height: 40px;
  color: var(--text-muted);
}

.upload-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.file-name {
  font-weight: 600;
  color: var(--text-primary);
  word-break: break-all;
}

.file-size {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.remove-file {
  position: relative;
  z-index: 3;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.thumb-preview {
  width: 100px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.input-fallback {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.input-sm {
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent-gradient);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--accent-primary);
  text-align: center;
}

.error-message {
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.modal-actions .btn {
  flex: 1;
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
