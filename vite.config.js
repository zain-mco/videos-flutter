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
          if (req.url === '/api/upload' && req.method === 'POST') {
            const uploadDir = path.resolve(fileURLToPath(new URL('./public/uploaded-video', import.meta.url)))

            // Ensure directory exists
            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true })
            }

            const form = formidable({
              uploadDir,
              keepExtensions: true,
              maxFileSize: 50 * 1024 * 1024, // 50MB
              filename: (name, ext, part, form) => {
                return part.originalFilename || `${Date.now()}-${name}${ext}`
              }
            })

            form.parse(req, (err, fields, files) => {
              if (err) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: err.message }))
                return
              }

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
