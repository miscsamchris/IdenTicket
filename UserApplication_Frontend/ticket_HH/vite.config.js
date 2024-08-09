import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['booking.png'],
      manifest: {
        name: 'Web3 Train Ticketing',
        short_name: 'Train Tickets',
        description: 'Book your train tickets using blockchain technology',
        theme_color: '#4c1d95',
        icons: [
          {
            src: 'booking.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'booking.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})