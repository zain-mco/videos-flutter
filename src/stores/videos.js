import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useVideoStore = defineStore('videos', () => {
    const videos = ref([])
    const isLoaded = ref(false)

    // Load videos from localStorage or JSON file
    const loadVideos = async () => {
        // Always try to load public config first for consistency
        try {
            const response = await fetch('/videos-config.json')
            if (response.ok) {
                const data = await response.json()
                if (Array.isArray(data) && data.length > 0) {
                    videos.value = data
                    isLoaded.value = true
                    // Sync to localStorage
                    localStorage.setItem('showcase-videos', JSON.stringify(data))
                    return
                }
            }
        } catch (error) {
            console.warn('Public config not found, falling back to local storage')
        }

        // Fallback to localStorage if public config failed or was empty
        const saved = localStorage.getItem('showcase-videos')
        if (saved) {
            try {
                videos.value = JSON.parse(saved)
            } catch (e) {
                console.error('Failed to parse local storage videos')
            }
        }
        isLoaded.value = true
    }

    // Save videos to localStorage
    const saveVideos = () => {
        localStorage.setItem('showcase-videos', JSON.stringify(videos.value))
    }

    // Add a new video
    const addVideo = (video) => {
        const newVideo = {
            id: Date.now().toString(),
            name: video.name,
            url: video.url,
            thumbnail: video.thumbnail || null,
            createdAt: new Date().toISOString(),
            order: videos.value.length
        }
        videos.value.push(newVideo)
        saveVideos()
        return newVideo
    }

    // Update video
    const updateVideo = (id, updates) => {
        const index = videos.value.findIndex(v => v.id === id)
        if (index !== -1) {
            videos.value[index] = { ...videos.value[index], ...updates }
            saveVideos()
        }
    }

    // Delete video
    const deleteVideo = (id) => {
        const index = videos.value.findIndex(v => v.id === id)
        if (index !== -1) {
            videos.value.splice(index, 1)
            saveVideos()
        }
    }

    // Reorder videos
    const reorderVideos = (fromIndex, toIndex) => {
        const item = videos.value.splice(fromIndex, 1)[0]
        videos.value.splice(toIndex, 0, item)
        videos.value.forEach((v, i) => v.order = i)
        saveVideos()
    }

    // Get video by ID
    const getVideoById = (id) => {
        return videos.value.find(v => v.id === id)
    }

    // Computed
    const videoCount = computed(() => videos.value.length)
    const sortedVideos = computed(() => [...videos.value].sort((a, b) => a.order - b.order))

    // Initialize
    loadVideos()

    return {
        videos,
        isLoaded,
        sortedVideos,
        videoCount,
        addVideo,
        updateVideo,
        deleteVideo,
        reorderVideos,
        getVideoById,
        loadVideos
    }
})
