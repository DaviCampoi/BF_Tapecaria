import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import heroImage from "../assets/hero.png"
import logo2 from "../assets/logo2_bf.png"
import { Link } from "react-router-dom"


export default function Home() {
  return (
    <>
      <Navbar />   

      {/* HERO */}
            <section
  style={{
    backgroundImage: `url(${heroImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100dvh",
    position: "relative",
    color: "white",
    width: "100vw",
    margin: 0,
    padding: 0
  }}
>
        {/* Overlay escuro */}
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            position: "absolute",
            width: "100%",
            height: "100%"
          }}
        ></div>

        <div className="h-100 d-flex align-items-center position-relative px-4">
  <div className="row w-100 align-items-center">

    {/* TEXTO ESQUERDA */}
    <div className="col-md-6">
      <p className="fs-3 fw-light hero-text">
        Especialistas em tapeçaria automotiva com qualidade e precisão.
        Atendimento personalizado e acabamento profissional, estudo,
        profissionalização, esmero.
      </p>

      <button
  className="btn btn-warning fw-bold px-5 py-3 fs-5 mt-4 hero-button"
  onClick={() => {
    document.getElementById("sobre").scrollIntoView({ behavior: "smooth" });
  }}
>
  SAIBA MAIS
</button>
    </div>

    {/* LOGO DIREITA */}
    <div className="col-md-6 d-flex justify-content-md-end justify-content-center align-items-center">
      <img src={logo2} alt="BF Tapeçaria" className="hero-logo" />
    </div>

  </div>
</div>
      </section>
 
      {/* SOBRE */}
<section id="sobre" className="sobre-section">
  <div className="row g-0">

    {/* LADO ESQUERDO - TEXTO */}
    <div className="col-md-6 sobre-texto">
      <div className="conteudo">
        <h2>BF TAPEÇARIA</h2>

        <p>
          Empresa especializada em reforma e personalização automotiva...
          Empresa especializada em reforma e personalização automotiva...
          Empresa especializada em reforma e personalização automotiva...
          Empresa especializada em reforma e personalização automotiva...
          Empresa especializada em reforma e personalização automotiva...
          Empresa especializada em reforma e personalização automotiva...
          Empresa especializada em reforma e personalização automotiva...
          Empresa especializada em reforma e personalização automotiva...
          Empresa especializada em reforma e personalização automotiva...
          Empresa especializada em reforma e personalização automotiva...
          Empresa especializada em reforma e personalização automotiva...
          Empresa especializada em reforma e personalização automotiva...
          Empresa especializada em reforma e personalização automotiva...  

        </p>
      </div>
    </div>

    {/* LADO DIREITO - IMAGEM */}
    <div className="col-md-6 sobre-imagem">
      <Link to="/contato" className="btn btn-warning sobre-botao">
        ENTRE EM CONTATO
      </Link>
    </div>

  </div>
</section>
<Footer />
    </>
  )
}