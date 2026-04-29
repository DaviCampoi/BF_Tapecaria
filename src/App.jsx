import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Contato from "./pages/Contato"
import Catalogo from "./pages/Catalogo"
import Login from "./pages/Login"
import Clientes from "./pages/Clientes"
import Calendario from "./pages/Calendario"
import Estoque from "./pages/Estoque"
import ScrollToTop from "./components/ScrollToTop"
import NotFound from "./pages/NotFound";
import RotaProtegida from "./components/RotaProtegida"

function App() {
  return (
      <BrowserRouter>
      <ScrollToTop />
      <Routes>

        {/* SITE */}
        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/catalogo" element={<Catalogo />} />
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* AREA ADMIN PROTEGIDA */}
        <Route
          path="/clientes"
          element={
            <RotaProtegida>
              <Clientes />
            </RotaProtegida>
          }
        />
        <Route
          path="/calendario"
          element={
            <RotaProtegida>
              <Calendario />
            </RotaProtegida>
          }
        />
        <Route
          path="/estoque"
          element={
            <RotaProtegida>
              <Estoque />
            </RotaProtegida>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App