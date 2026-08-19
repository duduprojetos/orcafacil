"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Header from "../components/Header";

export default function Dashboard() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [orcamentos, setOrcamentos] = useState([]);
  const [perfilCarregado, setPerfilCarregado] = useState(false);

  useEffect(() => {
    verificarLoginECarregar();
  }, []);

  async function verificarLoginECarregar() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUsuario(user);
    await carregarPerfil(user.id);
    await carregarOrcamentos();
    setCarregando(false);
  }

  async function carregarPerfil(userId) {
    const { data } = await supabase
      .from("perfis")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) setPerfilCarregado(true);
  }

  async function carregarOrcamentos() {
    const { data, error } = await supabase
      .from("orcamentos")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setOrcamentos(data);
  }

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function formatarData(dataStr) {
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR");
  }

  function formatarMesAno(dataStr) {
    const data = new Date(dataStr);
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${meses[data.getMonth()]}/${String(data.getFullYear()).slice(2)}`;
  }

  // ===== CÁLCULOS =====

  // Filtra orçamentos do MÊS atual
  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const orcamentosMes = orcamentos.filter(o => new Date(o.created_at) >= inicioMes);

  // Total vendido no mês (aprovados)
  const totalMesAprovado = orcamentosMes
    .filter(o => o.status === "aprovado")
    .reduce((acc, o) => acc + Number(o.total || 0), 0);

  // Total geral aprovado
  const totalGeralAprovado = orcamentos
    .filter(o => o.status === "aprovado")
    .reduce((acc, o) => acc + Number(o.total || 0), 0);

  // Contadores por status
  const contadores = {
    pendente: orcamentos.filter(o => (o.status || "pendente") === "pendente").length,
    aprovado: orcamentos.filter(o => o.status === "aprovado").length,
    recusado: orcamentos.filter(o => o.status === "recusado").length,
    total: orcamentos.length,
  };

  // Ticket médio (apenas aprovados)
  const aprovados = orcamentos.filter(o => o.status === "aprovado");
  const ticketMedio = aprovados.length > 0
    ? aprovados.reduce((acc, o) => acc + Number(o.total || 0), 0) / aprovados.length
    : 0;

  // Taxa de conversão (aprovados / total)
  const taxaConversao = contadores.total > 0
    ? (contadores.aprovado / contadores.total) * 100
    : 0;

  // Top 5 clientes por valor total
  const clientesMap = {};
  orcamentos.filter(o => o.status === "aprovado").forEach(o => {
    if (!o.cliente) return;
    if (!clientesMap[o.cliente]) {
      clientesMap[o.cliente] = { nome: o.cliente, total: 0, count: 0 };
    }
    clientesMap[o.cliente].total += Number(o.total || 0);
    clientesMap[o.cliente].count += 1;
  });
  const topClientes = Object.values(clientesMap)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Gráfico dos últimos 6 meses
  const ultimos6Meses = [];
  for (let i = 5; i >= 0; i--) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const proxData = new Date(hoje.getFullYear(), hoje.getMonth() - i + 1, 1);
    const orcsDoMes = orcamentos.filter(o => {
      const d = new Date(o.created_at);
      return d >= data && d < proxData && o.status === "aprovado";
    });
    const totalDoMes = orcsDoMes.reduce((acc, o) => acc + Number(o.total || 0), 0);
    ultimos6Meses.push({
      mes: formatarMesAno(data.toISOString()),
      valor: totalDoMes,
      count: orcsDoMes.length,
    });
  }
  const maxValor = Math.max(...ultimos6Meses.map(m => m.valor), 1);

  // Últimos 5 orçamentos
  const ultimosOrcamentos = orcamentos.slice(0, 5);

  const statusConfig = {
    pendente: { cor: "bg-yellow-100 text-yellow-800", icone: "🟡", label: "Pendente" },
    aprovado: { cor: "bg-green-100 text-green-800", icone: "✅", label: "Aprovado" },
    recusado: { cor: "bg-red-100 text-red-800", icone: "❌", label: "Recusado" },
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        <Header usuario={usuario} paginaAtiva="dashboard" />

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard</h1>
          <p className="text-gray-500 mt-1">Visão geral dos seus orçamentos</p>
        </div>

        {/* Aviso se não tem perfil */}
        {!perfilCarregado && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
            💡 <strong>Comece configurando seu perfil!</strong> <Link href="/perfil" className="underline font-semibold">Clique aqui</Link> para adicionar sua logo e dados da empresa.
          </div>
        )}

        {/* Se não tem orçamentos ainda */}
        {orcamentos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Bem-vindo ao OrçaFácil!
            </h2>
            <p className="text-gray-500 mb-6">
              Você ainda não criou nenhum orçamento. Que tal começar agora?
            </p>
            <Link
              href="/app"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              ➕ Criar Primeiro Orçamento
            </Link>
          </div>
        ) : (
          <>
            {/* Cards de métricas principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

              <div className="bg-white rounded-2xl shadow p-5 border-l-4 border-green-500">
                <p className="text-xs text-gray-500 uppercase font-semibold">💰 Faturamento (mês)</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  R$ {totalMesAprovado.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Total aprovado no mês
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow p-5 border-l-4 border-blue-500">
                <p className="text-xs text-gray-500 uppercase font-semibold">📊 Ticket Médio</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  R$ {ticketMedio.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Média dos aprovados
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow p-5 border-l-4 border-purple-500">
                <p className="text-xs text-gray-500 uppercase font-semibold">🎯 Taxa de Aprovação</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {taxaConversao.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {contadores.aprovado} de {contadores.total} orçamentos
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow p-5 border-l-4 border-yellow-500">
                <p className="text-xs text-gray-500 uppercase font-semibold">🟡 Pendentes</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {contadores.pendente}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Aguardando resposta
                </p>
              </div>

            </div>

            {/* Cards secundários (contadores por status) */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-yellow-700">{contadores.pendente}</p>
                <p className="text-xs text-yellow-800 font-medium mt-1">🟡 Pendentes</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-green-700">{contadores.aprovado}</p>
                <p className="text-xs text-green-800 font-medium mt-1">✅ Aprovados</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-red-700">{contadores.recusado}</p>
                <p className="text-xs text-red-800 font-medium mt-1">❌ Recusados</p>
              </div>
            </div>

            {/* Gráfico de vendas por mês */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">📈 Faturamento por mês</h2>
                <span className="text-xs text-gray-500">Últimos 6 meses</span>
              </div>

              <div className="flex items-end justify-between gap-2 h-48">
                {ultimos6Meses.map((mes, i) => {
                  const altura = maxValor > 0 ? (mes.valor / maxValor) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex-1 flex flex-col justify-end">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500 relative group"
                          style={{ height: `${altura}%`, minHeight: mes.valor > 0 ? "4px" : "0" }}
                        >
                          {mes.valor > 0 && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                R$ {mes.valor.toFixed(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-600">{mes.mes}</p>
                        <p className="text-xs text-gray-400">{mes.count}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid: Top Clientes + Últimos Orçamentos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Top Clientes */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 Top Clientes</h2>
                {topClientes.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Nenhum orçamento aprovado ainda
                  </p>
                ) : (
                  <div className="space-y-3">
                    {topClientes.map((cliente, i) => (
                      <div key={i} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{cliente.nome}</p>
                            <p className="text-xs text-gray-500">{cliente.count} {cliente.count === 1 ? "orçamento" : "orçamentos"}</p>
                          </div>
                        </div>
                        <p className="font-bold text-green-600">R$ {cliente.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Últimos Orçamentos */}
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">🕐 Últimos orçamentos</h2>
                  <Link href="/orcamentos" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    Ver todos →
                  </Link>
                </div>
                <div className="space-y-3">
                  {ultimosOrcamentos.map((orc) => {
                    const config = statusConfig[orc.status || "pendente"];
                    return (
                      <Link
                        href={`/app?editar=${orc.id}`}
                        key={orc.id}
                        className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              #{String(orc.numero_orcamento || 0).padStart(4, "0")}
                            </span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.cor}`}>
                              {config.icone} {config.label}
                            </span>
                          </div>
                          <p className="font-medium text-gray-800 truncate">{orc.cliente}</p>
                          <p className="text-xs text-gray-400">{formatarData(orc.created_at)}</p>
                        </div>
                        <p className="font-bold text-blue-600 ml-3">R$ {Number(orc.total).toFixed(2)}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Faturamento total (rodapé) */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 mt-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">💎 Faturamento total (todos os aprovados)</p>
                  <p className="text-4xl font-bold mt-1">R$ {totalGeralAprovado.toFixed(2)}</p>
                </div>
                <div className="text-6xl opacity-30">💰</div>
              </div>
            </div>

          </>
        )}

      </div>
    </div>
  );
}