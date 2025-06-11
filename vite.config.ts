import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin personnalisé pour créer _redirects
    {
      name: 'netlify-spa-redirects',
      closeBundle() {
        // Créer le dossier dist s'il n'existe pas
        const distPath = resolve(__dirname, 'dist')
        if (!existsSync(distPath)) {
          mkdirSync(distPath, { recursive: true })
        }
        
        // Créer le fichier _redirects pour Netlify SPA
        const redirectsContent = '/*    /index.html   200\n'
        const redirectsPath = resolve(distPath, '_redirects')
        
        try {
          writeFileSync(redirectsPath, redirectsContent)
          console.log('✅ _redirects créé dans dist/')
        } catch (error) {
          console.error('❌ Erreur création _redirects:', error)
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  }
})