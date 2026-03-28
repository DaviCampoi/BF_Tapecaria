import { useState, useEffect } from "react" // Importa os hooks do React para estado e efeitos
import Navbaradm from "../components/Navbaradm" // Importa sua barra de navegação
import { supabase } from "../supabaseClient" // Importa a configuração do banco de dados Supabase

export default function Estoque(){ // Define a função principal da página de Estoque

const [itens,setItens] = useState([]) // Estado que armazena a lista de itens do estoque
const [nome,setNome] = useState("") // Estado para o input do nome do novo item
const [descricao,setDescricao] = useState("") // Estado para o input da descrição do novo item
const [tem,setTem] = useState(true) // Estado para o rádio (Tem/Não tem)

const [editando,setEditando] = useState(null) // Armazena o ID do item que está sendo editado na linha
const [busca,setBusca] = useState("") // Estado para o campo de pesquisa/busca

const [ordemCampo,setOrdemCampo] = useState("id") // Define por qual coluna a tabela será ordenada
const [ordemDirecao,setOrdemDirecao] = useState("asc") // Define se a ordem é crescente ou decrescente

// ESTADOS PARA OS NOVOS MODAIS VISUAIS
const [exibirSucesso, setExibirSucesso] = useState(false) // Controla a visibilidade do selo verde de sucesso
const [mensagemSucesso, setMensagemSucesso] = useState("") // Define o texto que aparece dentro do selo verde
const [mostrarModalExcluir,setMostrarModalExcluir] = useState(false) // Controla o modal de confirmação de exclusão
const [itemParaExcluir,setItemParaExcluir] = useState(null) // Guarda o ID do item que o usuário clicou para apagar

useEffect(() => { // Executa quando a página abre
    buscarItens() // Chama a função para carregar os dados
}, [])

async function buscarItens(){ // Função que busca os dados no Supabase
    const { data } = await supabase.from("estoque").select("*") // Seleciona tudo da tabela 'estoque'
    setItens(data || []) // Atualiza o estado com os dados recebidos
}

async function adicionarItem(e){ // Função para cadastrar um novo item
    e.preventDefault() // Previne que a página recarregue ao enviar o formulário

    if(!nome.trim()){ // Verifica se o nome está vazio
        alert("O nome é obrigatório") // Alerta simples caso falte o nome
        return
    }

    const maiorCodigo = itens.length > 0 // Verifica se já existem itens na lista
    ? Math.max(...itens.map(item => item.codigo_item || 0)) // Pega o maior código existente
    : 0

    const novoCodigo = maiorCodigo + 1 // Gera o próximo código sequencial

    const { data, error } = await supabase // Tenta inserir no banco de dados
    .from("estoque")
    .insert({
        codigo_item: novoCodigo,
        nome_item: nome.trim(),
        descricao_item: descricao.trim(),
        tem_nao_tem_item: tem
    })
    .select()

    if(error){ // Se houver erro no banco
        console.error(error) 
        return
    }

    setItens([...itens, ...data]) // Adiciona o novo item na lista da tela sem recarregar
    setNome(""); setDescricao(""); setTem(true) // Limpa os campos do formulário
    setMensagemSucesso("Item catalogado com sucesso!") // Define a mensagem do selo
    setExibirSucesso(true) // Abre o modal do selo verde
}

async function salvar(item){ // Função para salvar as alterações de uma edição

    if(!item.nome_item.trim()){ // Valida se o nome não ficou vazio na edição
        return
    }

    setEditando(null) // Fecha o modo de edição na linha da tabela

    const { error } = await supabase // Atualiza os dados no Supabase
    .from("estoque")
    .update({
        nome_item:item.nome_item.trim(),
        descricao_item:item.descricao_item.trim(),
        tem_nao_tem_item:item.tem_nao_tem_item
    })
    .eq("id_item",item.id_item)

    if(!error){ // Se salvou corretamente
        setMensagemSucesso("Item atualizado com sucesso!") // Define mensagem
        setExibirSucesso(true) // Mostra o selo verde
    }
}

function alterarCampo(id,campo,valor){ // Atualiza os dados no estado enquanto o usuário digita na edição
    setItens(itens.map(item =>
        item.id_item === id ? {...item,[campo]:valor} : item
    ))
}

function ordenarPor(campo){ // Altera a lógica de ordenação da tabela
    if(ordemCampo === campo){
        setOrdemDirecao(ordemDirecao === "asc" ? "desc" : "asc") // Inverte a direção se clicar na mesma coluna
    }else{
        setOrdemCampo(campo) // Define a nova coluna de ordenação
        setOrdemDirecao("asc") // Começa como crescente
    }
}

function pedirExclusao(id){ // Prepara o terreno para excluir
    setItemParaExcluir(id) // Salva o ID do alvo
    setMostrarModalExcluir(true) // Abre o modal de confirmação (Alerta Vermelho)
}

async function confirmarExclusao(){ // Executa a exclusão definitiva
    setMostrarModalExcluir(false) // Fecha o modal de alerta
    
    setItens(itens.filter(item => item.id_item !== itemParaExcluir)) // Remove da tela imediatamente

    const { error } = await supabase // Remove do banco de dados
    .from("estoque")
    .delete()
    .eq("id_item", itemParaExcluir)

    if(!error){
        setMensagemSucesso("Item excluído com sucesso!") // Prepara mensagem
        setExibirSucesso(true) // Mostra o selo verde confirmando a ação
    }
    setItemParaExcluir(null) // Limpa a referência do item
}

const itensFiltrados = itens // Lógica de filtro e ordenação da lista
.filter(item => item.nome_item?.toLowerCase().includes(busca.toLowerCase())) // Filtra pelo que foi digitado na busca
.sort((a, b) => { // Ordena os resultados
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
<>
<Navbaradm/> {/* Renderiza sua barra de navegação */}

<div className="container mt-4"> {/* Container Bootstrap para centralizar conteúdo */}

<h3 className="mb-3 text-center fw-bold">ESTOQUE – BF TAPEÇARIA</h3> {/* Título da página */}

<form onSubmit={adicionarItem} className="mb-3 p-3 border rounded bg-light"> {/* Formulário de cadastro com fundo cinza claro */}
    <input className="form-control form-control-sm mb-2" placeholder="Nome do item" value={nome} onChange={(e)=>setNome(e.target.value)} />
    <textarea className="form-control form-control-sm mb-2" placeholder="Descrição" value={descricao} onChange={(e)=>setDescricao(e.target.value)} />
    <div className="mb-2">
        <label className="me-3"><input type="radio" checked={tem === true} onChange={()=>setTem(true)} /> Tem</label>
        <label><input type="radio" checked={tem === false} onChange={()=>setTem(false)} /> Não tem</label>
    </div>
    <button className="btn btn-warning btn-sm text-white w-100 fw-bold">Adicionar Material</button>
</form>

<input className="form-control form-control-sm mb-3" placeholder="🔍 Buscar item no estoque..." value={busca} onChange={(e)=>setBusca(e.target.value)} />

<table className="table table-sm table-hover" style={{tableLayout:"fixed"}}> {/* Início da tabela de exibição */}
    <thead className="table-dark"> {/* Cabeçalho escuro */}
        <tr>
            <th style={{width:"60px", textAlign:"center", cursor:"pointer"}} onClick={()=>ordenarPor("id")}>ID</th>
            <th style={{width:"90px", textAlign:"center", cursor:"pointer"}} onClick={()=>ordenarPor("status")}>Status</th>
            <th style={{cursor:"pointer"}} onClick={()=>ordenarPor("nome")}>Nome</th>
            <th style={{width:"120px", textAlign:"center"}}>Ações</th>
        </tr>
    </thead>
    <tbody>
        {itensFiltrados.map((item)=>{ // Início do mapeamento dos itens para as linhas da tabela
            const editandoLinha = editando === item.id_item // Verifica se esta linha específica está sendo editada
            return(
                <tr key={item.id_item}>
                    <td style={{textAlign:"center", verticalAlign:"middle"}}>{item.codigo_item}</td>
                    <td style={{textAlign:"center", verticalAlign:"middle"}}>
                        {editandoLinha ? (
                            <select value={item.tem_nao_tem_item ? "tem" : "nao"} onChange={(e)=>alterarCampo(item.id_item,"tem_nao_tem_item", e.target.value === "tem")} className="form-select form-select-sm">
                                <option value="tem">Tem</option><option value="nao">Não</option>
                            </select>
                        ) : (
                            item.tem_nao_tem_item ? <span className="badge bg-success">Tem</span> : <span className="badge bg-danger">Não</span>
                        )}
                    </td>
                    <td style={{verticalAlign:"middle"}}>
                        {editandoLinha ? (
                            <><input value={item.nome_item} onChange={(e)=>alterarCampo(item.id_item,"nome_item",e.target.value)} className="form-control form-control-sm mb-1" />
                            <input value={item.descricao_item} onChange={(e)=>alterarCampo(item.id_item,"descricao_item",e.target.value)} className="form-control form-control-sm" /></>
                        ) : (
                            <div><strong>{item.nome_item}</strong><div style={{fontSize:"12px", color:"#666"}}>{item.descricao_item}</div></div>
                        )}
                    </td>
                    <td style={{textAlign:"center", verticalAlign:"middle"}}>
                        {editandoLinha ? (
                            <button className="btn btn-success btn-sm w-100" onClick={()=>salvar(item)}>Salvar</button>
                        ) : (
                            <div className="d-flex justify-content-center gap-1">
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

{/* MODAL DE SUCESSO (SELO VERDE IGUAL AO CALENDÁRIO) */}
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

{/* MODAL DE EXCLUIR (ALERTA VERMELHO IGUAL AO CALENDÁRIO) */}
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
</>
)
}