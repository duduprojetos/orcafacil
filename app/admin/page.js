/* eslint-disable react-hooks/immutability, react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const EMAIL_ADMIN = "admin@edu.com";

export default function AdminPrivacidade() {
  const [carregando, setCarregando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [atualizandoId, setAtualizandoId] = useState(null);
  const [filtro, setFiltro] = useState("pendente");

  useEffect(() => {
    verificarAcesso();
  }, []);

  async function verificarAcesso() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== EMAIL_ADMIN) {
      setAutorizado(false);
      setCarregando(false);
      return;
    }

    setAutorizado(true);
    await carregarSolicitacoes();
    setCarregando(false);
  }

  async function carregarSolicitacoes() {
    const { data, error } = await supabase
      .from("solicitacoes_privacidade")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSolicitacoes(data);
    }
  }

  async function marcarComoRespondido(id) {
    setAtualizandoId(id);

    const { error } = await supabase
      .from("solicitacoes_privacidade")
      .update({ status: "respondido", respondido_em: new Date().toISOString() })
      .eq("id", id);

    setAtualizandoId(null);

    if (!error) {
      await carregarSolicitacoes();
    }
  }

  function formatarData(dataStr) {
    const d = new Date(dataStr);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const rotuloTipo = {
    duvida: "Dúvida geral",
    acesso: "Acesso aos dados",
    correcao: "Correção de dados",
    exclusao: "Exclusão de dados",
    outro: "Outro assunto",
  };

  const solicitacoesFiltradas =
    filtro === "todos"
      ? solicitacoes
      : solicitacoes.filter((s) => s.status === filtro);

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  if (!autorizado) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 max-w-md text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-xl font-bold mb-2">Acesso restrito</h1>
          <p className="text-gray-400 text-sm mb-6">
            Esta página é reservada ao administrador da plataforma.
          </p>
          <Link
            href="/login"
            className="inline-block bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold px-5 py-2.5 rounded-lg"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  const pendentesCount = solicitacoes.filter((s) => s.status === "pendente").length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/5 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-black font-bold text-lg">
              O
            </div>
            <span className="text-xl font-bold">OrçaFácil</span>
          </Link>
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">
            ← Voltar ao dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Solicitações de Privacidade</h1>
          {pendentesCount > 0 && (
            <span className="bg-yellow-500/20 text-yellow-400 text-sm font-semibold px-3 py-1 rounded-full">
              {pendentesCount} pendente{pendentesCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <p className="text-gray-400 mb-6 text-sm">
          Pedidos recebidos pelo formulário da página de Política de Privacidade.
        </p>

        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          {["pendente", "respondido", "todos"].map((op) => (
            <button
              key={op}
              onClick={() => setFiltro(op)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtro === op
                  ? "bg-white text-black"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {op === "pendente" ? "Pendentes" : op === "respondido" ? "Respondidos" : "Todos"}
            </button>
          ))}
        </div>

        {/* Lista */}
        {solicitacoesFiltradas.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-gray-400">
            Nenhuma solicitação por aqui.
          </div>
        ) : (
          <div className="space-y-3">
            {solicitacoesFiltradas.map((s) => (
              <div
                key={s.id}
                className="bg-white/5 border border-white/10 rounded-xl p-5"
              >
                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-white">{s.nome}</p>
                    <p className="text-gray-400 text-sm">{s.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full font-medium">
                      {rotuloTipo[s.tipo_solicitacao] || s.tipo_solicitacao}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        s.status === "pendente"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {s.status === "pendente" ? "Pendente" : "Respondido"}
                    </span>
                  </div>
                </div>

                {s.mensagem && (
                  <p className="text-gray-300 text-sm bg-black/30 rounded-lg p-3 mb-3 whitespace-pre-wrap">
                    {s.mensagem}
                  </p>
                )}

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Recebido em {formatarData(s.created_at)}</span>
                  {s.status === "pendente" && (
                    <button
                      onClick={() => marcarComoRespondido(s.id)}
                      disabled={atualizandoId === s.id}
                      className="text-green-400 hover:text-green-300 font-medium disabled:opacity-50"
                    >
                      {atualizandoId === s.id ? "Salvando..." : "✓ Marcar como respondido"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}