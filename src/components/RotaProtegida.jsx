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

if(!session){
return <Navigate to="/login"/>
}

return children

}