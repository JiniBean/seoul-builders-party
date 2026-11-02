import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins:[react(),tailwindcss()],
  resolve:{alias:{'@':path.resolve(import.meta.dirname,'src')}},
  server:{host:'0.0.0.0',port:Number(process.env.PORT || 5173),allowedHosts:true},
  preview:{host:'0.0.0.0',port:Number(process.env.PORT || 5173),allowedHosts:true},
});
