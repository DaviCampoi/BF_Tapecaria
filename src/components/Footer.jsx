import { Link } from "react-router-dom"
export default function Footer() {
  
  return (
    
    <footer
    className="text-white pt-5 pb-4"
    style={{ backgroundColor: "black" }}
>
      <div className="container">
        <div className="row">

          <div className="col-md-3">
            <h6>MENU</h6>
               <Link to="/" className="footer-link">Home</Link>
  <Link to="/contato" className="footer-link">Contato</Link>
  <Link to="/catalogo" className="footer-link">Catálogo</Link>
  <p className="footer-copy">® BF TAPEÇARIA</p>
          </div>

          <div className="col-md-3">
            <h6>CONTATO</h6>
            <p>(11) 93282-5614</p>
            <p>bftapecaria@gmail.com</p>
            <p>
              R. Padre Felíciano Grande, 168 - Alvinópolis,
              Atibaia - SP, 12942-460
            </p>
          </div>

          <div className="col-md-3">
            <h6>HORÁRIOS</h6>
            <p>Seg - Sex: 08:00 - 18:00</p>
            <p>Sáb: 08:00 - 12:00</p>
            <p>Dom: Fechado</p>
          </div>

          <div className="col-md-3">
            <h6>REDES SOCIAIS</h6>
            <p>
              <a
                href="https://www.facebook.com/profile.php?id=100057059066105"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                Facebook
              </a>
            </p>

            <p>
              <a
                href="https://www.instagram.com/bf.tapecaria/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link">
                Instagram
              </a>
            </p>

            <p>
              <a
                href="https://share.google/BLJnQrYIMBMQxykNN"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link">
                Google
              </a>
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}