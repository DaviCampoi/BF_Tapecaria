import { useState, useEffect } from "react"
import Navbaradm from "../components/Navbaradm"
import { supabase } from "../supabaseClient"

export default function Estoque() {
    const [itens, setItens] = useState([])
    const [nome, setNome] = useState("")
    const [descricao, setDescricao] = useState("")
    const [tem, setTem] = useState(true)
    const [busca, setBusca] = useState("")
    const [ordemCampo, setOrdemCampo] = useState("id")
    const [ordemDirecao, setOrdemDirecao] = useState("asc")
    const [exibirSucesso, setExibirSucesso] = useState(false)
    const [mensagemSucesso, setMensagemSucesso] = useState("")
    const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false)
    const [itemParaExcluir, setItemParaExcluir] = useState(null)
    const [mostrarAvisoNome, setMostrarAvisoNome] = useState(false)

    useEffect(() => { buscarItens() }, [])

    async function buscarItens() {
        const { data } = await supabase.from("estoque").select("*")
        setItens(data || [])
    }

    async function adicionarItem(e) {
        e.preventDefault()
        if (!nome.trim()) { setMostrarAvisoNome(true); return }
        const maiorCodigo = itens.length > 0 ? Math.max(...itens.map(i => i.codigo_item || 0)) : 0
        const { data, error } = await supabase.from("estoque").insert({
            codigo_item: maiorCodigo + 1,
            nome_item: nome.trim(),
            descricao_item: descricao.trim(),
            tem_nao_tem_item: tem
        }).select()
        if (!error) {
            setItens([...itens, ...data]); setNome(""); setDescricao(""); setTem(true)
            setMensagemSucesso("Item catalogado!"); setExibirSucesso(true)
        }
    }

    function ordenarPor(campo) {
        if (ordemCampo === campo) { setOrdemDirecao(ordemDirecao === "asc" ? "desc" : "asc") }
        else { setOrdemCampo(campo); setOrdemDirecao("asc") }
    }

    const itensFiltrados = itens
        .filter(item => item.nome_item?.toLowerCase().includes(busca.toLowerCase()))
        .sort((a, b) => {
            if (ordemCampo === "nome") return ordemDirecao === "asc" ? a.nome_item.localeCompare(b.nome_item) : b.nome_item.localeCompare(a.nome_item)
            return ordemDirecao === "asc" ? a.codigo_item - b.codigo_item : b.codigo_item - a.codigo_item
        })

    return (
        <>
            <Navbaradm />
            <div className="container mt-4">
                <h3 className="mb-3 text-center fw-bold">ESTOQUE – BF TAPEÇARIA</h3>

                <form onSubmit={adicionarItem} className="mb-3 p-3 border rounded bg-light">
                    <input className="form-control form-control-sm mb-2" placeholder="Nome do item" value={nome} onChange={(e) => setNome(e.target.value)} />
                    <textarea className="form-control form-control-sm mb-2" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                    <div className="mb-2">
                        <label className="me-3"><input type="radio" checked={tem === true} onChange={() => setTem(true)} /> Tem</label>
                        <label><input type="radio" checked={tem === false} onChange={() => setTem(false)} /> Não tem</label>
                    </div>
                    <button className="btn btn-warning btn-sm text-white w-100 fw-bold">Adicionar Material</button>
                </form>

                <input className="form-control form-control-sm mb-3" placeholder="🔍 Buscar item..." value={busca} onChange={(e) => setBusca(e.target.value)} />

                <div className="table-responsive">
                    <table className="table table-hover border-bottom tabela-ajustada">
                        <thead className="table-dark">
                            <tr>
                                <th className="text-center" onClick={() => ordenarPor("id")} style={{ cursor: "pointer" }}>ID</th>
                                <th className="text-center" onClick={() => ordenarPor("status")} style={{ cursor: "pointer" }}>Status</th>
                                <th className="col-nome" onClick={() => ordenarPor("nome")} style={{ cursor: "pointer" }}>Nome</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itensFiltrados.map((item) => (
                                <tr key={item.id_item}>
                                    <td className="text-center align-middle">{item.codigo_item}</td>
                                    <td className="text-center align-middle">
                                        {item.tem_nao_tem_item ? <span className="badge bg-success">Tem</span> : <span className="badge bg-danger">Não</span>}
                                    </td>
                                    <td className="col-nome align-middle">
                                        <strong>{item.nome_item}</strong>
                                        <div style={{ fontSize: "11px", color: "#666" }}>{item.descricao_item}</div>
                                    </td>
                                    <td className="align-middle">
                                        <div className="d-flex gap-1 justify-content-center">
                                            <button className="btn btn-warning btn-sm text-white">Editar</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => { setItemParaExcluir(item.id_item); setMostrarModalExcluir(true) }}>Excluir</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modais de Sucesso e Erro aqui embaixo... */}
        </>
    )
}