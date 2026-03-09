import Navbaradm from "../components/Navbaradm"
import { useState } from "react"

import editIcon from "../assets/edit.png"
import deleteIcon from "../assets/delete.png"

export default function Clientes() {

 const [clientes, setClientes] = useState([
    {
      nome: "Davi",
      placa: "KIR-3601",
      numero: "11886364762",
      foto: "https://m.media-amazon.com/images/I/example.jpg"
    },
 ])

 function excluirCliente(index) {

    const novaLista = clientes.filter((_, i) => i !== index)

    setClientes(novaLista)
 }

 function editarCliente(index) {

    const novoNome = prompt("Digite o novo nome:")

    if(!novoNome) return

    const novaLista = [...clientes]

    novaLista[index].nome = novoNome

    setClientes(novaLista)
 }

 function criarCliente(){

  const nome = prompt("Nome do cliente")
  const placa = prompt("Placa do veículo")
  const numero = prompt("Telefone")

  const novo = {
    nome,
    placa,
    numero,
  }

  setClientes([...clientes, novo])
 }

  return (
    <>
      <Navbaradm />

      <div className="container mt-5">

        <h3 className="mb-4">CADASTRO – BF TAPEÇARIA</h3>

        <div className="d-flex gap-3 mb-4">

          <input
            type="text"
            className="form-control"
            placeholder="Procurar pela placa do veículo:"
            style={{maxWidth:"300px"}}
          />

          <button className="btn btn-warning fw-bold">
            BUSCAR
          </button>

          <button
            className="btn btn-warning fw-bold"
            onClick={criarCliente}
          >
            CRIAR NOVO REGISTRO
          </button>

        </div>

        <table className="table">

          <thead>
            <tr>
              <th>Nome</th>
              <th>Placa do veículo</th>
              <th>Número</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {clientes.map((cliente, index) => (

              <tr key={index}>

                <td>{cliente.nome}</td>
                <td>{cliente.placa}</td>
                <td>{cliente.numero}</td>

                <td className="d-flex gap-2">

                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => editarCliente(index)}
                  >
                    <img src={editIcon} alt="editar" width="16"/>
                  </button>

                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => excluirCliente(index)}
                  >
                    <img src={deleteIcon} alt="excluir" width="16"/>
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </>
  )
}