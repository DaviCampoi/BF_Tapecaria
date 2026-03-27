import { useState } from "react"
import logo from "../assets/logo-bf.png"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"

export default function Navbaradm() {

const navigate = useNavigate()
const [menuOpen, setMenuOpen] = useState(false)

async function logout(){

await supabase.auth.signOut()

navigate("/login")

}

return (

<nav className="navbar navbar-custom px-4">

<Link to="/">
<img src={logo} alt="BF Logo" height="60" />
</Link>

{/* MENU DESKTOP */}

<div className="nav-desktop ms-auto d-flex align-items-center">

<Link className="nav-link-custom" to="/">SITE</Link>
<Link className="nav-link-custom" to="/clientes">CLIENTES</Link>
<Link className="nav-link-custom" to="/calendario">CALENDÁRIO</Link>
<Link className="nav-link-custom" to="/estoque">ESTOQUE</Link>

<button
className="btn btn-danger ms-3"
onClick={logout}
>
SAIR
</button>

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
<Link onClick={()=>setMenuOpen(false)} to="/clientes">CLIENTES</Link>
<Link onClick={()=>setMenuOpen(false)} to="/calendario">CALENDÁRIO</Link>
<Link onClick={()=>setMenuOpen(false)} to="/estoque">ESTOQUE</Link>

<button
className="btn btn-danger mt-3"
onClick={logout}
>
SAIR
</button>

</div>

</nav>

)

}