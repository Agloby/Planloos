import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// node_modules live locally (outside Google Drive) to avoid sync conflicts
const LOCAL_MODS = 'C:/Users/ArmandM/.planloos-deps/node_modules'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    modules: [LOCAL_MODS, 'node_modules'],
  },
  server: {
    fs: {
      // allow Vite to serve files from the local node_modules path
      allow: ['.', LOCAL_MODS],
    },
  },
})
