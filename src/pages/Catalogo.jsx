import { useState, useEffect } from "react"; // Gerencia estados e ciclo de vida
import Navbaradm from "../components/Navbaradm"; // Barra de navegação
import { supabase } from "../supabaseClient"; // Conexão com banco

export default function Calendario() {
  const [servicos, setServicos] = useState([]); // Armazena agendamentos
  const [mes] = useState(new Date().getMonth() + 1); // Mês fixo atual
  const [ano] = useState(new Date().getFullYear()); // Ano fixo atual
  
  const [mostrarForm, setMostrarForm] = useState(false); // Abre/fecha form
  const [mostrarAvisoNome, setMostrarAvisoNome] = useState(false); // Alerta de erro
  const [nome, setNome] = useState(""); // Input nome

  useEffect(() => { buscarServicos(); }, []); // Busca ao carregar

  async function buscarServicos() { // Puxa dados do Supabase
    const { data } = await supabase.from("calendario").select("*");
    setServicos(data || []);
  }

  const salvar = () => { // Validação do nome
    if (!nome.trim()) { setMostrarAvisoNome(true); return; }
    setMostrarForm(false);
  };

  // Lógica de construção dos dias do mês
  const diasNoMes = new Date(ano, mes, 0).getDate();
  const primeiroDiaSemana = new Date(ano, mes - 1, 1).getDay();
  const dias = [...Array(primeiroDiaSemana).fill(null), ...Array.from({ length: diasNoMes }, (_, i) => i + 1)];

  return (
    <>
      <Navbaradm />
      <div className="container-fluid mt-4 px-4"> {/* Container mais largo */}
        <h3 className="text-center mb-4">CALENDÁRIO DE SERVIÇOS</h3>
        <table className="table table-bordered border-secondary">
          <thead className="table-dark text-center">
            <tr><th>Dom</th><th>Seg</th><th>Ter</th><th>Qua</th><th>Qui</th><th>Sex</th><th>Sáb</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(dias.length / 7) }, (_, i) => (
              <tr key={i}>
                {dias.slice(i * 7, i * 7 + 7).map((dia, idx) => {
                  // Filtra serviços que batem com este dia específico
                  const eventos = servicos.filter(s => {
                    const dataFormatada = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
                    return s.data_evento === dataFormatada;
                  });

                  return (
                    <td key={idx} style={{ height: "120px", width: "14%", verticalAlign: "top", backgroundColor: dia ? "#fff" : "#f0f0f0" }}>
                      {dia && (
                        <>
                          <strong className="d-block mb-1">{dia}</strong>
                          {/* LISTAGEM DOS DADOS DENTRO DO DIA */}
                          {eventos.map(ev => (
                            <div key={ev.id_evento} style={{ background: "#ffc107", fontSize: "11px", padding: "2px", borderRadius: "3px", marginBottom: "2px", color: "#000" }}>
                              <b>{ev.nome_evento}</b> <br/> {ev.hora_evento?.slice(0,5)}h
                            </div>
                          ))}
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE AVISO (NOME OBRIGATÓRIO) */}
      {mostrarAvisoNome && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div style={{ background: "#fff", padding: "30px", borderRadius: "15px", textAlign: "center", width: "300px" }}>
            <h1 style={{ color: "#ffc107" }}>⚠️</h1>
            <p>O campo <b>Nome</b> é obrigatório!</p>
            <button className="btn btn-warning w-100" onClick={() => setMostrarAvisoNome(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}