import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['cropped_circle_image_(1).png', 'cropped_circle_image_(1).webp', 'IMG_20260918_063548_262AAA.png'],
      manifest: {
        name: 'Dampingcare',
        short_name: 'Dampingcare',
        description: 'Jasa Pendampingan Pasien, Caregiver, dan Non-Pasien di Solo Raya & Yogyakarta',
        theme_color: '#3989E8',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'id',
        icons: [
          { src: '/cropped_circle_image_(1).png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/cropped_circle_image_(1).png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,webp,png,svg,ico}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  optimizeDeps: { exclude: ['lucide-react'] },
});
