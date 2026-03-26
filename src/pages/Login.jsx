import Navbaradm from "../components/Navbaradm"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import Footer from "../components/Footer"
import loginImg from "../assets/carrologin.jpg"

export default function Login() {

const [user, setUser] = useState("")
const [pass, setPass] = useState("")
const [erro, setErro] = useState("")

const navigate = useNavigate()


async function handleLogin(e){

e.preventDefault()

setErro("")

const { data, error } = await supabase
.from("administrador")
.select("*")
.eq("usuario_adm", user)
.eq("senha_adm", pass)
.single()

if(error || !data){

setErro("Usuário ou senha incorretos")
return

}

localStorage.setItem("auth","true")
localStorage.setItem("admin_nome", data.nome_completo_adm)

navigate("/clientes")

}


return (
<>
<Navbaradm/>

<div className="container-fluid">

<div className="row" style={{minHeight:"75vh"}}>


{/* LOGIN */}

<div
className="col-md-6 d-flex justify-content-center"
style={{background:"#e5e5e5"}}
>

<div style={{width:"380px", marginTop:"60px"}}>

<h3
className="mb-5"
style={{color:"#555", fontSize:"30px"}}
> 
LOGIN– BF TAPEÇARIA
</h3>


<form onSubmit={handleLogin}>

<div className="mb-4">

<label
className="form-label"
style={{fontSize:"25px"}}
> 
Usuário
</label>

<input
type="text"
className="form-control"
style={{
background:"#cfd3d7",
border:"none"
}}
value={user}
onChange={(e)=>setUser(e.target.value)}
required
/>

</div>


<div className="mb-4">

<label
className="form-label"
style={{fontSize:"25px"}}
> 
Senha
</label>

<input
type="password"
className="form-control"
style={{
background:"#cfd3d7",
border:"none"
}}
value={pass}
onChange={(e)=>setPass(e.target.value)}
required
/>

</div>


<button
type="submit"
className="btn w-50"
style={{
background:"linear-gradient(to right,#ff7a00,#ffb300)",
color:"#fff",
fontWeight:"bold"
}}
> 
ENTRAR
</button>


{erro && (

<p
style={{
color:"red",
marginTop:"15px",
fontWeight:"bold"
}}
> 
{erro}
</p>

)}

</form>

</div>

</div>


{/* IMAGEM */}

<div className="col-md-6 p-0">

<img
src={loginImg}
alt="Login"
className="w-100 h-100"
style={{objectFit:"cover"}}
/>

</div>
</div>
</div>
<Footer/>

</>

)

}