import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db, storage } from '../firebase'
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
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage'

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

    // Upload file to Firebase Storage
    const uploadFile = async (file, path) => {
        const fileRef = storageRef(storage, path)
        await uploadBytes(fileRef, file)
        return await getDownloadURL(fileRef)
    }

    // Add a new video
    const addVideo = async (videoData, videoFile, thumbFile) => {
        try {
            let videoUrl = videoData.url
            let thumbUrl = videoData.thumbnail

            // Upload Video
            if (videoFile) {
                const filename = `videos/${Date.now()}_${videoFile.name}`
                videoUrl = await uploadFile(videoFile, filename)
            }

            // Upload Thumbnail
            if (thumbFile) {
                const filename = `thumbnails/${Date.now()}_${thumbFile.name}`
                thumbUrl = await uploadFile(thumbFile, filename)
            }

            // Save to Firestore
            await addDoc(collection(db, 'videos'), {
                name: videoData.name,
                url: videoUrl,
                thumbnail: thumbUrl || null,
                createdAt: new Date().toISOString(),
                // Simplified ordering for now
                order: videos.value.length
            })
            return true
        } catch (e) {
            console.error("Error adding video:", e)
            throw e
        }
    }

    // Update video
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
    const deleteVideo = async (id, videoData) => {
        try {
            // Delete from Firestore
            await deleteDoc(doc(db, 'videos', id))

            // Attempt to delete files from storage if they exist and look like firebase URLs
            // (Skipping complex check for now to avoid breaking legacy/external URLs)
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

    // Initial Load
    loadVideos()

    return {
        videos,
        isLoaded,
        videoCount,
        addVideo,
        updateVideo,
        deleteVideo,
        getVideoById
    }
})
