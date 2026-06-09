/*
  Este componente protege rotas que exigem autenticação.
  - Verifica se existe uma sessão ativa no Supabase.
  - Exibe um loading enquanto verifica.
  - Redireciona para login se não houver sessão.
  - Libera acesso ao conteúdo protegido se estiver autenticado.
*/

import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../supabaseClient"

export default function RotaProtegida({ children }) {

const [loading, setLoading] = useState(true)
const [session, setSession] = useState(null)

useEffect(() => {

async function verificarSessao(){

const { data } = await supabase.auth.getSession()

setSession(data.session)
setLoading(false)

}

verificarSessao()

}, [])

if(loading){
return <p style={{textAlign:"center", marginTop:"50px"}}>Carregando...</p>
}
  /* Redireciona para login caso não esteja autenticado */

if(!session){
return <Navigate to="/login"/>
}
  /* Libera acesso à rota protegida */
return children

}