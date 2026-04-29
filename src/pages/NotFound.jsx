import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import img404 from "../assets/Página 404.jpg";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <Navbar />

      <div className="image-wrapper">
        <img src={img404} alt="Erro 404" className="error-image" />

        <Link to="/" className="btn-overlay">
          VOLTAR PARA O INÍCIO
        </Link>
      </div>

      <Footer />
    </div>
  );
}
