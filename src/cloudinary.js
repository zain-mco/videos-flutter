// Cloudinary Configuration
export const cloudinaryConfig = {
    cloudName: 'dhrglhjcb',
    uploadPreset: 'video_showcase'
}

// Upload file to Cloudinary
export const uploadToCloudinary = async (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', cloudinaryConfig.uploadPreset)

    // Determine resource type
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image'

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${resourceType}/upload`,
        {
            method: 'POST',
            body: formData
        }
    )

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Upload failed')
    }

    const data = await response.json()
    return data.secure_url
}
