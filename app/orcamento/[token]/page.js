"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OrcamentoPublico() {
  const params = useParams();
  const token = params.token;

  const [orcamento, setOrcamento] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (token) carregarOrcamento();
  }, [token]);

  async function carregarOrcamento() {
    setCarregando(true);

    const { data, error } = await supabase
  .rpc("get_orcamento_por_token", { p_token: token });

if (error || !data || data.length === 0) {
  setNaoEncontrado(true);
  setCarregando(false);
  return;
}

setOrcamento(data[0]);

    setOrcamento(data);

    // Carrega perfil do dono do orçamento (pra pegar logo)
    if (data.user_id) {
      const { data: perfilData } = await supabase
        .from("perfis")
        .select("*")
        .eq("user_id", data.user_id)
        .maybeSingle();

      if (perfilData) setPerfil(perfilData);
    }

    setCarregando(false);
  }

  async function responderOrcamento(novoStatus) {
    const confirmar = confirm(
      novoStatus === "aprovado"
        ? "Confirmar aprovação deste orçamento?"
        : "Confirmar recusa deste orçamento?"
    );
    if (!confirmar) return;

    setProcessando(true);

    const { data, error } = await supabase
  .rpc("responder_orcamento_por_token", {
    p_token: token,
    p_status: novoStatus
  });

setProcessando(false);

if (error) {
  setMensagem("❌ Erro: " + error.message);
  return;
}

if (!data || data.length === 0) {
  setMensagem("❌ Não foi possível responder. O orçamento já pode ter sido respondido, ou o link expirou.");
  return;
}
    // Atualiza o orçamento localmente
    setOrcamento({
      ...orcamento,
      status: novoStatus,
      data_resposta: new Date().toISOString()
    });

    setMensagem(
      novoStatus === "aprovado"
        ? "✅ Orçamento aprovado! O fornecedor será notificado."
        : "Orçamento recusado. Obrigado pelo retorno."
    );
  }

  function formatarDataBR(dataStr) {
    if (!dataStr) return "";
    const [ano, mes, dia] = dataStr.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function formatarNumero(num) {
    return String(num || 0).padStart(4, "0");
  }

  function calcularSubtotal(item) {
    return (Number(item.quantidade) || 0) * (Number(item.valor) || 0);
  }

  function unidadeFinal(item) {
    if (item.unidade === "outro") return item.unidadeCustom || "un";
    return item.unidade || "un";
  }

  // === RENDER ===

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando orçamento...</p>
      </div>
    );
  }

  if (naoEncontrado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Orçamento não encontrado
          </h1>
          <p className="text-gray-500">
            O link pode estar incorreto ou o orçamento foi removido.
          </p>
        </div>
      </div>
    );
  }

  const subtotal = (orcamento.itens || []).reduce(
    (acc, item) => acc + calcularSubtotal(item), 0
  );
  const descontoNumero = Number(orcamento.desconto_valor) || 0;
  let valorDesconto = 0;
  if (orcamento.desconto_tipo === "percentual") {
    valorDesconto = subtotal * (descontoNumero / 100);
  } else {
    valorDesconto = descontoNumero;
  }
  if (valorDesconto > subtotal) valorDesconto = subtotal;

  const statusConfig = {
    pendente: { cor: "bg-yellow-100 text-yellow-800 border-yellow-300", label: "Aguardando resposta" },
    aprovado: { cor: "bg-green-100 text-green-800 border-green-300", label: "✅ Aprovado" },
    recusado: { cor: "bg-red-100 text-red-800 border-red-300", label: "❌ Recusado" },
  };

  const statusAtual = orcamento.status || "pendente";
  const config = statusConfig[statusAtual];
  const jaRespondido = statusAtual !== "pendente";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Status Banner */}
        <div className={`rounded-xl border p-4 mb-4 text-center font-semibold ${config.cor}`}>
          {config.label}
          {jaRespondido && orcamento.data_resposta && (
            <p className="text-xs mt-1 font-normal opacity-80">
              Respondido em {formatarDataBR(orcamento.data_resposta)}
            </p>
          )}
        </div>

        {/* Card principal do orçamento */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Cabeçalho */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                {perfil?.logo_url && (
                  <img
                    src={perfil.logo_url}
                    alt="Logo"
                    className="w-16 h-16 object-contain bg-white rounded-lg p-1"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold">
                    Orçamento #{formatarNumero(orcamento.numero_orcamento)}
                  </h1>
                  <p className="text-blue-100 text-sm mt-1">
                    {formatarDataBR(orcamento.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-6 space-y-6">

            {/* DE */}
            <div className="border-b pb-4">
              <h2 className="text-xs text-gray-500 uppercase font-semibold mb-2">De</h2>
              <p className="text-lg font-bold text-gray-800">{orcamento.empresa}</p>
              {orcamento.telefone && <p className="text-gray-600 text-sm">📱 {orcamento.telefone}</p>}
              {perfil?.email_empresa && <p className="text-gray-600 text-sm">✉️ {perfil.email_empresa}</p>}
              {perfil?.endereco && <p className="text-gray-600 text-sm">📍 {perfil.endereco}</p>}
              {perfil?.documento && <p className="text-gray-600 text-sm">🆔 CNPJ/CPF: {perfil.documento}</p>}
            </div>

            {/* PARA */}
            <div className="border-b pb-4">
              <h2 className="text-xs text-gray-500 uppercase font-semibold mb-2">Para</h2>
              <p className="text-lg font-bold text-gray-800">{orcamento.cliente}</p>
              {orcamento.cliente_telefone && <p className="text-gray-600 text-sm">📱 {orcamento.cliente_telefone}</p>}
              {orcamento.email && <p className="text-gray-600 text-sm">✉️ {orcamento.email}</p>}
              {orcamento.cliente_documento && <p className="text-gray-600 text-sm">🆔 {orcamento.cliente_documento}</p>}
              {orcamento.cliente_endereco && <p className="text-gray-600 text-sm">📍 {orcamento.cliente_endereco}</p>}
            </div>

            {/* Validade */}
            {orcamento.validade && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-sm text-red-700">
                  ⏰ <strong>Válido até:</strong> {formatarDataBR(orcamento.validade)}
                </p>
              </div>
            )}

            {/* Itens */}
            <div className="border-b pb-4">
              <h2 className="text-xs text-gray-500 uppercase font-semibold mb-3">Itens</h2>
              <div className="space-y-3">
                {(orcamento.itens || []).map((item, i) => {
                  const sub = calcularSubtotal(item);
                  const unidade = unidadeFinal(item);
                  return (
                    <div key={i} className="pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between text-gray-700">
                        <span className="font-medium">{item.produto}</span>
                        <span className="font-bold text-gray-900">R$ {sub.toFixed(2)}</span>
                      </div>
                      {item.descricao && (
                        <p className="text-sm text-gray-500 mt-1">{item.descricao}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {item.quantidade} {unidade} × R$ {Number(item.valor).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Totais */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              {valorDesconto > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>
                    {orcamento.desconto_tipo === "percentual"
                      ? `Desconto (${descontoNumero}%)`
                      : "Desconto"}
                  </span>
                  <span>- R$ {valorDesconto.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Total destacado */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-5 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">TOTAL</span>
              <span className="text-3xl font-bold text-blue-600">
                R$ {Number(orcamento.total).toFixed(2)}
              </span>
            </div>

            {/* Observações */}
            {orcamento.observacoes && (
              <div className="border-t pt-4">
                <h2 className="text-xs text-gray-500 uppercase font-semibold mb-2">Observações</h2>
                <p className="text-gray-700 whitespace-pre-wrap text-sm bg-gray-50 rounded-lg p-3">
                  {orcamento.observacoes}
                </p>
              </div>
            )}

            {/* Mensagem de sucesso/erro */}
            {mensagem && (
              <div className={`text-center py-3 px-4 rounded-lg font-medium ${
                mensagem.startsWith("✅")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : mensagem.startsWith("❌")
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-blue-50 text-blue-800 border border-blue-200"
              }`}>
                {mensagem}
              </div>
            )}

            {/* Botões de ação (só se AINDA não respondeu) */}
            {!jaRespondido && (
              <div className="border-t pt-6">
                <p className="text-center text-sm text-gray-600 mb-4 font-medium">
                  O que você deseja fazer com este orçamento?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => responderOrcamento("recusado")}
                    disabled={processando}
                    className="border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    ❌ Recusar
                  </button>
                  <button
                    onClick={() => responderOrcamento("aprovado")}
                    disabled={processando}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-green-200"
                  >
                    ✅ Aprovar Orçamento
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Rodapé */}
          <div className="bg-gray-50 border-t p-4 text-center">
            <p className="text-xs text-gray-500">
              Este orçamento foi gerado com{" "}
              <a href="/" className="text-blue-600 font-semibold hover:underline">
                OrçaFácil
              </a>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}