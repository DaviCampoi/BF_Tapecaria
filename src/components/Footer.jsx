export default function Footer() {
  return (
    <footer className="footer-custom text-white pt-5 pb-4 bg-dark">
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
                className="social-link"
              >
                Instagram
              </a>
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}