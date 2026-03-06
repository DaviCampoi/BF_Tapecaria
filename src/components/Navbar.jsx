import { Link } from "react-router-dom"
import { useState } from "react"
import logo from "../assets/logo-bf.png"

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar navbar-custom px-4">

      <Link to="/">
        <img src={logo} alt="BF Logo" height="60" />
      </Link>

      {/* MENU DESKTOP */}
      <div className="nav-desktop ms-auto">
        <Link className="nav-link-custom" to="/">HOME</Link>
        <Link className="nav-link-custom" to="/contato">CONTATO</Link>
        <Link className="nav-link-custom" to="/catalogo">CATALOGO</Link>
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
        <Link onClick={()=>setMenuOpen(false)} to="/catalogo">CATALOGO</Link>
        <Link onClick={()=>setMenuOpen(false)} to="/login">LOGIN</Link>
      </div>

    </nav>
  )
}