import Navbaradm from "../components/Navbaradm";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";

export default function Estoque() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [temNaoTem, setTemNaoTem] = useState(true);
  const [itens, setItens] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [nomeExistente, setNomeExistente] = useState(false);

  useEffect(() => {
    buscarItens();
  }, []);

  async function buscarItens() {
    const { data, error } = await supabase
      .from("estoque")
      .select("id_item, nome_item, descricao_item, tem_nao_tem_item")
      .order("id_item", { ascending: true });

    if (error) {
      console.log("Erro ao buscar itens:", error);
      return;
    }
    setItens(data);
  }

  async function checarNomeExistente(nomeDigitado) {
    setNome(nomeDigitado);
    if (!nomeDigitado.trim()) {
      setNomeExistente(false);
      setDescricao("");
      setTemNaoTem(true);
      return;
    }

    const { data, error } = await supabase
      .from("estoque")
      .select("id_item, descricao_item, tem_nao_tem_item")
      .eq("nome_item", nomeDigitado.trim())
      .single();

    if (error || !data) {
      setNomeExistente(false);
      setDescricao("");
      setTemNaoTem(true);
      return;
    }

    setNomeExistente(true);
    setDescricao(data.descricao_item || "");
    setTemNaoTem(data.tem_nao_tem_item);
    setEditandoId(data.id_item);
  }

  async function salvarItem(e) {
    e.preventDefault();
    if (!nome.trim()) return;

    if (nomeExistente && editandoId) {
      // Atualiza no banco
      const { error } = await supabase
        .from("estoque")
        .update({
          descricao_item: descricao,
          tem_nao_tem_item: temNaoTem,
        })
        .eq("id_item", editandoId);

      if (error) {
        console.log("Erro ao atualizar item:", error);
        return;
      }

      // Atualiza instantaneamente no estado local
      setItens((prev) =>
        prev.map((i) =>
          i.id_item === editandoId
            ? { ...i, descricao_item: descricao, tem_nao_tem_item: temNaoTem }
            : i
        )
      );
    } else {
      // Insere novo item
      const { data, error } = await supabase.from("estoque").insert([
        {
          nome_item: nome.trim(),
          descricao_item: descricao,
          tem_nao_tem_item: temNaoTem,
        },
      ]).select();

      if (error) {
        console.log("Erro ao adicionar item:", error);
        return;
      }

      // Adiciona item novo no estado local
      setItens((prev) => [...prev, ...data]);
    }

    // Limpa formulário
    setNome("");
    setDescricao("");
    setTemNaoTem(true);
    setNomeExistente(false);
    setEditandoId(null);
  }

  async function excluirItem(id) {
    const { error } = await supabase.from("estoque").delete().eq("id_item", id);

    if (!error) {
      setItens((prev) => prev.filter((i) => i.id_item !== id));
    }
  }

  function iniciarEdicao(item) {
    setEditandoId(item.id_item);
    setNome(item.nome_item);
    setDescricao(item.descricao_item || "");
    setTemNaoTem(item.tem_nao_tem_item);
    setNomeExistente(true);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNome("");
    setDescricao("");
    setTemNaoTem(true);
    setNomeExistente(false);
  }

  // Alternar entre Tem e Não Tem
  function toggleTemNaoTem(valor) {
    setTemNaoTem(valor);
  }

  return (
    <>
      <Navbaradm />

      <div className="container mt-5">
        <h3 className="mb-4">ESTOQUE – BF TAPEÇARIA</h3>

        <h6 className="mb-3">{editandoId ? "EDITAR ITEM" : "ADICIONAR ITEM"}</h6>

        <form onSubmit={salvarItem} className="mb-5">
          <div className="mb-3" style={{ maxWidth: "300px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Nome do item"
              value={nome}
              onChange={(e) => checarNomeExistente(e.target.value)}
              required
              disabled={!!editandoId}
            />
          </div>

          {(!nomeExistente || editandoId) && (
            <div className="mb-3" style={{ maxWidth: "300px" }}>
              <textarea
                className="form-control"
                placeholder="Descrição do item"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          )}

          {/* Checkbox Tem / Não Tem */}
          <div className="mb-3" style={{ maxWidth: "300px", display: "flex", gap: "15px" }}>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="temCheck"
                checked={temNaoTem === true}
                onChange={() => toggleTemNaoTem(true)}
              />
              <label className="form-check-label" htmlFor="temCheck">
                Tem
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="naoTemCheck"
                checked={temNaoTem === false}
                onChange={() => toggleTemNaoTem(false)}
              />
              <label className="form-check-label" htmlFor="naoTemCheck">
                Não Tem
              </label>
            </div>
          </div>

          <button className="btn btn-warning fw-bold" type="submit">
            {editandoId ? "Salvar Alterações" : "Adicionar Item"}
          </button>
          {editandoId && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={cancelarEdicao}
            >
              Cancelar
            </button>
          )}
        </form>

        <h5 className="text-warning mb-3">LISTA</h5>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Tem / Não Tem</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {itens.map((item) => (
              <tr key={item.id_item}>
                <td>{item.id_item}</td>
                <td>{item.nome_item}</td>
                <td>{item.descricao_item || "-"}</td>
                <td>
  <span
    style={{
      backgroundColor: item.tem_nao_tem_item ? "#28a745" : "#dc3545",
      color: "white",
      padding: "6px 14px",
      borderRadius: "6px",
      fontWeight: "600",
      fontSize: "14px",
      display: "inline-block",
      minWidth: "80px",
      textAlign: "center",
    }}
  >
    {item.tem_nao_tem_item ? "Tem" : "Não Tem"}
  </span>
</td>
                <td className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-warning btn-sm"
                    onClick={() => iniciarEdicao(item)}
                  >
                    <img src={editIcon} width="16" alt="Editar" />
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => excluirItem(item.id_item)}
                  >
                    <img src={deleteIcon} width="16" alt="Excluir" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}