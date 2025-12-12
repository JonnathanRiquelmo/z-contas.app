import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  base: "/z-contas.app/",
  plugins: [
    react(),
    ...(process.env.VITE_DISABLE_PWA ? [] : [VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
      manifest: {
        name: "Z-Contas",
        short_name: "Z-Contas",
        description: "Controle financeiro simples e acessível",
        start_url: "/z-contas.app/",
        display: "standalone",
        theme_color: "#0ea5e9",
        background_color: "#ffffff",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })])
  ],
  server: {
    port: 5173,
    host: true
  }
})
