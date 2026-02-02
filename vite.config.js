import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import formidable from 'formidable'
import fs from 'node:fs'
import path from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'file-upload-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Health check
          if (req.url === '/api/upload-test') {
            res.end(JSON.stringify({ status: 'ok' }))
            return
          }

          // Check if it's the upload path
          if (req.url.startsWith('/api/upload') && req.method === 'POST') {
            console.log('UPLOAD: Request received', req.url)

            const uploadDir = path.resolve(fileURLToPath(new URL('./public/uploaded-video', import.meta.url)))
            console.log('UPLOAD: Target dir', uploadDir)

            // Ensure directory exists
            if (!fs.existsSync(uploadDir)) {
              console.log('Creating directory:', uploadDir)
              fs.mkdirSync(uploadDir, { recursive: true })
            }

            const form = formidable({
              uploadDir,
              keepExtensions: true,
              maxFileSize: 100 * 1024 * 1024, // Increased to 100MB
              filename: (name, ext, part, form) => {
                const originalName = part.originalFilename || 'unnamed'
                console.log('Processing file:', originalName)
                return originalName
              }
            })

            form.parse(req, (err, fields, files) => {
              if (err) {
                console.error('Upload Error:', err)
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message }))
                return
              }

              console.log('Upload successful. Fields:', Object.keys(fields), 'Files:', Object.keys(files))

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

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                message: 'Upload successful',
                files: uploadedFiles
              }))
            })
          } else {
            next()
          }
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist'
  }
})
