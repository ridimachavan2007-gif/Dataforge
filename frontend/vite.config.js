import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // getUserMedia requires HTTPS or localhost — this keeps local dev on
    // a fixed port so it's easy to allowlist if you tunnel it (e.g. ngrok)
    // for testing on a phone.
    port: 5173
  }
})
