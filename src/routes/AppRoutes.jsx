import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
<Route path="/login" element={<Login />} />

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}