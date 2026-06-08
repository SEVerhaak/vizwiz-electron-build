import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
      react(),
  ],
  base: './', // ← critical for Electron production
  build: {
    outDir: 'dist',
  },
})