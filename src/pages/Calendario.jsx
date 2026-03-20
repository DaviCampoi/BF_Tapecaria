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


useEffect(()=>{
carregarEventos()
},[])


async function carregarEventos(){

const { data, error } = await supabase
.from("evento")
.select("*")

if(error){
console.error(error)
return
}

setServicos(data || [])

}


const nomesMeses = [
"Janeiro","Fevereiro","Março","Abril","Maio","Junho",
"Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
]

const diasSemana = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"]

const diasNoMes = new Date(ano, mes, 0).getDate()
const primeiroDiaSemana = new Date(ano, mes - 1, 1).getDay()
const offset = primeiroDiaSemana === 0 ? 6 : primeiroDiaSemana - 1

const diasCalendario = [
  ...Array(offset).fill(null),
  ...Array.from({ length: diasNoMes }, (_, i) => i + 1)
]

while (diasCalendario.length % 7 !== 0) {
  diasCalendario.push(null)
}

function ehHoje(dia){

return(
dia === hoje.getDate() &&
mes === hoje.getMonth() + 1 &&
ano === hoje.getFullYear()
)

}


function mudarMes(delta){

let novoMes = mes + delta
let novoAno = ano

if(novoMes < 1){
novoMes = 12
novoAno--
}

else if(novoMes > 12){
novoMes = 1
novoAno++
}

setMes(novoMes)
setAno(novoAno)

}


function abrirFormulario(dia){

setDiaSelecionado(dia)

setNomeServico("")
setHoraServico("")
setDescricaoServico("")
setStatusServico("Agendado")

}


function corStatus(status){

if(status === "Agendado") return "#fd7e14"
if(status === "Em andamento") return "#0d6efd"
if(status === "Concluído") return "#198754"

return "#6c757d"

}


function abrirEvento(evento) {
  setEventoSelecionado(evento)

  setNomeServico(evento.nome_evento)
  setDescricaoServico(evento.descricao_evento)
  setStatusServico(evento.status_evento)
  setDataServico(evento.data_evento)
  setHoraServico(evento.hora_evento || "")

  setModoEdicao(false)
}

async function salvarServico() {
  if (!diaSelecionado || !nomeServico || !horaServico) return

  const dataEvento = new Date(ano, mes - 1, diaSelecionado)

  const hojeSemHora = new Date()
  hojeSemHora.setHours(0, 0, 0, 0)

  let statusFinal = statusServico

  if (dataEvento < hojeSemHora) {
    statusFinal = "Concluído"
  }

  const dataFormatada = `${ano}-${String(mes).padStart(2, "0")}-${String(diaSelecionado).padStart(2, "0")}`

  const { error } = await supabase
    .from("evento")
    .insert({
      nome_evento: nomeServico,
      data_evento: dataFormatada,
      hora_evento: horaServico,
      descricao_evento: descricaoServico,
      status_evento: statusFinal
    })

  if (error) {
    console.error(error)
    return
  }

  setDiaSelecionado(null)
  carregarEventos()
}

async function atualizarServico() {
  const { error } = await supabase
    .from("evento")
    .update({
      nome_evento: nomeServico,
      descricao_evento: descricaoServico,
      status_evento: statusServico,
      data_evento: dataServico,
      hora_evento: horaServico
    })
    .eq("id_evento", eventoSelecionado.id_evento)

  if (error) {
    console.error(error)
    return
  }

  setEventoSelecionado(null)
  carregarEventos()
}


async function excluirServico(id){

await supabase
.from("evento")
.delete()
.eq("id_evento",id)

setEventoSelecionado(null)

carregarEventos()

}


return(
<>

<Navbaradm/>

<div className="container mt-5">

<h2 className="mb-4 text-center">
CALENDÁRIO DE SERVIÇOS
</h2>


<div className="d-flex justify-content-between align-items-center mb-4">

<button
className="btn btn-dark rounded-pill px-3"
onClick={()=>mudarMes(-1)}
> 
◀
</button>

<h4 className="m-0">
{nomesMeses[mes-1]} {ano}
</h4>

<button
className="btn btn-dark rounded-pill px-3"
onClick={()=>mudarMes(1)}
> 
▶
</button>

</div>


<div>

<table
  className="table"
  style={{ tableLayout: "fixed", width: "100%", textAlign: "left" }}
>

<thead className="table-light">

<tr>
{diasSemana.map((dia)=>(
<th key={dia}>{dia}</th>
))}
</tr>

</thead>


<tbody>
  {Array.from({ length: diasCalendario.length / 7 }, (_, semanaIndex) => (
    <tr key={`${ano}-${mes}-semana-${semanaIndex}`}>
      {diasCalendario
        .slice(semanaIndex * 7, semanaIndex * 7 + 7)
        .map((dia, diaIndex) => {
          if (!dia) {
            return (
              <td
                key={`vazio-${semanaIndex}-${diaIndex}`}
                style={{
                  height: "130px",
                  backgroundColor: "#f8f9fa"
                }}
              />
            )
          }

          const eventosDoDia = servicos.filter((s) => {
            const [y, m, d] = s.data_evento.split("-")

            return (
              parseInt(y) === ano &&
              parseInt(m) === mes &&
              parseInt(d) === dia
            )
          })
          const eventosOrdenados = [...eventosDoDia].sort((a, b) =>
  (a.hora_evento || "").localeCompare(b.hora_evento || "")
)

          return (
            <td key={`${ano}-${mes}-${dia}`}
              onClick={() => abrirFormulario(dia)}
              style={{
                height: "130px",
                verticalAlign: "top",
                backgroundColor: ehHoje(dia) ? "#fff3cd" : "#ffffff",
                cursor: "pointer"
              }}
            >
              <div className="d-flex justify-content-between">
                <strong
                  style={{
                    background: ehHoje(dia) ? "#ffc107" : "transparent",
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

              {eventosOrdenados.map((s) => (
  <div
    key={s.id_evento}
    onClick={(e) => {
      e.stopPropagation()
      abrirEvento(s)
    }}
    style={{
      background: corStatus(s.status_evento),
      marginTop: "6px",
      padding: "6px",
      borderRadius: "8px",
      color: "white",
      fontSize: "12px",
      cursor: "pointer"
    }}
  >
    <strong>{s.nome_evento}</strong>

    {s.hora_evento && (
  <div>
    {s.hora_evento.slice(0, 5)}
  </div>
)}

    <div>{s.descricao_evento}</div>

    <div style={{ fontSize: "11px" }}>
      {s.status_evento}
    </div>
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


{eventoSelecionado && (

<div
style={{
position:"fixed",
top:"0",
left:"0",
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.5)",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:"9999"
}}
>

<div
style={{
background:"#fff",
padding:"30px",
borderRadius:"16px",
width:"420px"
}}
>

<h4 className="mb-3">Editar Serviço</h4>

<label>Nome</label>
<input
className="form-control mb-2"
value={nomeServico}
onChange={(e)=>setNomeServico(e.target.value)}
disabled={!modoEdicao}
/>

<label>Descrição</label>
<input
className="form-control mb-2"
value={descricaoServico}
onChange={(e)=>setDescricaoServico(e.target.value)}
disabled={!modoEdicao}
/>

<label>Data</label>
<input
type="date"
className="form-control mb-2"
value={dataServico}
onChange={(e)=>setDataServico(e.target.value)}
disabled={!modoEdicao}
/>
<label>Horário</label>
<input
  type="time"
  className="form-control mb-2"
  value={horaServico}
  onChange={(e) => setHoraServico(e.target.value)}
  disabled={!modoEdicao}
/>
<label>Status</label>
<select
className="form-control mb-3"
value={statusServico}
onChange={(e)=>setStatusServico(e.target.value)}
disabled={!modoEdicao}
> 
<option>Agendado</option>
<option>Em andamento</option>
<option>Concluído</option>
</select>


<div className="d-flex gap-2">

{!modoEdicao && (
<button
className="btn btn-primary"
onClick={()=>setModoEdicao(true)}
> 
Editar
</button>
)}

{modoEdicao && (
<button
className="btn btn-success"
onClick={atualizarServico}
> 
Salvar
</button>
)}

<button
className="btn btn-danger"
onClick={()=>excluirServico(eventoSelecionado.id_evento)}
> 
Excluir
</button>

<button
className="btn btn-secondary"
onClick={()=>setEventoSelecionado(null)}
> 
Fechar
</button>

</div>

</div>

</div>

)}
{diaSelecionado && (

  <div
    style={{
      position:"fixed",
      top:"0",
      left:"0",
      width:"100%",
      height:"100%",
      background:"rgba(0,0,0,0.5)",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      zIndex:"9999"
    }}
  >

    <div
      style={{
        background:"#fff",
        padding:"30px",
        borderRadius:"16px",
        width:"420px"
      }}
    >

      <h4 className="mb-3">
        Novo Serviço - Dia {diaSelecionado}
      </h4>

      <label>Nome do serviço</label>
      <input
        className="form-control mb-2"
        value={nomeServico}
        onChange={(e)=>setNomeServico(e.target.value)}
      />

      <label>Horário</label>
      <input
        type="time"
        className="form-control mb-2"
        value={horaServico}
        onChange={(e)=>setHoraServico(e.target.value)}
      />

      <label>Descrição</label>
      <input
        className="form-control mb-2"
        value={descricaoServico}
        onChange={(e)=>setDescricaoServico(e.target.value)}
      />

      <label>Status</label>
      <select
        className="form-control mb-3"
        value={statusServico}
        onChange={(e)=>setStatusServico(e.target.value)}
      >
        <option>Agendado</option>
        <option>Em andamento</option>
        <option>Concluído</option>
      </select>

      <div className="d-flex gap-2">
        <button
          className="btn btn-success"
          onClick={salvarServico}
        >
          Salvar
        </button>

        <button
          className="btn btn-secondary"
          onClick={()=>setDiaSelecionado(null)}
        >
          Cancelar
        </button>
      </div>

    </div>

  </div>

)}
</>

)

}