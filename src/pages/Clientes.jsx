/*
  Este componente gerencia o cadastro e manutenção de clientes da BF Tapeçaria.
  - Conecta-se ao Supabase para buscar, criar, atualizar e excluir registros.
  - Cada cliente possui: nome, telefone, modelo, placa, cor do veículo, descrição do serviço e foto.
  - Permite filtrar clientes por nome ou placa com campo de busca.
  - Exibe os clientes em cards com informações e ações (editar/excluir).
  - Inclui modais para criar/editar clientes, confirmar exclusão e mostrar mensagens de erro/sucesso.
  - Suporta upload de imagens para cada cliente, armazenando no Supabase Storage.
  - Possui auto-preenchimento de dados ao digitar nome ou telefone já existentes.
*/

import Navbaradm from "../components/Navbaradm"
import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import semFoto from "../assets/semfoto.png"
import editIcon from "../assets/edit.png"
import deleteIcon from "../assets/delete.png"
export default function Clientes() {

  const [clientes, setClientes] = useState([])
  const [busca, setBusca] = useState("")
  const [confirmarDelete, setConfirmarDelete] = useState(false)
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null)
  const [erroDeleteCliente, setErroDeleteCliente] = useState(false)
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [modelo, setModelo] = useState("")
  const [placa, setPlaca] = useState("")
  const [cor, setCor] = useState("")
  const [descricao, setDescricao] = useState("")

  const [uploading, setUploading] = useState(false)
  const [foto, setFoto] = useState("")

  const [erro, setErro] = useState(false)
  const [mensagemErro, setMensagemErro] = useState("")

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

  async function salvarCliente() {
    if (!nome.trim()) { setMensagemErro("Digite o nome do cliente"); setErro(true); return }
    if (!telefone.trim()) { setMensagemErro("Digite o telefone do cliente"); setErro(true); return }
    if (!modelo.trim()) { setMensagemErro("Digite o modelo do carro"); setErro(true); return }
    if (!placa.trim()) { setMensagemErro("Digite a placa do veículo"); setErro(true); return }
    if (!cor.trim()) { setMensagemErro("Digite a cor do veículo"); setErro(true); return }
    if (!descricao.trim()) { setMensagemErro("Digite a descrição do serviço"); setErro(true); return }

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
    }

    setErro(true)
    fecharModal()
    buscarClientes()
  }

  function abrirNovo() {
    setEditando(null)
    setNome(""); setTelefone(""); setModelo(""); setPlaca(""); setCor(""); setDescricao(""); setFoto("")
    setModal(true)
  }

  function editarCliente(cliente) {
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

  function fecharModal() {
    setModal(false)
  }

  const buscaLower = busca.toLowerCase()
  const clientesFiltrados = clientes.filter(cliente =>
    (cliente.placa_carro_cliente || "").toLowerCase().includes(buscaLower) ||
    (cliente.nome_cliente || "").toLowerCase().includes(buscaLower)
  )

  return (
    <div className="page-navbar">
      <Navbaradm />

      {/* LISTAS DE SUGESTÕES (Ficam invisíveis, apenas fornecem dados para os inputs) */}
      <datalist id="sugestoes-nomes">
        {clientes.map(c => <option key={c.id_cliente} value={c.nome_cliente} />)}
      </datalist>
      <datalist id="sugestoes-telefones">
        {clientes.map(c => <option key={c.id_cliente} value={c.telefone_cliente} />)}
      </datalist>

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
          <button className="btn btn-warning text-white" onClick={abrirNovo}>
            CRIAR NOVO REGISTRO
          </button>
        </div>

        <div className="clientes-grid">
          {clientesFiltrados.map((cliente) => (
            <div className="cliente-card" key={cliente.id_cliente}>
              <img
                src={cliente.foto_cliente || semFoto}
                className="cliente-img"
                onClick={() => { if (cliente.foto_cliente) window.open(cliente.foto_cliente, "_blank") }}
                onError={(e) => { e.target.src = semFoto }}
              />
              <div className="cliente-body">
                <p><strong>Nome:</strong> {cliente.nome_cliente}</p>
                <p><strong>Placa:</strong> {cliente.placa_carro_cliente}</p>
                <p><strong>Telefone:</strong> {cliente.telefone_cliente}</p>
                <p><strong>Modelo:</strong> {cliente.modelo_carro_cliente}</p>
                <p><strong>Cor:</strong> {cliente.cor_carro_cliente}</p>
                <p><strong>Serviço:</strong> {cliente.descricao_servico_cliente}</p>
              </div>
              <div className="cliente-actions">
                <button className="btn btn-warning" onClick={() => editarCliente(cliente)}>
                  <img src={editIcon} width="18" />
                </button>
                <button className="btn btn-warning" onClick={() => { setClienteParaExcluir(cliente.id_cliente); setConfirmarDelete(true) }}>
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
            
            <input
              className="form-control mb-2"
              placeholder="Nome"
              value={nome}
              list="sugestoes-nomes"
              onChange={(e) => {
                const val = e.target.value
                setNome(val)
                // Auto-preencher se encontrar o cliente pelo nome
                const existente = clientes.find(c => c.nome_cliente === val)
                if(existente && !editando) {
                   setTelefone(existente.telefone_cliente)
                   setModelo(existente.modelo_carro_cliente)
                   setPlaca(existente.placa_carro_cliente)
                   setCor(existente.cor_carro_cliente)
                }
              }}
            />

            <input
              className="form-control mb-2"
              placeholder="Telefone"
              value={telefone}
              list="sugestoes-telefones"
              onChange={(e) => setTelefone(e.target.value)}
            />

            <input
              className="form-control mb-2"
              placeholder="Modelo do carro"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
            />

            <input
              className="form-control mb-2"
              placeholder="Placa"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
            />

            <input
              className="form-control mb-2"
              placeholder="Cor"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
            />

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
                  console.error(error)
                  setMensagemErro("Erro ao enviar imagem")
                  setErro(true)
                  setUploading(false)
                  return
                }
                const { data: publicData } = supabase.storage.from("cliente").getPublicUrl(data.path)
                setFoto(publicData.publicUrl)
                setUploading(false)
              }}
            />

            {foto && (
  <div style={{ position: "relative", display: "inline-block" }}>
    <img src={foto} className="foto-tabela mb-2" />

    <span
      onClick={() => setFoto("")}
      style={{
        position: "absolute",
        top: 0,
        right: 5,
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "18px"
      }}
    >
      ✕
    </span>
  </div>
)}

            <div className="d-flex justify-content-center gap-3 mt-3">
              <button className="btn text-white px-4 py-2" onClick={salvarCliente} disabled={uploading}>
                {uploading ? "Enviando..." : "Salvar"}
              </button>
              <button className="btn text-white px-4 py-2" onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAIS DE ERRO E CONFIRMAÇÃO MANTIDOS IGUAIS AO SEU ORIGINAL */}
      {erro && (
        <div className="form-overlay">
          <div className="form-popup">
            <h4>{mensagemErro}</h4>
            <div className="d-flex justify-content-center mt-3">
              <button className="btn btn-warning" onClick={() => setErro(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

      {confirmarDelete && (
        <div className="form-overlay">
          <div className="form-popup">
            <h4>Deseja realmente excluir este cliente?</h4>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <button className="btn btn-warning text-white px-4" onClick={async () => {
                const { error } = await supabase.from("cliente").delete().eq("id_cliente", clienteParaExcluir)
                if (error) {
                  setConfirmarDelete(false)
                  setErroDeleteCliente(true)
                  return
                }
                buscarClientes()
                setConfirmarDelete(false)
                setClienteParaExcluir(null)
              }}>Sim</button>
              <button className="btn text-white px-4" onClick={() => { setConfirmarDelete(false); setClienteParaExcluir(null) }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {erroDeleteCliente && (
        <div className="form-overlay">
          <div className="form-popup">
            <h4>Para excluir este cliente é necessário excluir os serviços atrelados a ele.</h4>
            <div className="d-flex justify-content-center mt-3">
              <button className="btn btn-warning" onClick={() => { setErroDeleteCliente(false); setClienteParaExcluir(null) }}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}