/*
  Este componente representa a Navbar principal do site.
  - Exibe o logo da empresa.
  - Possui menu de navegação para desktop.
  - Possui menu responsivo para mobile (hamburguer).
*/

import { Link } from "react-router-dom"
import { useState } from "react"
import logo from "../assets/logo-bf.png"

export default function Navbar() {

   /* Controle de abertura do menu mobile */
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    /* Estrutura principal da navbar */
    <nav className="navbar navbar-custom px-4">
      {/* Logo da empresa (redireciona para home) */}
      <Link to="/">
        <img src={logo} alt="BF Logo" height="60" />
      </Link>

      {/* MENU DESKTOP */}
      <div className="nav-desktop ms-auto">
        <Link className="nav-link-custom" to="/">HOME</Link>
        <Link className="nav-link-custom" to="/contato">CONTATO</Link>
        <Link className="nav-link-custom" to="/catalogo">CATÁLOGO</Link>
      </div>

      {/* BOTÃO MOBILE */}
      <button
        className="menu-toggle hamb"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* MENU MOBILE */}
      <div className={`menu-mobile ${menuOpen ? "open" : ""}`}>
        <Link onClick={()=>setMenuOpen(false)} to="/">HOME</Link>
        <Link onClick={()=>setMenuOpen(false)} to="/contato">CONTATO</Link>
        <Link onClick={()=>setMenuOpen(false)} to="/catalogo">CATÁLOGO</Link>
      </div>

    </nav>
  )
}