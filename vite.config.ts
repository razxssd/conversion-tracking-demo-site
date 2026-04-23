import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const sdkUrl = env.VITE_SDK_URL || 'https://track.test.rebrandly.click/sdk/latest/rbly.min.js'
  const apiKey = env.VITE_API_KEY || ''

  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'html-env-replace',
        transformIndexHtml(html) {
          return html
            .replace('%VITE_SDK_URL%', sdkUrl)
            .replace('%VITE_API_KEY%', apiKey)
        },
      },
    ],
  }
})
