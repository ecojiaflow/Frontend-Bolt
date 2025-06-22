// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  
  // Optimisations build
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html',
      
      // Code splitting intelligent
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
    
    // Minification avancée
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Supprimer console.log en prod
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    
    // Source maps désactivées en prod
    sourcemap: false,
    
    // Optimisation des assets
    assetsInlineLimit: 4096, // Inline les petits assets (< 4kb)
    
    // Target moderne
    target: 'esnext'
  },
  
  // Optimisations dev
  server: {
    // HMR plus rapide
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
  },
  
  // Variables d'environnement
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production')
  }
})