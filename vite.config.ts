import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

function backendOrigin(value?: string): string {
  if (!value) return ''

  const invalidOrigin = 'VITE_BACKEND_URL debe ser el origen del backend, por ejemplo https://api.example.org.'
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error(invalidOrigin)
  }

  if (
    !['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
    url.pathname !== '/' || url.search || url.hash
  ) {
    throw new Error(invalidOrigin)
  }
  return url.origin
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(backendOrigin(env.VITE_BACKEND_URL)),
    },
    resolve: {
      alias: {
        '@': resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  }
})
