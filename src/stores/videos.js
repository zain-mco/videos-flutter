import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useVideoStore = defineStore('videos', () => {
    const videos = ref([])

    // Load videos from localStorage on init
    const loadVideos = () => {
        const saved = localStorage.getItem('showcase-videos')
        if (saved) {
            videos.value = JSON.parse(saved)
        }
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
            url: video.url, // Path like /uploaded-video/filename.mp4
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
