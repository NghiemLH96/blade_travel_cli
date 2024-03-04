import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 2000, },
    /* Config Alias */
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src/"),
        "@components": `${path.resolve(__dirname, "./src/pages/components/")}`,
        "@pages": `${path.resolve(__dirname, "./src/pages/")}`,
        "@routes": `${path.resolve(__dirname, "./src/routes/")}`,
        "@pics": `${path.resolve(__dirname, "./src/assets/pics/")}`
      },
    },

    /* Config Global Scss Variable */
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@import "src/scss/index.scss";` },
    }
  }
})
