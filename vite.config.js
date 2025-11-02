import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: './',  // ✅ Add this line to make asset paths relative (fixes CSS/JS loading issue)

  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT) || 4173, // ✅ Uses PORT if provided
  },

  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT) || 4173,
    allowedHosts: ['milkdashboard.onrender.com', 'admin.palkkaran.in'],
  },
})
