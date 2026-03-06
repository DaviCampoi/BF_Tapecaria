import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Contato from "./pages/Contato"
import Catalogo from "./pages/Catalogo"
import Login from "./pages/Login"
import Clientes from "./pages/Clientes"
import Calendario from "./pages/Calendario"
import Estoque from "./pages/Estoque"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/estoque" element={<Estoque />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App