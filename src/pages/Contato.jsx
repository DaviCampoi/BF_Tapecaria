import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import contatoImg from "../assets/interior.jpg"
import emailjs from "emailjs-com"

export default function Contato() {

  const [status, setStatus] = useState(null)

  function validarEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
  }

  function enviarEmail(e) {
    e.preventDefault()

    const form = e.target
    const name = form.name.value.trim()
    const email = form.email.value.trim()
    const assunto = form.assunto.value.trim()
    const mensagem = form.mensagem.value.trim()

    if (!name || !email || !assunto || !mensagem) {
      setStatus("erro")
      return
    }

    if (!validarEmail(email)) {
      setStatus("erro")
      return
    }

    emailjs
      .sendForm(
        "service_zcs9fyo",
        "template_21qdqcf",
        form,
        "2wIA3FQ4QADvvSgA5"
      )
      .then(() => {
        setStatus("sucesso")
        form.reset()
      })
      .catch(() => {
        setStatus("erro")
      })
  }

  return (
    <>
      <Navbar />

      <div className="container-fluid p-0">
        <div className="row g-0 contato-section" style={{ minHeight: "80vh", position:"relative" }}>

          {/* OVERLAY */}

          {status && (
  <div className="form-overlay" onClick={() => setStatus(null)}>

    {status === "sucesso" && (
      <div
        className="form-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>SUA MENSAGEM FOI ENVIADA,<br/>AGUARDE O NOSSO RETORNO</h2>
        <button onClick={() => setStatus(null)}>OK</button>
      </div>
    )}

    {status === "erro" && (
      <div
        className="form-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>SUA MENSAGEM NÃO FOI ENVIADA,<br/>VERIFIQUE AS INFORMAÇÕES</h2>
        <button onClick={() => setStatus(null)}>OK</button>
      </div>
    )}

  </div>
)}

          {/* FORM */}

          <div className="col-md-6 bg-light p-5 d-flex flex-column">

            <h3 className="mb-4 mt-4">BF TAPEÇARIA</h3>

            <form className="mt-3" onSubmit={enviarEmail}>

              <div className="mb-3">
                <label className="form-label">Seu nome:</label>
                <input type="text" name="name" className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Seu e-mail:</label>
                <input type="email" name="email" className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Assunto:</label>
                <input type="text" name="assunto" className="form-control" />
              </div>

              <div className="mb-4">
                <label className="form-label">Mensagem:</label>
                <textarea name="mensagem" className="form-control" rows="4"></textarea>
              </div>

              <button type="submit" className="btn btn-warning botaoenviar">
                ENVIAR
              </button>

            </form>
          </div>

          {/* IMAGEM */}

          <div className="col-md-6 contato-imagem">
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