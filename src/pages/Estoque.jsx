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
  const [ordem,setOrdem] = useState("asc")

  const [mensagem,setMensagem] = useState(null)

  const [confirmarExcluir,setConfirmarExcluir] = useState(false)
  const [itemParaExcluir,setItemParaExcluir] = useState(null)

  useEffect(()=>{

    carregarItens()

    const channel = supabase
      .channel("estoque-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "estoque" },
        () => carregarItens()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }

  },[])

  async function carregarItens(){

    const { data,error } = await supabase
      .from("estoque")
      .select("*")
      .order("id_item")

    if(error){
      console.error(error)
      return
    }

    setItens(data || [])
  }

  async function adicionarItem(e){

    e.preventDefault()

    if(!nome.trim()){
      setMensagem("O nome do item não pode estar vazio.")
      return
    }

    const { data,error } = await supabase
      .from("estoque")
      .insert({
        nome_item:nome.trim(),
        descricao_item:descricao.trim(),
        tem_nao_tem_item:tem
      })
      .select()

    if(error){
      console.error(error)
      setMensagem("Erro ao adicionar item.")
      return
    }

    setItens([...itens,...data])

    setNome("")
    setDescricao("")
    setTem(true)

    setMensagem("Item adicionado com sucesso!")
  }

  function pedirExclusao(id){
    setItemParaExcluir(id)
    setConfirmarExcluir(true)
  }

  async function confirmarExclusao(){

    setConfirmarExcluir(false)

    setItens(itens.filter(item => item.id_item !== itemParaExcluir))

    const { error } = await supabase
      .from("estoque")
      .delete()
      .eq("id_item",itemParaExcluir)

    if(error){
      console.error(error)
      setMensagem("Erro ao excluir item.")
    }

    setItemParaExcluir(null)
  }

  async function salvar(item){

    if(!item.nome_item.trim()){
      setMensagem("O nome do item não pode estar vazio.")
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

    if(error){
      console.error(error)
      setMensagem("Erro ao atualizar item.")
    }else{
      setMensagem("Item atualizado com sucesso!")
    }
  }

  function alterarCampo(id,campo,valor){

    setItens(itens.map(item =>
      item.id_item === id
        ? {...item,[campo]:valor}
        : item
    ))
  }

  function ordenar(){

    const nova = [...itens].sort((a,b)=>
      ordem === "asc"
        ? a.nome_item.localeCompare(b.nome_item)
        : b.nome_item.localeCompare(a.nome_item)
    )

    setItens(nova)

    setOrdem(ordem === "asc" ? "desc" : "asc")
  }

  const itensFiltrados = itens.filter(item =>
    item.nome_item.toLowerCase().includes(busca.toLowerCase())
  )

  return(

    <>
      <Navbaradm/>

      <div className="container mt-4">

        <h3 className="mb-4">ESTOQUE – BF TAPEÇARIA</h3>

        {mensagem && (
          <div className="alert alert-info alert-dismissible fade show" role="alert">

            {mensagem}

            <button
              type="button"
              className="btn-close"
              onClick={() => setMensagem(null)}
            ></button>

          </div>
        )}

        <form onSubmit={adicionarItem} className="mb-5">

          <div className="mb-3" style={{maxWidth:"300px"}}>
            <input
              className="form-control"
              placeholder="Nome do item"
              value={nome}
              onChange={(e)=>setNome(e.target.value)}
            />
          </div>

          <div className="mb-3" style={{maxWidth:"300px"}}>
            <textarea
              className="form-control"
              placeholder="Descrição do item"
              value={descricao}
              onChange={(e)=>setDescricao(e.target.value)}
            />
          </div>

          <div className="mb-3">

            <label className="me-3">
              <input
                type="radio"
                checked={tem === true}
                onChange={()=>setTem(true)}
              /> Tem
            </label>

            <label>
              <input
                type="radio"
                checked={tem === false}
                onChange={()=>setTem(false)}
              /> Não tem
            </label>

          </div>

          <button className="btn btn-warning fw-bold">
            Adicionar Item
          </button>

        </form>

        <input
          className="form-control mb-3"
          placeholder="Buscar item..."
          value={busca}
          onChange={(e)=>setBusca(e.target.value)}
        />

        <p className="text-muted">
          Total de itens: {itensFiltrados.length}
        </p>

        <table className="table">

          <thead>

            <tr>
              <th>ID</th>
              <th onClick={ordenar} style={{cursor:"pointer"}}>
                Nome
              </th>
              <th>Descrição</th>
              <th>Status</th>
              <th></th>
            </tr>

          </thead>

          <tbody>

            {itensFiltrados.map(item=>{

              const editandoLinha = editando === item.id_item

              return(

                <tr
                  key={item.id_item}
                  className={editandoLinha ? "linha-editando" : ""}
                >

                  <td>{item.id_item}</td>

                  <td>

                    {editandoLinha ? (

                      <input
                        autoFocus
                        value={item.nome_item}
                        onChange={(e)=>
                          alterarCampo(item.id_item,"nome_item",e.target.value)
                        }
                      />

                    ) : item.nome_item}

                  </td>

                  <td>

                    {editandoLinha ? (

                      <input
                        value={item.descricao_item}
                        onChange={(e)=>
                          alterarCampo(item.id_item,"descricao_item",e.target.value)
                        }
                      />

                    ) : item.descricao_item}

                  </td>

                  <td>

                    {editandoLinha ? (

                      <select
                        value={item.tem_nao_tem_item ? "true" : "false"}
                        onChange={(e)=>
                          alterarCampo(
                            item.id_item,
                            "tem_nao_tem_item",
                            e.target.value === "true"
                          )
                        }
                      >

                        <option value="true">Tem</option>
                        <option value="false">Não tem</option>

                      </select>

                    ) : (

                      item.tem_nao_tem_item
                        ? <span className="badge bg-success">Tem</span>
                        : <span className="badge bg-danger">Não tem</span>

                    )}

                  </td>

                  <td>

                    {editandoLinha ? (

                      <button
                        className="btn btn-success btn-sm"
                        onClick={()=>salvar(item)}
                      >
                        Salvar
                      </button>

                    ) : (

                      <div className="d-flex gap-2">

                        <button
                          className="btn btn-warning btn-sm botao-editar"
                          onClick={()=>setEditando(item.id_item)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={()=>pedirExclusao(item.id_item)}
                        >
                          Excluir
                        </button>

                      </div>

                    )}

                  </td>

                </tr>

              )

            })}

          </tbody>

        </table>

      </div>

      {confirmarExcluir && (

        <div className="form-overlay">

          <div className="form-popup">

            <h2>Tem certeza que deseja excluir?</h2>

            <div style={{display:"flex",gap:"20px",justifyContent:"center",marginTop:"30px"}}>

              <button onClick={confirmarExclusao}>
                SIM
              </button>

              <button onClick={()=>setConfirmarExcluir(false)}>
                NÃO
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  )
}