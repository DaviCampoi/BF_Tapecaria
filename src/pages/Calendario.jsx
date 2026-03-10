import Navbaradm from "../components/Navbaradm"
import { useEffect, useState } from "react"

export default function Calendario() {
  const hoje = new Date()

  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const [ano, setAno] = useState(hoje.getFullYear())

  const [servicos, setServicos] = useState([])
  const [diaSelecionado, setDiaSelecionado] = useState(null)
  const [nomeServico, setNomeServico] = useState("")
  const [horaServico, setHoraServico] = useState("")

  useEffect(() => {
    const salvos = localStorage.getItem("servicos")
    if (salvos) {
      setServicos(JSON.parse(salvos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("servicos", JSON.stringify(servicos))
  }, [servicos])

  const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]

  const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

  const diasNoMes = new Date(ano, mes, 0).getDate()
  const primeiroDiaSemana = new Date(ano, mes - 1, 1).getDay()
  const offset = primeiroDiaSemana === 0 ? 6 : primeiroDiaSemana - 1
  const totalCelulas = Math.ceil((diasNoMes + offset) / 7) * 7
  const celulas = Array.from({ length: totalCelulas }, (_, i) => i - offset + 1)

  function ehHoje(dia) {
    return (
      dia === hoje.getDate() &&
      mes === hoje.getMonth() + 1 &&
      ano === hoje.getFullYear()
    )
  }

  function mudarMes(delta) {
    let novoMes = mes + delta
    let novoAno = ano

    if (novoMes < 1) {
      novoMes = 12
      novoAno--
    } else if (novoMes > 12) {
      novoMes = 1
      novoAno++
    }

    setMes(novoMes)
    setAno(novoAno)
  }

  function abrirFormulario(dia) {
    setDiaSelecionado(dia)
    setNomeServico("")
    setHoraServico("")
  }

  function salvarServico() {
    if (!diaSelecionado || !nomeServico || !horaServico) return

    const data = `${ano}-${String(mes).padStart(2, "0")}-${String(diaSelecionado).padStart(2, "0")}`

    const novoServico = {
      data,
      hora: horaServico,
      nome: nomeServico
    }

    setServicos([...servicos, novoServico])
    setDiaSelecionado(null)
    setNomeServico("")
    setHoraServico("")
  }

  function excluirServico(index) {
    const atualizados = servicos.filter((_, i) => i !== index)
    setServicos(atualizados)
  }

  return (
    <>
      <Navbaradm />

      <div className="container mt-5">
        <h2 className="mb-4 text-center">CALENDÁRIO DE SERVIÇOS</h2>

        {diaSelecionado && (
          <div
            className="p-4 mb-4"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
              border: "1px solid #eee"
            }}
          >
            <h5 className="mb-3">
              Novo serviço para {diaSelecionado}/{mes}/{ano}
            </h5>

            <div className="mb-3">
              <label className="form-label">Nome do serviço</label>
              <input
                type="text"
                className="form-control"
                value={nomeServico}
                onChange={(e) => setNomeServico(e.target.value)}
                placeholder="Ex: Trocar fita"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Horário</label>
              <input
                type="time"
                className="form-control"
                value={horaServico}
                onChange={(e) => setHoraServico(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-warning" onClick={salvarServico}>
                Salvar
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setDiaSelecionado(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-dark rounded-pill px-3" onClick={() => mudarMes(-1)}>
            ◀
          </button>

          <h4 className="m-0">
            {nomesMeses[mes - 1]} {ano}
          </h4>

          <button className="btn btn-dark rounded-pill px-3" onClick={() => mudarMes(1)}>
            ▶
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-light">
              <tr>
                {diasSemana.map((dia) => (
                  <th key={dia}>{dia}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: totalCelulas / 7 }, (_, semanaIndex) => (
                <tr key={semanaIndex}>
                  {celulas
                    .slice(semanaIndex * 7, semanaIndex * 7 + 7)
                    .map((dia, diaIndex) => {
                      if (dia < 1 || dia > diasNoMes) {
                        return (
                          <td
                            key={`${semanaIndex}-${diaIndex}`}
                            style={{
                              height: "130px",
                              backgroundColor: "#f8f9fa"
                            }}
                          />
                        )
                      }

                      const eventosDoDia = servicos
                        .map((servico, indexGlobal) => ({ ...servico, indexGlobal }))
                        .filter((s) => {
                          const [y, m, d] = s.data.split("-")
                          return (
                            parseInt(y) === ano &&
                            parseInt(m) === mes &&
                            parseInt(d) === dia
                          )
                        })

                      return (
                        <td
                          key={dia}
                          onClick={() => abrirFormulario(dia)}
                          style={{
                            minWidth: "140px",
                            height: "130px",
                            verticalAlign: "top",
                            cursor: "pointer",
                            backgroundColor: ehHoje(dia) ? "#fff3cd" : "#ffffff",
                            transition: "0.2s"
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <strong
                              style={{
                                background: ehHoje(dia) ? "#ffc107" : "transparent",
                                color: ehHoje(dia) ? "#000" : "#212529",
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              {dia}
                            </strong>
                          </div>

                          {eventosDoDia.map((s) => (
                            <div
                              key={s.indexGlobal}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                background: "#fd7e14",
                                marginTop: "6px",
                                padding: "6px",
                                borderRadius: "8px",
                                color: "white",
                                fontSize: "12px",
                                textAlign: "left"
                              }}
                            >
                              <div>
                                <strong>{s.hora}</strong> - {s.nome}
                              </div>

                              <button
                                className="btn btn-sm btn-light mt-2"
                                onClick={() => excluirServico(s.indexGlobal)}
                              >
                                Excluir
                              </button>
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
      </div>
    </>
  )
}