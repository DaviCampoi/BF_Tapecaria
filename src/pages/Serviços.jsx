import Navbaradm from "../components/Navbaradm"
import { useState, useEffect, forwardRef } from "react"
import { supabase } from "../supabaseClient"
import { ptBR } from "date-fns/locale"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import icone from "../assets/icone.png"
import calendario from "../assets/calendario.png"
import deleteIcon from "../assets/delete.png"
import editIcon from "../assets/edit.png"

const CustomInput = forwardRef(({ value, onClick }, ref) => {
  return (
    <button className="form-control text-start" onClick={onClick} ref={ref}>
      <img
        src={calendario}
        alt="calendário"
        style={{ width: 18, marginRight: 8 }}
      />
      {value ? value : "Selecionar período"}
    </button>
  )
})

export default function Servicos() {

  const [servicos, setServicos] = useState([])
  const [clientes, setClientes] = useState([])

  const [modal, setModal] = useState(false)

  const [clienteFiltro, setClienteFiltro] = useState("")
  const [servicosFiltrados, setServicosFiltrados] = useState([])

  const [periodo, setPeriodo] = useState([null, null])
  const [dataInicio, dataFim] = periodo

  const [aberto, setAberto] = useState(null)

  const [editando, setEditando] = useState(null)

  const [clienteSelecionado, setClienteSelecionado] = useState("")
  const [descricao, setDescricao] = useState("")
  const [dataServico, setDataServico] = useState("")
  const [valor, setValor] = useState("")

  const [erro, setErro] = useState(false)
  const [mensagemErro, setMensagemErro] = useState("")

  const [confirmarDelete, setConfirmarDelete] = useState(false)
  const [servicoParaExcluir, setServicoParaExcluir] = useState(null)

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
          placa_carro_cliente,
          telefone_cliente,
          modelo_carro_cliente,
          cor_carro_cliente,
          descricao_servico_cliente
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

  useEffect(() => {
    setServicosFiltrados(servicos)
  }, [servicos])

  async function salvarServico() {

    if (
      !clienteSelecionado ||
      !descricao.trim() ||
      !dataServico ||
      valor === ""
    ) {
      setMensagemErro("Preencha todos os campos")
      setErro(true)
      return
    }

    const payload = {
      id_cliente: clienteSelecionado,
      descricao_servico: descricao,
      data_servico: dataServico,
      valor_servico: parseFloat(valor)
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

    setMensagemErro(
      editando
        ? "Serviço atualizado com sucesso!"
        : "Serviço salvo com sucesso!"
    )

    setErro(true)

    fecharModal()

    buscarServicos()
  }

  function excluirServico(id) {

    setServicoParaExcluir(id)

    setConfirmarDelete(true)
  }

  function abrirNovo() {

    setEditando(null)

    setClienteSelecionado("")
    setDescricao("")
    setDataServico("")
    setValor("")

    setModal(true)
  }

  function aplicarFiltro() {

    let filtrados = [...servicos]

    if (clienteFiltro) {

      filtrados = filtrados.filter(
        s => s.cliente?.id_cliente === Number(clienteFiltro)
      )
    }

    if (dataInicio && dataFim) {

      filtrados = filtrados.filter(s => {

        const data = new Date(
          s.data_servico + "T00:00:00"
        )

        return data >= dataInicio && data <= dataFim
      })
    }

    setServicosFiltrados(filtrados)
  }

  function limparFiltro() {

    setClienteFiltro("")
    setPeriodo([null, null])

    setServicosFiltrados(servicos)
  }

  function editarServico(servico) {

    setEditando(servico.id_servico)

    setClienteSelecionado(
      servico.cliente?.id_cliente || ""
    )

    setDescricao(servico.descricao_servico)

    setDataServico(servico.data_servico)

    setValor(servico.valor_servico?.toString() || "")

    setModal(true)
  }

  function fecharModal() {
    setModal(false)
  }

  const servicosAgrupados = (servicosFiltrados || []).reduce(

    (acc, s) => {

      const cliente =
        s.cliente?.nome_cliente || "Sem nome"

      if (!acc[cliente]) {
        acc[cliente] = []
      }

      acc[cliente].push(s)

      return acc
    },

    {}
  )

  return (

    <div className="page-navbar servicos-page">

      <Navbaradm />

      <div className="container mt-5">

        <h3 className="titulo">
          SERVIÇOS POR CLIENTE
        </h3>

        <p className="subtitulo">
          Visualize todos os serviços realizados,
          agrupados por cliente.
        </p>

        <div className="filtros-box">

          <div className="filtro-item">

            <label>Cliente</label>

            <select
              className="form-control"
              value={clienteFiltro}
              onChange={(e) =>
                setClienteFiltro(e.target.value)
              }
            >

              <option value="">
                Todos os clientes
              </option>

              {clientes.map(c => (

                <option
                  key={c.id_cliente}
                  value={c.id_cliente}
                >
                  {c.nome_cliente}
                </option>

              ))}

            </select>
          </div>

          <div className="filtro-item">

            <label>Período</label>

            <DatePicker
              selectsRange
              startDate={dataInicio}
              endDate={dataFim}
              onChange={(update) =>
                setPeriodo(update)
              }
              isClearable
              locale={ptBR}
              dateFormat="dd/MM/yyyy"
              customInput={<CustomInput />}
            />
          </div>

          <div className="filtro-botoes">

            <button
              className="btn btn-warning"
              onClick={aplicarFiltro}
            >
              FILTRAR
            </button>

            <button
              className="btn btn-light"
              onClick={limparFiltro}
            >
              LIMPAR
            </button>

          </div>
        </div>

        <div className="d-flex gap-3 mb-4">
          <button
            className="btn btn-warning text-white"
            onClick={abrirNovo}
          >
            CRIAR NOVO SERVIÇO
          </button>

        </div>

        <div className="servicos-lista">

          {Object.entries(servicosAgrupados).map(

            ([clienteNome, lista]) => (

              <div
                className="servico-bloco"
                key={clienteNome}
              >

                <div
                  className="servico-header claro"
                  onClick={() =>
                    setAberto(
                      aberto === clienteNome
                        ? null
                        : clienteNome
                    )
                  }
                >

                  <span className="cliente-nome">
                  <img
                    src={icone}
                      alt="cliente"
                      className="icone-cliente"
                      />

                    {clienteNome}
                  </span>

                  <span className="badge">
                    {lista.length} serviços
                  </span>

                </div>

                {aberto === clienteNome && (

                  <div
                    className="servico-tabela"
                    style={{
                      overflowX: "auto",
                      WebkitOverflowScrolling: "touch"
                    }}
                  >

                    <table
                      className="table"
                      style={{ minWidth: "1000px" }}
                    >

                      <thead>

                        <tr>
                          <th>Data</th>
                          <th>Serviço</th>
                          <th>Modelo</th>
                          <th>Cor</th>
                          <th>Telefone</th>
                          <th>Placa</th>
                          <th>Valor</th>
                          <th>Ações</th>
                        </tr>

                      </thead>

                      <tbody>

                        {lista.map(s => (

                          <tr key={s.id_servico}>

                            <td>{s.data_servico}</td>

                            <td>
                              {s.descricao_servico}
                            </td>

                            <td>
                              {s.cliente?.modelo_carro_cliente}
                            </td>

                            <td>
                              {s.cliente?.cor_carro_cliente}
                            </td>

                            <td>
                              {s.cliente?.telefone_cliente}
                            </td>

                            <td>
                              {s.cliente?.placa_carro_cliente}
                            </td>

                            <td>
                              R$ {s.valor_servico}
                            </td>

                            <td>

                              <div className="d-flex gap-2">

                                <button
                                  className="btn btn-warning"
                                  onClick={() =>
                                    editarServico(s)
                                  }
                                >
                                  <img
                                    src={editIcon}
                                    width="18"
                                  />
                                </button>

                                <button
                                  className="btn btn-warning"
                                  onClick={() =>
                                    excluirServico(
                                      s.id_servico
                                    )
                                  }
                                >
                                  <img
                                    src={deleteIcon}
                                    width="18"
                                  />
                                </button>

                              </div>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>

            )
          )}

        </div>
      </div>

      {modal && (

        <div className="form-overlay">

          <div className="form-popup">

            <h4>
              {editando
                ? "Editar Serviço"
                : "Novo Serviço"}
            </h4>

            <select
              className="form-control mb-2"
              value={clienteSelecionado}
              onChange={(e) =>
                setClienteSelecionado(e.target.value)
              }
            >

              <option value="">
                Selecione um cliente
              </option>

              {clientes.map(c => (

                <option
                  key={c.id_cliente}
                  value={c.id_cliente}
                >
                  {c.nome_cliente}
                  {" "}
                  ({c.placa_carro_cliente})
                </option>

              ))}

            </select>

            <input
              type="date"
              className="form-control mb-2"
              value={dataServico}
              onChange={(e) =>
                setDataServico(e.target.value)
              }
            />

            <textarea
              className="form-control mb-2"
              placeholder="Descrição do serviço"
              value={descricao}
              onChange={(e) =>
                setDescricao(e.target.value)
              }
            />

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Valor do serviço"
              value={valor}
              onChange={(e) =>
                setValor(e.target.value)
              }
            />

            <div className="d-flex justify-content-center gap-3 mt-3">

              <button
                className="btn text-white px-4 py-2"
                onClick={salvarServico}
              >
                Salvar
              </button>

              <button
                className="btn text-white px-4 py-2"
                onClick={fecharModal}
              >
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

      {confirmarDelete && (

        <div className="form-overlay">

          <div className="form-popup">

            <h4>
              Deseja realmente excluir este serviço?
            </h4>

            <div className="d-flex justify-content-center gap-3 mt-3">

              <button
                className="btn btn-warning text-white px-4"
                onClick={async () => {

                  const { error } = await supabase
                    .from("servico")
                    .delete()
                    .eq("id_servico", servicoParaExcluir)

                  if (error) {

                    console.log(error)

                    setMensagemErro("Erro ao excluir serviço")
                    setErro(true)

                    return
                  }

                  buscarServicos()

                  setConfirmarDelete(false)
                  setServicoParaExcluir(null)
                }}
              >
                Sim
              </button>

              <button
                className="btn text-white px-4"
                onClick={() => {

                  setConfirmarDelete(false)
                  setServicoParaExcluir(null)
                }}
              >
                Cancelar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}