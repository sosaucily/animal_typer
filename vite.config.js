import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { voiceStudioServer } from './scripts/voiceStudioServer.mjs'

export default defineConfig({
  plugins: [react(), voiceStudioServer({ directory: process.env.ALPHABET_ZOO_VOICE_DIR })],
})
