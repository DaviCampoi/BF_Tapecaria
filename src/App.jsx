import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Contato from "./pages/Contato"
import Catalogo from "./pages/Catalogo"
import Login from "./pages/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App