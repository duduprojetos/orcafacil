/* eslint-disable react-hooks/immutability, react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Header from "../components/Header";

export default function Orcamentos() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [orcamentos, setOrcamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [menuAbertoId, setMenuAbertoId] = useState(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    verificarLoginEBuscar();
  }, []);

  async function verificarLoginEBuscar() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setUsuario(user);
    buscarOrcamentos();
  }

  async function buscarOrcamentos() {
    setCarregando(true);
    const { data, error } = await supabase
      .from("orcamentos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar:", error);
    } else {
      setOrcamentos(data);
    }
    setCarregando(false);
  }

  async function deletarOrcamento(id) {
    const confirmar = confirm("Tem certeza que deseja deletar?");
    if (!confirmar) return;

    const { error } = await supabase
      .from("orcamentos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao deletar: " + error.message);
    } else {
      setOrcamentos(orcamentos.filter((o) => o.id !== id));
    }
  }

  async function alterarStatus(id, novoStatus) {
    const { error } = await supabase
      .from("orcamentos")
      .update({ status: novoStatus })
      .eq("id", id);

    if (error) {
      alert("Erro ao alterar status: " + error.message);
      return;
    }

    setOrcamentos(orcamentos.map((o) =>
      o.id === id ? { ...o, status: novoStatus } : o
    ));
    setMenuAbertoId(null);
  }

  async function duplicarOrcamento(orcamento) {
    const confirmar = confirm(`Duplicar o orçamento de "${orcamento.cliente}"?`);
    if (!confirmar) return;

    const novoOrcamento = {
      empresa: orcamento.empresa,
      telefone: orcamento.telefone,
      cliente: orcamento.cliente + " (cópia)",
      email: orcamento.email,
      cliente_telefone: orcamento.cliente_telefone,
      cliente_documento: orcamento.cliente_documento,
      cliente_endereco: orcamento.cliente_endereco,
      itens: orcamento.itens,
      total: orcamento.total,
      observacoes: orcamento.observacoes,
      validade: orcamento.validade,
      desconto_tipo: orcamento.desconto_tipo,
      desconto_valor: orcamento.desconto_valor,
      user_id: usuario.id,
      status: "pendente"
    };

    // Busca próximo número
    const { data: numData } = await supabase.rpc("proximo_numero_orcamento", { uid: usuario.id });
    if (numData) novoOrcamento.numero_orcamento = numData;

    const { data, error } = await supabase
      .from("orcamentos")
      .insert([novoOrcamento])
      .select();

    if (error) {
      alert("Erro ao duplicar: " + error.message);
      return;
    }

    if (data && data.length > 0) {
      setOrcamentos([data[0], ...orcamentos]);
    }
  }

  function editarOrcamento(id) {
    router.push(`/app?editar=${id}`);
  }

  function formatarData(dataStr) {
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  const statusConfig = {
    pendente: {
      cor: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icone: "🟡",
      label: "Pendente"
    },
    aprovado: {
      cor: "bg-green-100 text-green-800 border-green-300",
      icone: "✅",
      label: "Aprovado"
    },
    recusado: {
      cor: "bg-red-100 text-red-800 border-red-300",
      icone: "❌",
      label: "Recusado"
    }
  };

  const orcamentosFiltrados = orcamentos.filter((o) => {
    const statusOk = filtroStatus === "todos" || (o.status || "pendente") === filtroStatus;

    const buscaLower = busca.toLowerCase().trim();
    const buscaOk = buscaLower === "" ||
      (o.cliente || "").toLowerCase().includes(buscaLower) ||
      (o.empresa || "").toLowerCase().includes(buscaLower) ||
      (o.email || "").toLowerCase().includes(buscaLower);

    return statusOk && buscaOk;
  });

  const contadores = {
    todos: orcamentos.length,
    pendente: orcamentos.filter((o) => (o.status || "pendente") === "pendente").length,
    aprovado: orcamentos.filter((o) => o.status === "aprovado").length,
    recusado: orcamentos.filter((o) => o.status === "recusado").length,
  };

  return (
    <div className="app-shell">
      <div className="max-w-4xl mx-auto">

        <Header usuario={usuario} paginaAtiva="orcamentos" />

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="app-title text-4xl font-semibold">Meus Orçamentos</h1>
            <p className="text-gray-500 mt-1">Histórico de orçamentos gerados</p>
          </div>
          <Link href="/app" className="btn-primary px-4 py-2">
            + Novo Orçamento
          </Link>
        </div>

        {/* Barra de busca */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="🔍 Buscar por cliente, empresa ou e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          {busca && (
            <button
              onClick={() => setBusca("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtros por status */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFiltroStatus("todos")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filtroStatus === "todos"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Todos ({contadores.todos})
          </button>
          <button
            onClick={() => setFiltroStatus("pendente")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filtroStatus === "pendente"
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            🟡 Pendentes ({contadores.pendente})
          </button>
          <button
            onClick={() => setFiltroStatus("aprovado")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filtroStatus === "aprovado"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            ✅ Aprovados ({contadores.aprovado})
          </button>
          <button
            onClick={() => setFiltroStatus("recusado")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filtroStatus === "recusado"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            ❌ Recusados ({contadores.recusado})
          </button>
        </div>

        {carregando && (
          <div className="app-card p-8 text-center text-gray-500">
            Carregando...
          </div>
        )}

        {!carregando && orcamentos.length === 0 && (
          <div className="app-card p-8 text-center text-gray-500">
            <p className="mb-4">Você ainda não criou nenhum orçamento.</p>
            <Link href="/app" className="inline-block bg-black hover:bg-zinc-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Criar primeiro orçamento
            </Link>
          </div>
        )}

        {!carregando && orcamentos.length > 0 && orcamentosFiltrados.length === 0 && (
          <div className="app-card p-8 text-center text-gray-500">
            {busca
              ? `Nenhum orçamento encontrado para "${busca}"`
              : "Nenhum orçamento com esse status."}
          </div>
        )}

        {!carregando && orcamentosFiltrados.length > 0 && (
          <div className="space-y-3">
            {orcamentosFiltrados.map((orc) => {
              const statusAtual = orc.status || "pendente";
              const config = statusConfig[statusAtual];

              return (
                <div key={orc.id} className="app-card p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          #{String(orc.numero_orcamento || 0).padStart(4, "0")}
                        </span>
                        <span className="text-xs text-gray-400">{formatarData(orc.created_at)}</span>

                        <div className="relative">
                          <button
                            onClick={() => setMenuAbertoId(menuAbertoId === orc.id ? null : orc.id)}
                            className={`text-xs font-medium px-3 py-1 rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${config.cor}`}
                          >
                            {config.icone} {config.label} ▼
                          </button>

                          {menuAbertoId === orc.id && (
                            <div className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10 min-w-[140px]">
                              <button
                                onClick={() => alterarStatus(orc.id, "pendente")}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-yellow-50 flex items-center gap-2"
                              >
                                🟡 Pendente
                              </button>
                              <button
                                onClick={() => alterarStatus(orc.id, "aprovado")}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-green-50 flex items-center gap-2"
                              >
                                ✅ Aprovado
                              </button>
                              <button
                                onClick={() => alterarStatus(orc.id, "recusado")}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 flex items-center gap-2"
                              >
                                ❌ Recusado
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{orc.cliente}</p>
                      <p className="text-sm text-gray-500">De: {orc.empresa}</p>
                    </div>

                    <div className="text-right md:mr-4">
                      <p className="text-2xl font-bold text-black">R$ {Number(orc.total).toFixed(2)}</p>
                      <p className="text-xs text-gray-400">
                        {orc.itens?.length || 0} {orc.itens?.length === 1 ? "item" : "itens"}
                      </p>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto flex-wrap">
                      <button
                        onClick={() => duplicarOrcamento(orc)}
                        className="flex-1 md:flex-none text-purple-600 hover:text-white hover:bg-purple-600 border border-purple-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        📋 Duplicar
                      </button>
                      <button
                        onClick={() => editarOrcamento(orc.id)}
                        className="flex-1 md:flex-none text-black hover:text-white hover:bg-black border border-black text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => deletarOrcamento(orc.id)}
                        className="flex-1 md:flex-none text-red-600 hover:text-white hover:bg-red-600 border border-red-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        🗑️ Deletar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}