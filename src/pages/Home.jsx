import Navbar from "../components/Navbar"
import heroImage from "../assets/hero.png"
import logo2 from "../assets/logo2_bf.png"

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
                Atendimento personalizado e acabamento profissional, estudo, profissionalização, esmero. 
              </p>

              <button className="btn btn-warning fw-bold px-5 py-3 fs-5 mt-4 hero-button">
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
      <section className="bg-light py-5">
        <div className="container">
          <h2>BF TAPEÇARIA</h2>

          <p className="mt-3">
            Empresa especializada em reforma e personalizaçã
          </p>

          <button className="btn btn-warning fw-bold mt-3">
            ENTRE EM CONTATO →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-custom text-white py-4">
        <div className="container">
          <div className="row">

            <div className="col-md-3">
              <h6>MENU</h6>
              <p>Home</p>
              <p>Contato</p>
            </div>

            <div className="col-md-3">
              <h6>CONTATO</h6>
              <p>(11) 93282-5614</p>
              <p> bftapecaria@gmail.com</p>
              <p>R. Padre Felíciano Grande, 168 - Alvinópolis, Atibaia - SP, 12942-460</p>
            </div>

            <div className="col-md-3">
              <h6>HORÁRIOS</h6>
              <p>Seg - Sex: 08:00 - 18:00</p>
              <p>Sáb: 08:00 - 12:00</p>
              <p>Dom: Fechado</p>
            </div>

            <div className="col-md-3">
              <h6>REDES SOCIAIS</h6>
              <p>Facebook</p>
              <p>Tik Tok</p>
            </div>

          </div>
        </div>
      </footer>
    </>
  )
}