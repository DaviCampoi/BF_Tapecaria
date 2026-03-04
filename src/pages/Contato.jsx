import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import contatoImg from "../assets/interior.jpg"

export default function Contato() {
  return (
    <>
      <Navbar />

      <div className="container-fluid p-0">
        <div className="row g-0" style={{ minHeight: "80vh" }}>

          {/* LADO ESQUERDO - FORM */}
          <div className="col-md-6 bg-light p-5 d-flex flex-column justify-content-start">
            
            <h3 className="mb-4 mt-4">BF TAPEÇARIA</h3>

            <form className="mt-3">

              <div className="mb-3">
                <label className="form-label">Envie seu e-mail:</label>
                <input
                  type="email"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Assunto:</label>
                <input
                  type="text"
                  className="form-control"
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Mensagem:</label>
                <textarea
                  className="form-control"
                  rows="4"
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
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          </div>

        </div>
      </div>
<Footer />
    </>
  )
}