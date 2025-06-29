// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  
  // Optimisations build pour Netlify
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html',
      
      // 🔧 FIX: Code splitting forcé pour Netlify
      output: {
        manualChunks: {
          // Vendor libraries dans un chunk séparé
          vendor: ['react', 'react-dom', 'react-router-dom'],
          
          // UI components séparés  
          ui: ['lucide-react'],
          
          // i18n séparé pour lazy loading
          i18n: ['react-i18next', 'i18next', 'i18next-browser-languagedetector']
        },
        
        // Noms de fichiers optimisés
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    
    // Taille des chunks optimisée
    chunkSizeWarningLimit: 1000,
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Minification simple (esbuild est plus compatible)
    minify: 'esbuild',
    
    // Source maps désactivées en prod
    sourcemap: false,
    
    // Optimisation des assets
    assetsInlineLimit: 4096,
    
    // Target moderne mais compatible
    target: 'es2015'
  },
  
  // 🔧 FIX: Variables d'environnement pour Netlify
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production')
  },
  
  // Optimisations dev
  server: {
    hmr: {
      overlay: false
    },
    
    // Proxy pour l'API en dev
    proxy: {
      '/api': {
        target: 'https://ecolojia-backendv1.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  },
  
  // Optimisations de résolution
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  
  // Préchargement des modules
  optimizeDeps: {
    include: [
      'react',
      'react-dom', 
      'react-router-dom',
      'react-i18next',
      'lucide-react'
    ]
  }
})