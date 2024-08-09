import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['scanner.png'],
      manifest: {
        name: 'IdentiTicket',
        short_name: 'IdentiTicket',
        description: 'Validate tickets quickly and securely',
        theme_color: '#3730a3',
        icons: [
          {
            src: 'scanner.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'scanner.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})