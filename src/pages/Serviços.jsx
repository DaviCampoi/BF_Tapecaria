import Navbaradm from "../components/Navbaradm"
import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

export default function Servicos() {
  const [servicos, setServicos] = useState([])
  const [clientes, setClientes] = useState([])
  const [busca, setBusca] = useState("")
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [clienteSelecionado, setClienteSelecionado] = useState("")
  const [descricao, setDescricao] = useState("")
  const [dataServico, setDataServico] = useState("")
  const [valor, setValor] = useState("")
  const [erro, setErro] = useState(false)
  const [mensagemErro, setMensagemErro] = useState("")

  // Buscar serviços com cliente vinculado
 async function buscarClientes() {
  const { data, error } = await supabase
    .from("cliente")
    .select("id_cliente, nome_cliente, placa_carro_cliente")
    .order("nome_cliente")

  if (error) {
    console.error(error)
    return
  }

  setClientes(data || [])
}

async function buscarServicos() {
  const { data, error } = await supabase
    .from("servico")
    .select(`
      id_servico,
      descricao_servico,
      data_servico,
      valor_servico,
      cliente (
        id_cliente,
        nome_cliente,
        placa_carro_cliente
      )
    `)
    .order("data_servico")

  if (error) {
    console.error(error)
    return
  }

  setServicos(data || [])
}

useEffect(() => {
  async function carregarDados() {
    await buscarClientes()
    await buscarServicos()
  }
  carregarDados()
}, [])

  // Salvar serviço
  async function salvarServico() {
    if (!clienteSelecionado || !descricao.trim() || !dataServico || !valor.trim()) {
      setMensagemErro("Preencha todos os campos")
      setErro(true)
      return
    }

    const payload = {
      id_cliente: clienteSelecionado,
      descricao_servico: descricao,
      data_servico: dataServico,   // formato YYYY-MM-DD
      valor_servico: parseFloat(valor) // garante número
    }

    let error
    if (editando) {
      ({ error } = await supabase
        .from("servico")
        .update(payload)
        .eq("id_servico", editando))
    } else {
      ({ error } = await supabase
        .from("servico")
        .insert(payload))
    }

    if (error) {
      setMensagemErro("Erro ao salvar serviço")
      setErro(true)
      return
    }

    setMensagemErro(editando ? "Serviço atualizado com sucesso!" : "Serviço salvo com sucesso!")
    setErro(true)
    fecharModal()
    buscarServicos()
  }

  function abrirNovo() {
    setEditando(null)
    setClienteSelecionado("")
    setDescricao("")
    setDataServico("")
    setValor("")
    setModal(true)
  }

  function editarServico(servico) {
    setEditando(servico.id_servico)
    setClienteSelecionado(servico.cliente?.id_cliente || "")
    setDescricao(servico.descricao_servico)
    setDataServico(servico.data_servico)
    setValor(servico.valor_servico || "")
    setModal(true)
  }

  function fecharModal() {
    setModal(false)
  }

  const servicosFiltrados = servicos.filter(s =>
    (s.cliente?.nome_cliente || "").toLowerCase().includes(busca.toLowerCase()) ||
    (s.cliente?.placa_carro_cliente || "").toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="page-navbar">
      <Navbaradm />

      <div className="container mt-5">
        <h3 className="mb-4">SERVIÇOS – BF TAPEÇARIA</h3>

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
            CRIAR NOVO SERVIÇO
          </button>
        </div>

        <div className="clientes-grid">
          {servicosFiltrados.map((s) => (
            <div className="cliente-card" key={s.id_servico}>
              <div className="cliente-body">
                <p><strong>Cliente:</strong> {s.cliente?.nome_cliente}</p>
                <p><strong>Placa:</strong> {s.cliente?.placa_carro_cliente}</p>
                <p><strong>Data:</strong> {s.data_servico}</p>
                <p><strong>Serviço:</strong> {s.descricao_servico}</p>
                <p><strong>Valor:</strong> R$ {s.valor_servico}</p>
              </div>

              <div className="cliente-actions">
                <button
                  className="btn btn-warning"
                  onClick={() => editarServico(s)}
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <div className="form-overlay">
          <div className="form-popup">
            <h4>{editando ? "Editar Serviço" : "Novo Serviço"}</h4>

            <select
              className="form-control mb-2"
              value={clienteSelecionado}
              onChange={(e) => setClienteSelecionado(e.target.value)}
            >
              <option value="">Selecione um cliente</option>
              {clientes.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.nome_cliente} ({c.placa_carro_cliente})
                </option>
              ))}
            </select>

            <input
              type="date"
              className="form-control mb-2"
              value={dataServico}
              onChange={(e) => setDataServico(e.target.value)}
            />

            <textarea
              className="form-control mb-2"
              placeholder="Descrição do serviço"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Valor do serviço"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />

            <div className="d-flex justify-content-center gap-3 mt-3">
              <button className="btn text-white px-4 py-2" onClick={salvarServico}>
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
              <button className="btn btn-warning" onClick={() => setErro(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
