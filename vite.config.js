import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // نفس مسار الإنتاج؛ يتجاوز حظر CORS لـ hits.dwyl أثناء التطوير
      '/api/visit': {
        target: 'https://hits.dwyl.com',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/Si1verSurfer/tasneem_ayman.json',
      },
    },
  },
  plugins: [
    preact(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 512,
      deleteOriginFile: false,
    }),
  ],
  build: {
    target: 'es2020',
    cssMinify: true,
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 600,
  },
})
