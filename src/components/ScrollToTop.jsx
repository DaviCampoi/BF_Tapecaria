/*
  Este componente controla o scroll automático da página.
  - Sempre que a rota muda, a página volta para o topo.
  - Utiliza o pathname para detectar mudança de rota.
*/

import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function ScrollToTop(){
    /* Captura o caminho atual da rota */
  const { pathname } = useLocation()
    /* Rola a página para o topo ao mudar de rota */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pathname])

  return null
}