/*
  Este arquivo é o ponto de entrada da aplicação React.
  - Renderiza o componente principal (App).
  - Aplica o StrictMode para boas práticas e detecção de erros.
  - Importa estilos globais e bibliotecas externas (Bootstrap).
*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/global.css'
import './styles/mobile.css'

/* Renderiza a aplicação no elemento root do HTML */
createRoot(document.getElementById('root')).render(

    /* StrictMode ajuda a identificar problemas no React */
  <StrictMode>
    <App />
  </StrictMode>
)
