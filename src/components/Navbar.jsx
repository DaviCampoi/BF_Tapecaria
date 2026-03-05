import { Link } from "react-router-dom"
import logo from "../assets/logo-bf.png"

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-light sticky-top navbar-custom px-4">
  <img src={logo} alt="BF Logo" height="60" />

  <div className="ms-auto">
    <Link className="nav-link d-inline text-warning fw-bold fs-4" to="/">HOME</Link>
    <Link className="nav-link d-inline text-warning fw-bold fs-4 ms-4" to="/contato">CONTATO</Link>
    <Link className="nav-link d-inline text-warning fw-bold fs-4 ms-4" to="/catalogo">CATALOGO</Link>
  </div>
</nav>
  )
}