import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Yayın (build) ve önizleme (preview) GitHub Pages'teki /gunes-mum/ alt adresini kullanır;
// geliştirme sunucusu (npm run dev) kökte kalır.
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  base: command === 'build' || isPreview ? '/gunes-mum/' : '/',
}))
