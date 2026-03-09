import Navbaradm from "../components/Navbaradm"
import { useState } from "react"

import editIcon from "../assets/edit.png"
import deleteIcon from "../assets/delete.png"

export default function Estoque() {

  const [nome, setNome] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [editando, setEditando] = useState(null)

  const [itens, setItens] = useState([
    { nome: "Tecido", entrada: 56, saida: 6 },
    { nome: "Lã", entrada: 21, saida: 10 }
  ])

  function adicionarItem(e){
    e.preventDefault()

    if(!nome || !quantidade) return

    const quantidadeNumero = Number(quantidade)

    const novaLista = [...itens]

    const indexExistente = novaLista.findIndex(
      item => item.nome.toLowerCase().trim() === nome.toLowerCase().trim()
    )

    if(indexExistente !== -1){

      novaLista[indexExistente].entrada =
        Number(novaLista[indexExistente].entrada) + quantidadeNumero

    } else {

      const novo = {
        nome: nome.trim(),
        entrada: quantidadeNumero,
        saida: 0
      }

      novaLista.push(novo)
    }

    setItens(novaLista)

    setNome("")
    setQuantidade("")
  }

  function excluirItem(index){

    const novaLista = itens.filter((_,i)=> i !== index)

    setItens(novaLista)
  }

  function alterarSaida(index, valor){

    const numero = valor === "" ? "" : Number(valor)

    const novaLista = [...itens]

    if(numero > novaLista[index].entrada) return

    novaLista[index].saida = numero

    setItens(novaLista)
  }

  function alterarEntrada(index, valor){

    const numero = valor === "" ? "" : Number(valor)

    const novaLista = [...itens]

    if(numero < novaLista[index].saida) return

    novaLista[index].entrada = numero

    setItens(novaLista)
  }

  function fecharEdicao(){
    setEditando(null)
  }

  return (
    <>
      <Navbaradm />

      <div className="container mt-5">

        <h3 className="mb-4">ESTOQUE – BF TAPEÇARIA</h3>

        <h6 className="mb-3">ADICIONAR ITENS</h6>

        <form onSubmit={adicionarItem} className="mb-5">

          <div className="mb-3" style={{maxWidth:"300px"}}>
            <input
              type="text"
              className="form-control"
              placeholder="Nome"
              value={nome}
              onChange={(e)=>setNome(e.target.value)}
            />
          </div>

          <div className="mb-3" style={{maxWidth:"300px"}}>
            <input
              type="number"
              className="form-control"
              placeholder="Quantidade"
              value={quantidade}
              onChange={(e)=>setQuantidade(e.target.value)}
              onKeyDown={(e)=>["e","E","+","-"].includes(e.key) && e.preventDefault()}
            />
          </div>

          <button className="btn btn-warning fw-bold">
            ENVIAR
          </button>

        </form>

        <h5 className="text-warning mb-3">LISTA</h5>

        <table className="table">

          <thead>
            <tr>
              <th>Produto</th>
              <th>Entrada</th>
              <th>Saída</th>
              <th>Estoque Final</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {itens.map((item,index)=>{

              const estoqueFinal =
                (Number(item.entrada) || 0) - (Number(item.saida) || 0)

              return(

                <tr key={index}>

                  <td>{item.nome}</td>

                  <td>
                    {editando === index ? (
                      <input
                        type="number"
                        value={item.entrada}
                        onChange={(e)=>alterarEntrada(index,e.target.value)}
                        onBlur={fecharEdicao}
                        onKeyDown={(e)=>["e","E","+","-"].includes(e.key) && e.preventDefault()}
                        style={{width:"80px"}}
                        autoFocus
                      />
                    ) : (
                      item.entrada
                    )}
                  </td>

                  <td>
                    {editando === index ? (
                      <input
                        type="number"
                        value={item.saida}
                        onChange={(e)=>alterarSaida(index,e.target.value)}
                        onBlur={fecharEdicao}
                        onKeyDown={(e)=>["e","E","+","-"].includes(e.key) && e.preventDefault()}
                        style={{width:"80px"}}
                      />
                    ) : (
                      item.saida
                    )}
                  </td>

                  <td>{estoqueFinal}</td>

                  <td className="d-flex gap-2">

                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={()=>setEditando(index)}
                    >
                      <img src={editIcon} width="16"/>
                    </button>

                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={()=>excluirItem(index)}
                    >
                      <img src={deleteIcon} width="16"/>
                    </button>

                  </td>

                </tr>

              )

            })}

          </tbody>

        </table>

      </div>
    </>
  )
}