import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
server: {
  host: '0.0.0.0',
  port: parseInt(process.env.PORT) || 4173, // ✅ Uses the PORT from Render if available
},
preview: {
  host: '0.0.0.0',
  port: parseInt(process.env.PORT) || 4173, // ✅ Same here for preview mode
  allowedHosts: ['milkdashboard.onrender.com', 'admin.palkkaran.in'],
},

})