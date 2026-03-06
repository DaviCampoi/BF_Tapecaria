import { Link } from "react-router-dom"
import { useState } from "react"
import logo from "../assets/logo-bf.png"

export default function Navbaradm() {

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar navbar-custom px-4">

      <Link to="/">
        <img src={logo} alt="BF Logo" height="60" />
      </Link>

      {/* MENU DESKTOP */}
      <div className="nav-desktop ms-auto">
        <Link className="nav-link-custom" to="/">SITE</Link>
        <Link className="nav-link-custom" to="/clientes">CLIENTES</Link>
        <Link className="nav-link-custom" to="/calendario">CALENDÁRIO</Link>
        <Link className="nav-link-custom" to="/estoque">ESTOQUE</Link>
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
        <Link onClick={()=>setMenuOpen(false)} to="/">SITE</Link>
        <Link onClick={()=>setMenuOpen(false)} to="/calendario">CALENDÁRIO</Link>
        <Link onClick={()=>setMenuOpen(false)} to="/estoque">ESTOQUE</Link>

      </div>

    </nav>
  )
}