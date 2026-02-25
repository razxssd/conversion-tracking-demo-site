import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { readFileSync } from 'fs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const sdkUrl = env.VITE_SDK_URL || '/sdk/rbly.js'

  return {
    base: '/conversion-tracking/demo/',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'html-env-replace',
        transformIndexHtml(html) {
          return html.replace('%VITE_SDK_URL%', sdkUrl)
        },
      },
      {
        // In dev, serve the SDK from the adjacent directory at /sdk/rbly.js
        name: 'serve-sdk',
        configureServer(server) {
          server.middlewares.use('/sdk/rbly.js', (_req, res) => {
            const sdkPath = resolve(__dirname, '../conversion-tracking-sdk/dist/rbly.js')
            try {
              const content = readFileSync(sdkPath, 'utf-8')
              res.setHeader('Content-Type', 'application/javascript')
              res.end(content)
            } catch {
              res.statusCode = 404
              res.end('SDK not found. Run "npm run build" in conversion-tracking-sdk/')
            }
          })
        },
      },
    ],
    server: {
      fs: {
        allow: ['..'],
      },
    },
  }
})
