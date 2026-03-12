import Navbaradm from "../components/Navbaradm"
import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

import editIcon from "../assets/edit.png"
import deleteIcon from "../assets/delete.png"

export default function Clientes(){

const [clientes,setClientes] = useState([])
const [busca,setBusca] = useState("")

const [modal,setModal] = useState(false)
const [editando,setEditando] = useState(null)

const [nome,setNome] = useState("")
const [telefone,setTelefone] = useState("")
const [modelo,setModelo] = useState("")
const [placa,setPlaca] = useState("")
const [cor,setCor] = useState("")
const [descricao,setDescricao] = useState("")
const [foto,setFoto] = useState(null)

const [fotoPreview,setFotoPreview] = useState(null)

const [confirmarExcluir,setConfirmarExcluir] = useState(false)
const [idExcluir,setIdExcluir] = useState(null)

const [fotoAberta,setFotoAberta] = useState(null)

const [erro,setErro] = useState(false)
const [mensagemErro,setMensagemErro] = useState("")

useEffect(()=>{
carregarClientes()
},[])

async function carregarClientes(){

const { data,error } = await supabase
.from("cliente")
.select("*")
.order("id_cliente")

if(error){
console.error(error)
return
}

setClientes(data || [])
}

async function uploadFoto(){

if(!foto) return null

const nomeArquivo = Date.now()+"-"+foto.name

const { error } = await supabase
.storage
.from("fotos-carros")
.upload(nomeArquivo,foto)

if(error){
console.error(error)
return null
}

const { data } = supabase
.storage
.from("fotos-carros")
.getPublicUrl(nomeArquivo)

return data.publicUrl
}

async function salvarCliente(){

if(!nome.trim()){
setMensagemErro("Digite o nome do cliente")
setErro(true)
return
}

if(!telefone.trim()){
setMensagemErro("Digite o telefone do cliente")
setErro(true)
return
}

if(!modelo.trim()){
setMensagemErro("Digite o modelo do carro")
setErro(true)
return
}

if(!placa.trim()){
setMensagemErro("Digite a placa do veículo")
setErro(true)
return
}

if(!cor.trim()){
setMensagemErro("Digite a cor do veículo")
setErro(true)
return
}

if(!descricao.trim()){
setMensagemErro("Digite a descrição do serviço")
setErro(true)
return
}

let urlFoto = fotoPreview

if(foto){
urlFoto = await uploadFoto()
}

if(editando){

await supabase
.from("cliente")
.update({
nome_cliente:nome,
telefone_cliente:telefone,
modelo_carro_cliente:modelo,
placa_carro_cliente:placa,
cor_carro_cliente:cor,
descricao_servico_cliente:descricao,
foto_carro_cliente:urlFoto
})
.eq("id_cliente",editando)

}else{

await supabase
.from("cliente")
.insert({
nome_cliente:nome,
telefone_cliente:telefone,
modelo_carro_cliente:modelo,
placa_carro_cliente:placa,
cor_carro_cliente:cor,
descricao_servico_cliente:descricao,
foto_carro_cliente:urlFoto
})

}

fecharModal()
carregarClientes()
}

function abrirNovo(){

setEditando(null)

setNome("")
setTelefone("")
setModelo("")
setPlaca("")
setCor("")
setDescricao("")
setFoto(null)
setFotoPreview(null)

setModal(true)
}

function editarCliente(cliente){

setEditando(cliente.id_cliente)

setNome(cliente.nome_cliente)
setTelefone(cliente.telefone_cliente)
setModelo(cliente.modelo_carro_cliente)
setPlaca(cliente.placa_carro_cliente)
setCor(cliente.cor_carro_cliente)
setDescricao(cliente.descricao_servico_cliente)
setFotoPreview(cliente.foto_carro_cliente)

setModal(true)
}

function fecharModal(){
setModal(false)
}

function pedirExcluir(id){
setIdExcluir(id)
setConfirmarExcluir(true)
}

async function excluirCliente(){

await supabase
.from("cliente")
.delete()
.eq("id_cliente",idExcluir)

setConfirmarExcluir(false)
carregarClientes()
}

function removerFoto(){
setFoto(null)
setFotoPreview(null)
}

const clientesFiltrados = clientes.filter(cliente =>
cliente.placa_carro_cliente
?.toLowerCase()
.includes(busca.toLowerCase())
)

return(
<>
<Navbaradm/>

<div className="container mt-5">

<h3 className="mb-4">CADASTRO – BF TAPEÇARIA</h3>

<div className="d-flex gap-3 mb-4">

<input
type="text"
className="form-control"
placeholder="Procurar pela placa do veículo:"
style={{maxWidth:"300px"}}
value={busca}
onChange={(e)=>setBusca(e.target.value)}
/>

<button
className="btn btn-warning text-white"
onClick={abrirNovo}
> 
CRIAR NOVO REGISTRO
</button>

</div>

<table className="table">

<thead>
<tr>
<th>Nome</th>
<th>Placa</th>
<th>Telefone</th>
<th>Modelo</th>
<th>Cor</th>
<th>Serviço</th>
<th>Foto</th>
<th></th>
</tr>
</thead>

<tbody>

{clientesFiltrados.map(cliente=>(

<tr key={cliente.id_cliente}>

<td>{cliente.nome_cliente}</td>
<td>{cliente.placa_carro_cliente}</td>
<td>{cliente.telefone_cliente}</td>
<td>{cliente.modelo_carro_cliente}</td>
<td>{cliente.cor_carro_cliente}</td>
<td>{cliente.descricao_servico_cliente}</td>

<td>
{cliente.foto_carro_cliente && (
<img
src={cliente.foto_carro_cliente}
width="80"
style={{borderRadius:"6px",cursor:"pointer"}}
onClick={()=>setFotoAberta(cliente.foto_carro_cliente)}
/>
)}
</td>

<td className="d-flex gap-2">

<button
className="btn btn-warning btn-sm"
onClick={()=>editarCliente(cliente)}
> 
<img src={editIcon} width="16"/>
</button>

<button
className="btn btn-warning btn-sm"
onClick={()=>pedirExcluir(cliente.id_cliente)}
> 
<img src={deleteIcon} width="16"/>
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

{modal && (

<div className="form-overlay">
<div className="form-popup">

<h4>{editando ? "Editar Cliente" : "Novo Cliente"}</h4>

<input className="form-control mb-2" placeholder="Nome" value={nome} onChange={(e)=>setNome(e.target.value)} />
<input className="form-control mb-2" placeholder="Telefone" value={telefone} onChange={(e)=>setTelefone(e.target.value)} />
<input className="form-control mb-2" placeholder="Modelo do carro" value={modelo} onChange={(e)=>setModelo(e.target.value)} />
<input className="form-control mb-2" placeholder="Placa" value={placa} onChange={(e)=>setPlaca(e.target.value)} />
<input className="form-control mb-2" placeholder="Cor" value={cor} onChange={(e)=>setCor(e.target.value)} />

<textarea
className="form-control mb-2"
placeholder="Descrição do serviço"
value={descricao}
onChange={(e)=>setDescricao(e.target.value)}
/>

<input
type="file"
className="form-control mb-3"
onChange={(e)=>{
setFoto(e.target.files[0])
setFotoPreview(URL.createObjectURL(e.target.files[0]))
}}
/>

{fotoPreview && (

<div style={{position:"relative",display:"inline-block",marginBottom:"10px"}}>

<img
src={fotoPreview}
width="120"
style={{borderRadius:"6px"}}
/>

<button
onClick={removerFoto}
style={{
position:"absolute",
top:"-35px",
right:"-8px",
width:"22px",
height:"22px",
borderRadius:"50%",
border:"none",
color:"white",
cursor:"pointer",
fontSize:"40px",
}}
> 
×
</button>

</div>

)}
<div className="d-flex justify-content-center gap-3 mt-3">
<button className="btn text-white px-4 py-2" onClick={salvarCliente}>
  Salvar
</button>

<button className="btn text-white px-4 py-2" onClick={fecharModal}>
  Cancelar
</button>
</div>
</div>
</div>

)}

{confirmarExcluir && (

<div className="form-overlay">
<div className="form-popup">

<h4>Excluir cliente?</h4>

<div className="d-flex gap-3 justify-content-center">

<button className="btn" onClick={excluirCliente}>SIM</button>

<button className="btn" onClick={()=>setConfirmarExcluir(false)}>
NÃO
</button>

</div>

</div>
</div>

)}

{erro && (

<div className="form-overlay">
<div className="form-popup">

<h4>{mensagemErro}</h4>

<div className="d-flex justify-content-center mt-3">

<button
className="btn btn-warning"
onClick={()=>setErro(false)}
> 
OK
</button>

</div>

</div>
</div>

)}

{fotoAberta && (

<div
className="form-overlay"
onClick={()=>setFotoAberta(null)}
>

<div
style={{position:"relative",background:"transparent"}}
onClick={(e)=>e.stopPropagation()}
>

<button
onClick={()=>setFotoAberta(null)}
style={{
position:"absolute",
top:"-15px",
right:"-15px",
width:"35px",
height:"35px",
borderRadius:"50%",
border:"none",
background:"white",
cursor:"pointer"
}}
> 
X
</button>

<img
src={fotoAberta}
style={{
maxWidth:"85vw",
maxHeight:"85vh",
borderRadius:"10px",
marginTop:"80px"
}}
/>

</div>

</div>

)}

</>
)
}