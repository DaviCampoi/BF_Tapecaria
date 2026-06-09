/*
  Este componente gerencia a autenticação de usuários no sistema da BF Tapeçaria.
  - Utiliza Supabase para validar email e senha.
  - Exibe mensagens de erro caso os campos estejam vazios ou as credenciais sejam inválidas.
  - Redireciona o usuário para a página de clientes após login bem-sucedido.
  - Estrutura visual: formulário de login à esquerda e imagem ilustrativa à direita.
  - Inclui Navbar e Footer para manter a identidade visual do site.
*/

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import Footer from "../components/Footer"
import loginImg from "../assets/carrologin.jpg"

export default function Login() {

const [email, setEmail] = useState("")
const [senha, setSenha] = useState("")
const [erro, setErro] = useState("")

const navigate = useNavigate()
// Função que trata o login
async function handleLogin(e){
e.preventDefault() // Impede recarregar a página
setErro("") // Reseta mensagem de erro
// Validação: campos obrigatórios
if(!email || !senha){
setErro("Preencha email e senha")
return
}
// Faz login no Supabase com email e senha
const { error } = await supabase.auth.signInWithPassword({
email: email,
password: senha
})

if(error){
setErro("Email ou senha incorretos")
return
}
navigate("/clientes")
}

return (
<>

<div className="container-fluid login-container">

<div className="row">

<div className="col-md-6 login-box">

<div className="login-card">

<h3
className="mb-5"
style={{color:"#555", fontSize:"30px"}}
> 
LOGIN – BF TAPEÇARIA
</h3>

<form onSubmit={handleLogin}>

<div className="mb-4">

<label className="form-label" style={{fontSize:"25px"}}>
Email
</label>

<input
type="email"
className="form-control"
style={{background:"#cfd3d7", border:"none"}}
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

</div>

<div className="mb-4">

<label className="form-label" style={{fontSize:"25px"}}>
Senha
</label>

<input
type="password"
className="form-control"
style={{background:"#cfd3d7", border:"none"}}
value={senha}
onChange={(e)=>setSenha(e.target.value)}
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
<p style={{color:"red", marginTop:"15px", fontWeight:"bold"}}>
{erro}
</p>
)}

</form>

</div>
</div>

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