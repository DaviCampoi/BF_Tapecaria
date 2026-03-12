import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

import loginImg from "../assets/carrologin.jpg"

export default function Login(){

  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [erro, setErro] = useState("")

  const navigate = useNavigate()

  function handleLogin(e){
    e.preventDefault()

    if(user === "admin" && pass === "123"){
      localStorage.setItem("auth","true")
      navigate("/clientes")
    }else{
      setErro("Usuário ou senha incorretos")
    }
  }

  return (
    <>
    
      <Navbar/>

      <div className="container-fluid login-container">

        <div className="row align-items-stretch">

          {/* LOGIN */}
          <div className="col-lg-6 col-md-6 col-12 login-box d-flex justify-content-center align-items-center">

            <div className="login-card">

              <h3 className="login-title">
                LOGIN – BF TAPEÇARIA
              </h3>

              <form onSubmit={handleLogin}>

                <div className="mb-4">
                  <label className="form-label login-label">
                    Usuário
                  </label>

                  <input
                    type="text"
                    className="form-control login-input"
                    onChange={(e)=>setUser(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label login-label">
                    Senha
                  </label>

                  <input
                    type="password"
                    className="form-control login-input"
                    onChange={(e)=>setPass(e.target.value)}
                  />
                </div>

                <button className="btn login-btn">
                  ENTRAR
                </button>

                {erro && (
                  <p className="login-erro">
                    {erro}
                  </p>
                )}

              </form>

            </div>

          </div>

          {/* IMAGEM */}
          <div className="col-lg-6 col-md-6 d-none d-md-block p-0">

            <img
              src={loginImg}
              alt="Login"
              className="login-img"
            />

          </div>

        </div>

      </div>

      <Footer/>

    </>
  )
}