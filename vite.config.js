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
          const url = new URL(req.url, `http://${req.headers.host}`)
          const pathname = url.pathname

          // Log any API request for debugging
          if (pathname.startsWith('/api')) {
            console.log(`[API DEBUG] ${req.method} ${pathname}`)
          }

          // Health check
          if (pathname === '/api/upload-test') {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'ok', serverTime: new Date().toISOString() }))
            return
          }

          // Check if it's the upload path
          if (pathname === '/api/upload' && req.method === 'POST') {
            console.log('UPLOAD: Processing POST request...')

            const uploadDir = path.resolve(fileURLToPath(new URL('./public/uploaded-video', import.meta.url)))

            // Ensure directory exists
            if (!fs.existsSync(uploadDir)) {
              console.log('UPLOAD: Creating directory:', uploadDir)
              fs.mkdirSync(uploadDir, { recursive: true })
            }

            const form = formidable({
              uploadDir,
              keepExtensions: true,
              maxFileSize: 100 * 1024 * 1024, // 100MB
              filename: (name, ext, part, form) => {
                const originalName = part.originalFilename || `file-${Date.now()}${ext}`
                console.log('UPLOAD: Saving file as:', originalName)
                return originalName
              }
            })

            form.parse(req, (err, fields, files) => {
              if (err) {
                console.error('UPLOAD ERROR:', err)
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message }))
                return
              }

              console.log('UPLOAD SUCCESS: Received files:', Object.keys(files))

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
