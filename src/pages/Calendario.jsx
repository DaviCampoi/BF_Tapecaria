import Navbaradm from "../components/Navbaradm"
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function Calendario() {
  const hoje = new Date()
  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const [ano, setAno] = useState(hoje.getFullYear())
  const [servicos, setServicos] = useState([])
  const [diaSelecionado, setDiaSelecionado] = useState(null)
  const [nomeServico, setNomeServico] = useState("")
  const [horaServico, setHoraServico] = useState("")
  const [descricaoServico, setDescricaoServico] = useState("")
  const [statusServico, setStatusServico] = useState("Agendado")
  const [dataServico, setDataServico] = useState("")
  const [eventoSelecionado, setEventoSelecionado] = useState(null)
  const [modoEdicao, setModoEdicao] = useState(false)

  const [exibirPromptExcluir, setExibirPromptExcluir] = useState(false)
  const [exibirPromptSalvar, setExibirPromptSalvar] = useState(false)
  const [exibirSucessoSalvar, setExibirSucessoSalvar] = useState(false)
  const [exibirAvisoNome, setExibirAvisoNome] = useState(false)

  // Estado para mudar o texto do modal de sucesso
  const [textoSucesso, setTextoSucesso] = useState("Ação concluída!")

  useEffect(() => {
    async function buscarEventos() {
      const { data, error } = await supabase.from("evento").select("*")
      if (error) return console.error(error)
      setServicos(data || [])
    }

    buscarEventos()
  }, [])

  const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
  const diasNoMes = new Date(ano, mes, 0).getDate()
  const primeiroDiaSemana = new Date(ano, mes - 1, 1).getDay()
  const offset = primeiroDiaSemana === 0 ? 6 : primeiroDiaSemana - 1
  const diasCalendario = [...Array(offset).fill(null), ...Array.from({ length: diasNoMes }, (_, i) => i + 1)]
  while (diasCalendario.length % 7 !== 0) diasCalendario.push(null)

  function ehHoje(dia) { return (dia === hoje.getDate() && mes === hoje.getMonth() + 1 && ano === hoje.getFullYear()) }
  function mudarMes(delta) {
    let novoMes = mes + delta; let novoAno = ano
    if (novoMes < 1) { novoMes = 12; novoAno-- }
    else if (novoMes > 12) { novoMes = 1; novoAno++ }
    setMes(novoMes); setAno(novoAno)
  }

  function estaAtrasado(dataEvento) {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const data = new Date(dataEvento)
    data.setHours(0, 0, 0, 0)

    return data < hoje
  }

  function abrirFormulario(dia) {
    setDiaSelecionado(dia)
    setNomeServico(""); setHoraServico(""); setDescricaoServico(""); setStatusServico("Agendado")
  }

  function corStatus(status) {
    if (status === "Agendado") return "#fd7e14"
    if (status === "Em andamento") return "#0d6efd"
    if (status === "Concluído") return "#198754"
    return "#6c757d"
  }

  function abrirEvento(evento) {
    setEventoSelecionado(evento)
    setNomeServico(evento.nome_evento); setDescricaoServico(evento.descricao_evento)
    setStatusServico(evento.status_evento); setDataServico(evento.data_evento)
    setHoraServico(evento.hora_evento || ""); setModoEdicao(false)
  }

  async function carregarEventos() {
    const { data, error } = await supabase.from("evento").select("*").order("data_evento", { ascending: true })
    if (error) return
    setServicos(data || [])
  }

  async function confirmarSalvar() {
    const dataFormatada = `${ano}-${String(mes).padStart(2, "0")}-${String(diaSelecionado).padStart(2, "0")}`
    const { error } = await supabase.from("evento").insert({
      nome_evento: nomeServico, data_evento: dataFormatada,
      hora_evento: horaServico, descricao_evento: descricaoServico, status_evento: statusServico
    })
    if (error) return
    setExibirPromptSalvar(false); setDiaSelecionado(null); await carregarEventos();
    setTextoSucesso("Agendado com sucesso!"); setExibirSucessoSalvar(true)
  }

  async function atualizarServico() {
    if (!nomeServico.trim()) { setExibirAvisoNome(true); return; }
    const { error } = await supabase.from("evento").update({
      nome_evento: nomeServico, descricao_evento: descricaoServico,
      status_evento: statusServico, data_evento: dataServico, hora_evento: horaServico
    }).eq("id_evento", eventoSelecionado.id_evento)
    if (error) return
    setEventoSelecionado(null); await carregarEventos();
    setTextoSucesso("Atualizado com sucesso!"); setExibirSucessoSalvar(true)
  }

  async function confirmarExclusao() {
    const { error } = await supabase.from("evento").delete().eq("id_evento", eventoSelecionado.id_evento)
    if (error) return
    setExibirPromptExcluir(false);
    setEventoSelecionado(null);
    await carregarEventos();
    // AJUSTE: AVISO DE EXCLUÍDO COM SUCESSO
    setTextoSucesso("Excluído com sucesso!");
    setExibirSucessoSalvar(true)
  }

  return (
    <div className="page-navbar">
      <Navbaradm />
      <div className="container mt-5">
        <h2 className="mb-4 text-center">CALENDÁRIO DE SERVIÇOS</h2>

        {/* Controle de navegação entre meses */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-dark rounded-pill px-3" onClick={() => mudarMes(-1)}>◀</button>
          <h4 className="m-0">{nomesMeses[mes - 1]} {ano}</h4>
          <button className="btn btn-dark rounded-pill px-3" onClick={() => mudarMes(1)}>▶</button>
        </div>

        {/* Tabela principal do calendário */}
        <table className="table" style={{ tableLayout: "fixed", width: "100%", textAlign: "left" }}>
          <thead className="table-light">
            <tr>{diasSemana.map((dia) => (<th key={dia}>{dia}</th>))}</tr>
          </thead>

          {/* Corpo do calendário (semanas e dias) */}
          <tbody>
            {Array.from({ length: diasCalendario.length / 7 }, (_, semanaIndex) => (
              <tr key={`semana-${semanaIndex}`}>
                {diasCalendario.slice(semanaIndex * 7, semanaIndex * 7 + 7).map((dia, diaIndex) => {

                  /* Célula vazia (antes do início do mês) */
                  if (!dia) return <td key={`vazio-${semanaIndex}-${diaIndex}`} style={{ height: "130px", backgroundColor: "#f8f9fa" }} />

                  /* Filtra eventos do dia atual */
                  const eventosDoDia = servicos.filter((s) => {
                    const [y, m, d] = s.data_evento.split("-")
                    return parseInt(y) === ano && parseInt(m) === mes && parseInt(d) === dia
                  })
                  return (

                    /* Célula de um dia do calendário */
                    <td key={dia} onClick={() => abrirFormulario(dia)} style={{ height: "130px", verticalAlign: "top", backgroundColor: ehHoje(dia) ? "#fff3cd" : "#ffffff", cursor: "pointer", border: "1px solid #dee2e6" }}>
                      <strong style={{ background: ehHoje(dia) ? "#ffc107" : "transparent", borderRadius: "50%", width: "25px", height: "25px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{dia}</strong>

                      {/* Lista de eventos do dia */}
                      {eventosDoDia.map((s) => (

                        /* Card do evento */
                        <div
                          key={s.id_evento}
                          onClick={(e) => { e.stopPropagation(); abrirEvento(s); }}
                          style={{
                            background:
                              estaAtrasado(s.data_evento) && s.status_evento !== "Concluído"
                                ? "#dc3545" // 🔴 vermelho (atrasado)
                                : corStatus(s.status_evento), // normal
                            marginTop: "4px",
                            padding: "4px",
                            borderRadius: "6px",
                            color: "white",
                            fontSize: "11px",
                            lineHeight: "1.2"
                          }}
                        >
                          <strong>{s.nome_evento}</strong>

                          {/* Horário do evento */}
                          <div style={{ fontSize: "9px", opacity: 0.9 }}>{s.hora_evento?.slice(0, 5)}</div>
                          {/* Descrição do evento */}
                          <div style={{ fontSize: "9px", marginTop: "2px", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.descricao_evento}</div>
                        </div>
                      ))}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL EDIÇÃO */}
      {eventoSelecionado && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9998 }}>
          <div style={{ background: "#fff", padding: "30px", borderRadius: "16px", width: "420px" }}>
            <h4 className="mb-3">Editar Serviço</h4>
            <label>Nome</label><input className="form-control mb-2" value={nomeServico} onChange={(e) => setNomeServico(e.target.value)} disabled={!modoEdicao} />
            <label>Descrição</label><input className="form-control mb-2" value={descricaoServico} onChange={(e) => setDescricaoServico(e.target.value)} disabled={!modoEdicao} />
            <div className="d-flex gap-2 mb-2">
              <div className="w-100"><label>Data</label><input type="date" className="form-control" value={dataServico} onChange={(e) => setDataServico(e.target.value)} disabled={!modoEdicao} /></div>
              <div className="w-100"><label>Hora</label><input type="time" className="form-control" value={horaServico} onChange={(e) => setHoraServico(e.target.value)} disabled={!modoEdicao} /></div>
            </div>
            <label>Status</label>
            <select className="form-control mb-3" value={statusServico} onChange={(e) => setStatusServico(e.target.value)} disabled={!modoEdicao}>
              <option>Agendado</option><option>Em andamento</option><option>Concluído</option>
            </select>
            <div className="d-flex gap-2">
              {!modoEdicao && <button className="btn btn-primary" onClick={() => setModoEdicao(true)}>Editar</button>}
              {modoEdicao && <button className="btn btn-success" onClick={atualizarServico}>Salvar</button>}
              <button className="btn btn-danger" onClick={() => setExibirPromptExcluir(true)}>Excluir</button>
              <button className="btn btn-secondary" onClick={() => setEventoSelecionado(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SUCESSO (USADO PARA SALVAR E EXCLUIR) */}
      {exibirSucessoSalvar && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 11000 }}>
          <div style={{ background: "#fff", padding: "40px 30px", borderRadius: "20px", width: "350px", textAlign: "center", boxShadow: "0 15px 35px rgba(0,0,0,0.3)" }}>
            <div className="mb-4">
              <div style={{ width: "80px", height: "80px", backgroundColor: "#28a745", borderRadius: "25px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", transform: "rotate(45deg)", boxShadow: "0 4px 15px rgba(40, 167, 69, 0.4)" }}>
                <span style={{ color: "#fff", fontSize: "40px", transform: "rotate(-45deg)", fontWeight: "bold" }}>✓</span>
              </div>
            </div>
            <h4 style={{ color: "#333", fontWeight: "bold" }}>{textoSucesso}</h4>
            <button className="btn btn-success w-100 rounded-pill py-2 mt-3 fw-bold" onClick={() => setExibirSucessoSalvar(false)}>OK</button>
          </div>
        </div>
      )}

      {/* AVISO DE NOME OBRIGATÓRIO */}
      {exibirAvisoNome && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 12000 }}>
          <div style={{ background: "#fff", padding: "30px", borderRadius: "20px", width: "350px", textAlign: "center" }}>
            <div className="mb-4"><div style={{ fontSize: "60px" }}>⚠️</div></div>
            <h4 className="fw-bold">Atenção!</h4>
            <p className="text-muted">O nome do serviço é obrigatório.</p>
            <button className="btn btn-warning w-100 rounded-pill py-2 mt-3 fw-bold text-white" onClick={() => setExibirAvisoNome(false)}>ENTENDI</button>
          </div>
        </div>
      )}

      {/* CONFIRMAÇÃO DE SALVAR */}
      {exibirPromptSalvar && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", padding: "30px", borderRadius: "16px", width: "350px", textAlign: "center" }}>
            <h5 className="mb-3">Confirmar Agendamento?</h5>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-success px-4" onClick={confirmarSalvar}>Sim</button>
              <button className="btn btn-secondary px-4" onClick={() => setExibirPromptSalvar(false)}>Não</button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMAÇÃO DE EXCLUIR */}
      {exibirPromptExcluir && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "#fff", padding: "30px", borderRadius: "16px", width: "350px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <div className="mb-3"><span style={{ fontSize: "50px", color: "#dc3545" }}>⚠️</span></div>
            <h5 className="mb-3">Deseja excluir este serviço?</h5>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-danger px-4" onClick={confirmarExclusao}>Sim, excluir</button>
              <button className="btn btn-secondary px-4" onClick={() => setExibirPromptExcluir(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* FORMULÁRIO NOVO SERVIÇO */}
      {diaSelecionado && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9998 }}>
          <div style={{ background: "#fff", padding: "30px", borderRadius: "16px", width: "420px" }}>
            <h4 className="mb-3">Novo Serviço - Dia {diaSelecionado}</h4>
            <label>Nome</label><input className="form-control mb-2" value={nomeServico} onChange={(e) => setNomeServico(e.target.value)} />
            <label>Horário</label><input type="time" className="form-control mb-2" value={horaServico} onChange={(e) => setHoraServico(e.target.value)} />
            <label>Descrição</label><input className="form-control mb-2" value={descricaoServico} onChange={(e) => setDescricaoServico(e.target.value)} />
            <label>Status</label>
            <select className="form-control mb-3" value={statusServico} onChange={(e) => setStatusServico(e.target.value)}><option>Agendado</option><option>Em andamento</option><option>Concluído</option></select>
            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={() => { if (!nomeServico.trim()) setExibirAvisoNome(true); else setExibirPromptSalvar(true); }}>Salvar</button>
              <button className="btn btn-secondary" onClick={() => setDiaSelecionado(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}