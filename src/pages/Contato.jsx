import Navbar from "../components/Navbar"
import contatoImg from "../assets/interior.jpg"

export default function Contato() {
  return (
    <>
      <Navbar />

      <div className="container-fluid p-0">
        <div className="row g-0">

          {/* LADO ESQUERDO - FORM */}
          <div className="col-md-6 bg-light p-5 d-flex flex-column justify-content-center">
            <h3 className="mb-4">BF TAPEÇARIA</h3>

            <form>
              <div className="mb-3">
                <label className="form-label">Envie seu e-mail:</label>
                <input
                  type="email"
                  className="form-control custom-input"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Assunto:</label>
                <input
                  type="text"
                  className="form-control custom-input"
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Mensagem:</label>
                <textarea
                  className="form-control custom-input"
                  rows="3"
                ></textarea>
              </div>

              <button className="btn btn-warning px-4">
                ENVIAR
              </button>
            </form>
          </div>

          {/* LADO DIREITO - IMAGEM */}
          <div className="col-md-6">
            <img
              src={contatoImg}
              alt="Contato"
              className="img-fluid vh-100 object-fit-cover"
            />
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer-custom text-white py-4">
        <div className="container text-center">
          © 2026 BF Tapeçaria
        </div>
      </footer>
    </>
  )
}