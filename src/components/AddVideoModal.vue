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
            
            <!-- Video Filename -->
            <div class="form-group">
              <label class="form-label">Video Filename</label>
              <div class="input-with-prefix">
                <span class="input-prefix">/uploaded-video/</span>
                <input 
                  v-model="formData.filename"
                  type="text" 
                  class="input filename-input"
                  placeholder="video.mp4"
                  required
                />
              </div>
              <p class="form-hint">
                Place your video file in the <code>public/uploaded-video/</code> folder and enter the filename here
              </p>
            </div>
            
            <!-- Thumbnail (Optional) -->
            <div class="form-group">
              <label class="form-label">Thumbnail Filename <span class="optional">(optional)</span></label>
              <div class="input-with-prefix">
                <span class="input-prefix">/uploaded-video/</span>
                <input 
                  v-model="formData.thumbnailFilename"
                  type="text" 
                  class="input filename-input"
                  placeholder="thumbnail.jpg"
                />
              </div>
              <p class="form-hint">
                Optional: Add a thumbnail image (JPG/PNG) for the video
              </p>
            </div>
            
            <!-- Error Message -->
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <!-- Actions -->
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="!isValid">
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

const error = ref('')

const formData = ref({
  name: '',
  filename: '',
  thumbnailFilename: ''
})

const isEdit = computed(() => !!props.video)

const isValid = computed(() => {
  return formData.value.name.trim() !== '' && formData.value.filename.trim() !== ''
})

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.video) {
      // Extract filename from URL for editing
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
    error.value = ''
  }
})

const handleSubmit = () => {
  if (!isValid.value) return
  
  const filename = formData.value.filename.trim()
  const thumbnailFilename = formData.value.thumbnailFilename.trim()
  
  emit('submit', {
    id: props.video?.id,
    name: formData.value.name.trim(),
    url: `/uploaded-video/${filename}`,
    thumbnail: thumbnailFilename ? `/uploaded-video/${thumbnailFilename}` : null
  })
  
  close()
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

.form-label .optional {
  font-weight: 400;
  color: var(--text-muted);
}

.input-with-prefix {
  display: flex;
  align-items: stretch;
  background: var(--bg-tertiary);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all 0.3s ease;
}

.input-with-prefix:focus-within {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.input-prefix {
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  font-size: 0.875rem;
  font-family: monospace;
  border-right: 1px solid var(--glass-border);
  white-space: nowrap;
}

.filename-input {
  border: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.filename-input:focus {
  box-shadow: none !important;
}

.form-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.form-hint code {
  background: rgba(139, 92, 246, 0.1);
  color: var(--accent-primary);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.7rem;
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
