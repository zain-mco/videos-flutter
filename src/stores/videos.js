import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '../firebase'
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore'
import { uploadToCloudinary } from '../cloudinary'

export const useVideoStore = defineStore('videos', () => {
    const videos = ref([])
    const isLoaded = ref(false)
    const error = ref(null)

    // Real-time listener for videos
    const loadVideos = () => {
        const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'))

        onSnapshot(q, (snapshot) => {
            videos.value = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            isLoaded.value = true
        }, (err) => {
            console.error("Error fetching videos:", err)
            error.value = err.message
            isLoaded.value = true
        })
    }

    // Add a new video
    const addVideo = async (videoData, videoFile, thumbFile) => {
        try {
            let videoUrl = videoData.url || ''
            let thumbUrl = videoData.thumbnail || null

            // Upload Video to Cloudinary
            if (videoFile) {
                console.log('Uploading video to Cloudinary...')
                videoUrl = await uploadToCloudinary(videoFile)
                console.log('Video uploaded:', videoUrl)
            }

            // Upload Thumbnail to Cloudinary
            if (thumbFile) {
                console.log('Uploading thumbnail to Cloudinary...')
                thumbUrl = await uploadToCloudinary(thumbFile)
                console.log('Thumbnail uploaded:', thumbUrl)
            }

            // Save metadata to Firestore
            await addDoc(collection(db, 'videos'), {
                name: videoData.name,
                url: videoUrl,
                thumbnail: thumbUrl,
                createdAt: new Date().toISOString(),
                order: videos.value.length
            })
            return true
        } catch (e) {
            console.error("Error adding video:", e)
            throw e
        }
    }

    // Update video first
    const updateVideo = async (id, updates) => {
        try {
            const videoRef = doc(db, 'videos', id)
            await updateDoc(videoRef, updates)
        } catch (e) {
            console.error("Error updating video:", e)
            throw e
        }
    }

    // Delete video
    const deleteVideo = async (id) => {
        try {
            await deleteDoc(doc(db, 'videos', id))
        } catch (e) {
            console.error("Error deleting video:", e)
            throw e
        }
    }

    // Get video by ID
    const getVideoById = (id) => {
        return videos.value.find(v => v.id === id)
    }

    // Computed
    const videoCount = computed(() => videos.value.length)
    const sortedVideos = computed(() => [...videos.value].sort((a, b) => (a.order || 0) - (b.order || 0)))

    // Initial Load
    loadVideos()

    return {
        videos,
        isLoaded,
        videoCount,
        sortedVideos,
        addVideo,
        updateVideo,
        deleteVideo,
        getVideoById
    }
})
