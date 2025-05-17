import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    host: '0.0.0.0',
    port: 7865,
  },
   preview: {
    host: '0.0.0.0',
    port: 7865,
    allowedHosts: ['milkdashboard.onrender.com', 'admin.palkkaran.in'], 
  },
})
