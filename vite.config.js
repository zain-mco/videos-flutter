import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import formidable from 'formidable'
import fs from 'node:fs'
import path from 'node:path'

// Custom middleware function
const uploadMiddleware = (req, res, next) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname

  // Log everything for debug
  if (req.url.includes('/api/')) {
    console.log(`[MIDDLEWARE HIT] ${req.method} ${req.url}`)
  }

  // Health check
  if (pathname === '/api/upload-test') {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ status: 'ok', time: Date.now() }))
    return
  }

  // Upload handler
  if (pathname === '/api/upload' && req.method === 'POST') {
    console.log('STARTING UPLOAD...')
    const uploadDir = path.resolve(fileURLToPath(new URL('./public/uploaded-video', import.meta.url)))

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
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
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

      console.log('UPLOAD COMPLETED')
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ message: 'Success', files: uploadedFiles }))
    })
  } else {
    next()
  }
}

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'api-middleware',
      configureServer(server) {
        // Post-middleware to ensure we catch it if nothing else does,
        // but typically better as pre-middleware.
        server.middlewares.use(uploadMiddleware)
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // Force handle API routes
    proxy: {
    }
  }
})
