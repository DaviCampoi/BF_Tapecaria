/*
  Configuração do Vite para o projeto

  - Define como o projeto React é buildado e servido
  - Utiliza o plugin oficial do React
  - Arquivo responsável por bundling e dev server
*/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
