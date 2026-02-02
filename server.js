import express from 'express'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// Enable CORS
app.use(cors())

// API Routes - BEFORE Vite
app.get('/api/upload-test', (req, res) => {
    res.json({ status: 'ok', server: 'express-standalone' })
})

app.post('/api/upload', (req, res) => {
    console.log('UPLOAD: POST request received')

    const uploadDir = path.resolve(__dirname, 'public/uploaded-video')

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    }

    const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 200 * 1024 * 1024,
        filename: (name, ext, part, form) => {
            return part.originalFilename || `file-${Date.now()}${ext}`
        }
    })

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('UPLOAD ERROR:', err)
            return res.status(500).json({ error: err.message })
        }

        console.log('UPLOAD: Success', Object.keys(files))

        const uploadedFiles = {}
        for (const [key, value] of Object.entries(files)) {
            const fileArr = Array.isArray(value) ? value : [value]
            uploadedFiles[key] = fileArr.map(f => ({
                originalFilename: f.originalFilename,
                newFilename: f.newFilename,
                mimetype: f.mimetype,
                size: f.size
            }))
        }

        res.json({ message: 'Success', files: uploadedFiles })
    })
})

// Create Vite server in middleware mode
const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa'
})

// Use vite's connect instance as middleware
app.use(vite.middlewares)

const port = 5173
app.listen(port, () => {
    console.log(`
  🚀 Server running at http://localhost:${port}
  ✅ API ready at http://localhost:${port}/api/upload
  `)
})
