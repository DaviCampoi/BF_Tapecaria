import Navbaradm from "../components/Navbaradm"
import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import semFoto from "../assets/semfoto.png"
import editIcon from "../assets/edit.png"
import deleteIcon from "../assets/delete.png"
import imageIcon from "../assets/image.png"
export default function Clientes(){

const [clientes,setClientes] = useState([])
const [busca,setBusca] = useState("")

const [modal,setModal] = useState(false)
const [editando,setEditando] = useState(null)
const [modoSelecao, setModoSelecao] = useState(false)
const [selecionados, setSelecionados] = useState([])
const [nome,setNome] = useState("")
const [telefone,setTelefone] = useState("")
const [modelo,setModelo] = useState("")
const [placa,setPlaca] = useState("")
const [cor,setCor] = useState("")
const [descricao,setDescricao] = useState("")
const [uploading, setUploading] = useState(false)
const [foto,setFoto] = useState("")
const [erro,setErro] = useState(false)
const [mensagemErro,setMensagemErro] = useState("")

  async function buscarClientes() {
    const { data, error } = await supabase
      .from("cliente")
      .select("*")
      .order("id_cliente")

    if (error) {
      console.error(error)
      return
    }

    setClientes(data || [])
  }

  useEffect(() => {
  buscarClientes()
}, [])

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

if (editando) {
  const { error } = await supabase
    .from("cliente")
    .update({
      nome_cliente: nome,
      telefone_cliente: telefone,
      modelo_carro_cliente: modelo,
      placa_carro_cliente: placa,
      cor_carro_cliente: cor,
      descricao_servico_cliente: descricao,
      foto_cliente: foto
    })
    .eq("id_cliente", editando)

  if (error) {
    setMensagemErro("Erro ao atualizar o cliente.")
    setErro(true)
    return
  }

  setMensagemErro("Cliente atualizado com sucesso!")
  setErro(true)
  fecharModal()
  buscarClientes()

} else {
  const { error } = await supabase
    .from("cliente")
    .insert({
      nome_cliente: nome,
      telefone_cliente: telefone,
      modelo_carro_cliente: modelo,
      placa_carro_cliente: placa,
      cor_carro_cliente: cor,
      descricao_servico_cliente: descricao,
      foto_cliente: foto
    })

  if (error) {
    setMensagemErro("Erro ao salvar o cliente.")
    setErro(true)
    return
  }

  setMensagemErro("Cliente salvo com sucesso!")
  setErro(true)
  fecharModal()
  buscarClientes()
}
}

function abrirNovo(){

setEditando(null)

setNome("")
setTelefone("")
setModelo("")
setPlaca("")
setCor("")
setDescricao("")
setFoto("")

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
setFoto(cliente.foto_cliente || "")

setModal(true)
}

function fecharModal(){
setModal(false)
}
const buscaLower = busca.toLowerCase()

const clientesFiltrados = clientes.filter(cliente =>
  (cliente.placa_carro_cliente || "")
    .toLowerCase()
    .includes(buscaLower) ||

  (cliente.nome_cliente || "")
    .toLowerCase()
    .includes(buscaLower)
)

return (
  <div className="page-navbar">
    <Navbaradm />

    <div className="container mt-5">
      <h3 className="mb-4">CADASTRO – BF TAPEÇARIA</h3>

      <div className="d-flex gap-3 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Procurar pelo nome ou placa:"
          style={{ maxWidth: "300px" }}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <button
          className="btn btn-warning text-white"
          onClick={abrirNovo}
        >
          CRIAR NOVO REGISTRO
        </button>
      </div>

<div className="clientes-grid">
  {clientesFiltrados.map((cliente) => (
    <div className="cliente-card" key={cliente.id_cliente}>

<img
  src={cliente.foto_cliente || semFoto}
  className="cliente-img"
  onClick={() => {
    if (cliente.foto_cliente) {
      window.open(cliente.foto_cliente, "_blank")
    }
  }}
  onError={(e) => {
    e.target.src = semFoto
  }}
/>
      {/* INFO */}
      <div className="cliente-info">
        <p><strong>Nome:</strong> {cliente.nome_cliente}</p>
        <p><strong>Placa:</strong> {cliente.placa_carro_cliente}</p>
        <p><strong>Telefone:</strong> {cliente.telefone_cliente}</p>
        <p><strong>Modelo:</strong> {cliente.modelo_carro_cliente}</p>
        <p><strong>Cor:</strong> {cliente.cor_carro_cliente}</p>
        <p><strong>Serviço:</strong> {cliente.descricao_servico_cliente}</p>
      </div>

      {/* AÇÕES */}
      <div className="cliente-acoes">
        <button
          className="btn btn-warning"
          onClick={() => editarCliente(cliente)}
        >
          <img src={editIcon} width="18" />
        </button>

        <button
          className="btn btn-warning"
          onClick={async () => {
            const { error } = await supabase
              .from("cliente")
              .delete()
              .eq("id_cliente", cliente.id_cliente)

            if (!error) buscarClientes()
          }}
        >
          <img src={deleteIcon} width="18" />
        </button>
      </div>

    </div>
  ))}
</div>
      
           </div>

    {modal && (
      <div className="form-overlay">
        <div className="form-popup">
          <h4>{editando ? "Editar Cliente" : "Novo Cliente"}</h4>

          <input className="form-control mb-2" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input className="form-control mb-2" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          <input className="form-control mb-2" placeholder="Modelo do carro" value={modelo} onChange={(e) => setModelo(e.target.value)} />
          <input className="form-control mb-2" placeholder="Placa" value={placa} onChange={(e) => setPlaca(e.target.value)} />
          <input className="form-control mb-2" placeholder="Cor" value={cor} onChange={(e) => setCor(e.target.value)} />

          <textarea
            className="form-control mb-2"
            placeholder="Descrição do serviço"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

           <input
        type="file"

        className="form-control mb-2"

        onChange={async (e) => {
  const file = e.target.files[0]

  if (!file) return

  setUploading(true)

  const fileName = `${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from("cliente")
    .upload(`fotos/${fileName}`, file)

  if (error) {
    console.error("Erro ao enviar foto:", error)
    setMensagemErro("Erro ao enviar imagem")
    setErro(true)
    setUploading(false)
    return
  }

  const { data: publicData } = supabase.storage
    .from("cliente")
    .getPublicUrl(data.path)

  console.log("URL GERADA:", publicData.publicUrl)

  setFoto(publicData.publicUrl)
  setUploading(false)
}}
      />

      {/* Pré-visualização da foto */}
      {foto && (
        <img
          src={foto}
          alt="Pré-visualização"
          className="foto-tabela mb-2"
        />
      )}

          <div className="d-flex justify-content-center gap-3 mt-3">
            
            <button className="btn text-white px-4 py-2" 
            onClick={salvarCliente}
          >
              Salvar
            </button>

            <button className="btn text-white px-4 py-2" onClick={fecharModal}>
              Cancelar
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
              onClick={() => setErro(false)}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)
}