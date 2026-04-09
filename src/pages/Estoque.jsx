import { useState, useEffect } from "react" 
import Navbaradm from "../components/Navbaradm" 
import { supabase } from "../supabaseClient" 

export default function Estoque(){ 

const [itens,setItens] = useState([]) 
const [nome,setNome] = useState("") 
const [descricao,setDescricao] = useState("") 
const [tem,setTem] = useState(true) 

const [editando,setEditando] = useState(null) 
const [busca,setBusca] = useState("") 

const [ordemCampo,setOrdemCampo] = useState("id") 
const [ordemDirecao,setOrdemDirecao] = useState("asc") 

const [exibirSucesso, setExibirSucesso] = useState(false) 
const [mensagemSucesso, setMensagemSucesso] = useState("") 
const [mostrarModalExcluir,setMostrarModalExcluir] = useState(false) 
const [itemParaExcluir,setItemParaExcluir] = useState(null) 

// ESTADO DO MODAL DE ERRO
const [exibirErro, setExibirErro] = useState(false)

useEffect(() => { 
  async function buscarItens(){
    const { data } = await supabase.from("estoque").select("*") 
    setItens(data || []) 
  }

  buscarItens()
}, [])

async function adicionarItem(e){ 
    e.preventDefault() 

    if(!nome.trim()){ 
        setExibirErro(true) // ABRE O MODAL EM VEZ DO ALERT
        return
    }

    const maiorCodigo = itens.length > 0 
    ? Math.max(...itens.map(item => item.codigo_item || 0)) 
    : 0

    const novoCodigo = maiorCodigo + 1 

    const { data, error } = await supabase 
    .from("estoque")
    .insert({
        codigo_item: novoCodigo,
        nome_item: nome.trim(),
        descricao_item: descricao.trim(),
        tem_nao_tem_item: tem
    })
    .select()

    if(error){ 
        console.error(error)  
        return
    }

    setItens([...itens, ...data]) 
    setNome(""); setDescricao(""); setTem(true) 
    setMensagemSucesso("Item catalogado com sucesso!") 
    setExibirSucesso(true) 
}

async function salvar(item){ 
    if(!item.nome_item.trim()){ 
        setExibirErro(true)
        return
    }

    setEditando(null) 

    const { error } = await supabase 
    .from("estoque")
    .update({
        nome_item:item.nome_item.trim(),
        descricao_item:item.descricao_item.trim(),
        tem_nao_tem_item:item.tem_nao_tem_item
    })
    .eq("id_item",item.id_item)

    if(!error){ 
        setMensagemSucesso("Item atualizado com sucesso!") 
        setExibirSucesso(true) 
    }
}

function alterarCampo(id,campo,valor){ 
    setItens(itens.map(item =>
        item.id_item === id ? {...item,[campo]:valor} : item
    ))
}

function ordenarPor(campo){ 
    if(ordemCampo === campo){
        setOrdemDirecao(ordemDirecao === "asc" ? "desc" : "asc") 
    }else{
        setOrdemCampo(campo) 
        setOrdemDirecao("asc") 
    }
}

function pedirExclusao(id){ 
    setItemParaExcluir(id) 
    setMostrarModalExcluir(true) 
}

async function confirmarExclusao(){ 
    setMostrarModalExcluir(false) 
    setItens(itens.filter(item => item.id_item !== itemParaExcluir)) 

    const { error } = await supabase 
    .from("estoque")
    .delete()
    .eq("id_item", itemParaExcluir)

    if(!error){
        setMensagemSucesso("Item excluído com sucesso!") 
        setExibirSucesso(true) 
    }
    setItemParaExcluir(null) 
}

const itensFiltrados = itens 
.filter(item => item.nome_item?.toLowerCase().includes(busca.toLowerCase())) 
.sort((a, b) => { 
    if(ordemCampo === "nome"){
        return ordemDirecao === "asc" ? a.nome_item.localeCompare(b.nome_item) : b.nome_item.localeCompare(a.nome_item)
    }
    if(ordemCampo === "status"){
        return ordemDirecao === "asc" ? Number(a.tem_nao_tem_item) - Number(b.tem_nao_tem_item) : Number(b.tem_nao_tem_item) - Number(a.tem_nao_tem_item)
    }
    if(ordemCampo === "id"){
        return ordemDirecao === "asc" ? a.codigo_item - b.codigo_item : b.codigo_item - a.codigo_item
    }
    return 0
})

return(
<div className="page-navbar">
<Navbaradm/> 

<div style={{ padding: "0 10px", marginTop: "20px" }}>
<h3 className="mb-3 text-center fw-bold">ESTOQUE – BF TAPEÇARIA</h3> 

<form onSubmit={adicionarItem} className="mb-3 p-3 border rounded bg-light shadow-sm"> 
    <input className="form-control form-control-sm mb-2" placeholder="Nome do item" value={nome} onChange={(e)=>setNome(e.target.value)} />
    <textarea className="form-control form-control-sm mb-2" placeholder="Descrição" value={descricao} onChange={(e)=>setDescricao(e.target.value)} />
    <div className="mb-2">
        <label className="me-3"><input type="radio" checked={tem === true} onChange={()=>setTem(true)} /> Tem</label>
        <label><input type="radio" checked={tem === false} onChange={()=>setTem(false)} /> Não tem</label>
    </div>
    <button className="btn btn-warning btn-sm text-white w-100 fw-bold">Adicionar Material</button>
</form>

<input className="form-control form-control-sm mb-3 shadow-sm" placeholder="🔍 Buscar item no estoque..." value={busca} onChange={(e)=>setBusca(e.target.value)} />

<div className="table-responsive shadow-sm rounded">
    
<table className="table estoque-table">
    <thead className="table"> 
        <tr>
            <th style={{width:"80px", textAlign:"center", padding:"10px 12px", cursor:"pointer"}} onClick={()=>ordenarPor("id")}>ID</th>
            <th style={{width:"120px", textAlign:"center", padding:"10px 12px", cursor:"pointer"}} onClick={()=>ordenarPor("status")}>Status</th>
            <th style={{width:"120px", padding:"10px 23px", cursor:"pointer"}} onClick={()=>ordenarPor("nome")}>Nome</th>
            <th style={{width:"140px", textAlign:"center"}}>Ações</th>
            
        </tr>
    </thead>
    <tbody>
        
        {itensFiltrados.map((item)=>{ 
            const editandoLinha = editando === item.id_item 
            return(
                <tr key={item.id_item} style={{ cursor: "pointer" }}>
    <td className="text-center align-middle">
        {item.codigo_item}
    </td>

    <td 
  style={{textAlign:"center", verticalAlign:"middle", padding:"10px 12px"}}
>
                        {editandoLinha ? (
                            <select value={item.tem_nao_tem_item ? "tem" : "nao"} onChange={(e)=>alterarCampo(item.id_item,"tem_nao_tem_item", e.target.value === "tem")} className="form-select form-select-sm">
                                <option value="tem">Tem</option><option value="nao">Não</option>
                            </select>
                        ) : (
                            item.tem_nao_tem_item ? <span className="badge bg-success">Tem</span> : <span className="badge bg-danger">Não</span>
                        )}
                    </td>
                    <td
  className="align-middle text-start ps-4"
  style={{ cursor: "pointer", userSelect: "none" }}
>
  {editandoLinha ? (
    <>
      <input
        value={item.nome_item}
        onChange={(e) => alterarCampo(item.id_item, "nome_item", e.target.value)}
        className="form-control form-control-sm mb-1"
      />
      <input
        value={item.descricao_item}
        onChange={(e) => alterarCampo(item.id_item, "descricao_item", e.target.value)}
        className="form-control form-control-sm"
      />
    </>
  ) : (
    <div
      style={{ cursor: "pointer", userSelect: "none" }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <span
        className="fw-bold"
        style={{ cursor: "pointer", userSelect: "none", display: "block" }}
      >
        {item.nome_item}
      </span>

      {item.descricao_item && (
        <small
          className="text-muted"
          style={{ cursor: "pointer", userSelect: "none", display: "block" }}
        >
          {item.descricao_item}
        </small>
      )}
    </div>
  )}
</td>
                    <td style={{textAlign:"center", verticalAlign:"middle"}}>
                        {editandoLinha ? (
                            <button className="btn btn-success btn-sm w-100" onClick={()=>salvar(item)}>Salvar</button>
                        ) : (
                            <div className="d-flex justify-content-center align-items-center gap-1">
                                <button className="btn btn-warning btn-sm text-white" onClick={()=>setEditando(item.id_item)}>Editar</button>
                                <button className="btn btn-danger btn-sm" onClick={()=>pedirExclusao(item.id_item)}>Excluir</button>
                            </div>
                        )}
                    </td>
                </tr>
            )
        })}
    </tbody>
</table>
</div>
</div>

{/* MODAL DE ERRO - NOME OBRIGATÓRIO */}
{exibirErro && (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 12000 }}>
        <div style={{ background: "#fff", padding: "30px", borderRadius: "15px", width: "320px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: "50px", marginBottom: "10px" }}>⚠️</div>
            <h5 className="fw-bold">Atenção!</h5>
            <p className="text-muted">O nome do material é obrigatório para o cadastro.</p>
            <button className="btn btn-danger w-100 rounded-pill mt-2 fw-bold" onClick={() => setExibirErro(false)}>Entendi</button>
        </div>
    </div>
)}

{exibirSucesso && (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 11000 }}>
        <div style={{ background: "#fff", padding: "40px 30px", borderRadius: "20px", width: "350px", textAlign: "center", boxShadow: "0 15px 35px rgba(0,0,0,0.3)" }}>
            <div className="mb-4">
                <div style={{ width: "80px", height: "80px", backgroundColor: "#28a745", borderRadius: "25px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", transform: "rotate(45deg)", boxShadow: "0 4px 15px rgba(40, 167, 69, 0.4)" }}>
                    <span style={{ color: "#fff", fontSize: "40px", transform: "rotate(-45deg)", fontWeight: "bold" }}>✓</span>
                </div>
            </div>
            <h4 style={{ color: "#333", fontWeight: "bold" }}>{mensagemSucesso}</h4>
            <button className="btn btn-success w-100 rounded-pill py-2 mt-3 fw-bold" onClick={() => setExibirSucesso(false)}>OK</button>
        </div>
    </div>
)}

{mostrarModalExcluir && (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
        <div style={{ background: "#fff", padding: "30px", borderRadius: "16px", width: "350px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <div className="mb-3"><span style={{ fontSize: "50px", color: "#dc3545" }}>⚠️</span></div>
            <h5 className="mb-3">Tem certeza?</h5>
            <p className="text-muted mb-4">Deseja realmente excluir este item do estoque? Esta ação não pode ser desfeita.</p>
            <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-danger px-4 fw-bold" onClick={confirmarExclusao}>Sim, excluir</button>
                <button className="btn btn-secondary px-4" onClick={()=>setMostrarModalExcluir(false)}>Cancelar</button>
            </div>
        </div>
    </div>
)}
</div>
)
}