"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jsPDF } from "jspdf";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idEdicao = searchParams.get("editar");

  const [usuario, setUsuario] = useState(null);
  const [verificandoLogin, setVerificandoLogin] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);

  const [empresa, setEmpresa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cliente, setCliente] = useState("");
  const [email, setEmail] = useState("");
  const [itens, setItens] = useState([
    { produto: "", quantidade: "", valor: "" }
  ]);
  const [orcamentoGerado, setOrcamentoGerado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    verificarLogin();
  }, []);

  async function verificarLogin() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setUsuario(user);
    setVerificandoLogin(false);

    // Se veio ?editar=ID, carrega dados do orçamento
    if (idEdicao) {
      carregarOrcamento(idEdicao);
    }
  }

  async function carregarOrcamento(id) {
    const { data, error } = await supabase
      .from("orcamentos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      setMensagem("❌ Erro ao carregar orçamento");
      return;
    }

    if (data) {
      setEmpresa(data.empresa || "");
      setTelefone(data.telefone || "");
      setCliente(data.cliente || "");
      setEmail(data.email || "");
      setItens(data.itens || [{ produto: "", quantidade: "", valor: "" }]);
      setModoEdicao(true);
    }
  }

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function atualizarItem(index, campo, valor) {
    const novosItens = [...itens];
    novosItens[index][campo] = valor;
    setItens(novosItens);
  }

  function adicionarItem() {
    setItens([...itens, { produto: "", quantidade: "", valor: "" }]);
  }

  function removerItem(index) {
    if (itens.length === 1) return;
    setItens(itens.filter((_, i) => i !== index));
  }

  function calcularSubtotal(item) {
    return (Number(item.quantidade) || 0) * (Number(item.valor) || 0);
  }

  const totalGeral = itens.reduce((acc, item) => acc + calcularSubtotal(item), 0);
  const dataHoje = new Date().toLocaleDateString("pt-BR");

  async function gerarOrcamento(e) {
    e.preventDefault();
    setSalvando(true);
    setMensagem("");

    const dadosOrcamento = {
      empresa: empresa,
      telefone: telefone,
      cliente: cliente,
      email: email,
      itens: itens,
      total: totalGeral,
      user_id: usuario.id
    };

    let resultado;

    if (modoEdicao && idEdicao) {
      // ATUALIZAR orçamento existente
      resultado = await supabase
        .from("orcamentos")
        .update(dadosOrcamento)
        .eq("id", idEdicao);
    } else {
      // CRIAR novo orçamento
      resultado = await supabase
        .from("orcamentos")
        .insert([dadosOrcamento]);
    }

    setSalvando(false);

    if (resultado.error) {
      setMensagem("❌ Erro ao salvar: " + resultado.error.message);
      console.error(resultado.error);
      return;
    }

    setMensagem(modoEdicao ? "✅ Orçamento atualizado!" : "✅ Orçamento salvo!");
    setOrcamentoGerado(true);
  }

  function novoOrcamento() {
    // Se estava editando, volta para a lista de orçamentos
    if (modoEdicao) {
      router.push("/orcamentos");
      return;
    }

    setOrcamentoGerado(false);
    setMensagem("");
    setEmpresa("");
    setTelefone("");
    setCliente("");
    setEmail("");
    setItens([{ produto: "", quantidade: "", valor: "" }]);
  }

  function baixarPDF() {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("ORCAMENTO", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Data: ${dataHoje}`, 105, 27, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("DE", 20, 42);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(empresa, 20, 49);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(telefone, 20, 55);

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("PARA", 20, 70);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(cliente, 20, 77);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(email, 20, 83);

    doc.line(20, 90, 190, 90);

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("ITENS", 20, 100);

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Produto", 20, 108);
    doc.text("Qtd", 120, 108);
    doc.text("Valor", 140, 108);
    doc.text("Subtotal", 170, 108);

    doc.setFont("helvetica", "normal");
    let y = 116;
    itens.forEach((item) => {
      const subtotal = calcularSubtotal(item);
      doc.text(item.produto || "-", 20, y);
      doc.text(String(item.quantidade), 120, y);
      doc.text(`R$ ${Number(item.valor).toFixed(2)}`, 140, y);
      doc.text(`R$ ${subtotal.toFixed(2)}`, 170, y);
      y += 8;
    });

    doc.line(20, y + 4, 190, y + 4);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", 130, y + 15);
    doc.setTextColor(37, 99, 235);
    doc.text(`R$ ${totalGeral.toFixed(2)}`, 170, y + 15);

    doc.save(`orcamento-${cliente || "cliente"}.pdf`);
  }

  if (verificandoLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Barra superior */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <span className="text-gray-600">
            👤 {usuario?.email}
          </span>
          <button onClick={sair} className="text-red-600 hover:text-red-800 font-medium">
            Sair
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {modoEdicao ? "Editar Orçamento" : "OrçaFácil"}
            </h1>
            <p className="text-gray-500 mt-2">
              {modoEdicao
                ? "Faça as alterações necessárias e salve"
                : "Crie orçamentos profissionais em menos de 1 minuto"}
            </p>
            <a href="/orcamentos" className="inline-block mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
              ← Ver meus orçamentos
            </a>
          </div>

          {!orcamentoGerado && (
            <form onSubmit={gerarOrcamento} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Sua Empresa</h2>
                <input type="text" placeholder="Nome da empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Cliente</h2>
                <input type="text" placeholder="Nome do cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="email" placeholder="E-mail do cliente" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-700">Itens do Orçamento</h2>
                  <button type="button" onClick={adicionarItem} className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-3 py-1 rounded-lg transition-colors">
                    + Adicionar Item
                  </button>
                </div>

                {itens.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 mb-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Item {index + 1}</span>
                      {itens.length > 1 && (
                        <button type="button" onClick={() => removerItem(index)} className="text-xs text-red-500 hover:text-red-700">
                          Remover
                        </button>
                      )}
                    </div>
                    <input type="text" placeholder="Produto ou serviço" value={item.produto} onChange={(e) => atualizarItem(index, "produto", e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="Quantidade" value={item.quantidade} onChange={(e) => atualizarItem(index, "quantidade", e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="number" placeholder="Valor (R$)" value={item.valor} onChange={(e) => atualizarItem(index, "valor", e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                ))}
              </div>

              {mensagem && (
                <div className="text-center text-sm py-2">{mensagem}</div>
              )}

              <button type="submit" disabled={salvando} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50">
                {salvando
                  ? "Salvando..."
                  : modoEdicao
                    ? "Salvar Alterações"
                    : "Gerar Orçamento"}
              </button>
            </form>
          )}

          {orcamentoGerado && (
            <div className="space-y-6">
              <div className="text-center border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-800">ORÇAMENTO</h1>
                <p className="text-sm text-gray-500 mt-1">Data: {dataHoje}</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-sm text-gray-500 uppercase">De</h2>
                <p className="text-lg font-semibold text-gray-800">{empresa}</p>
                <p className="text-gray-600">{telefone}</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-sm text-gray-500 uppercase">Para</h2>
                <p className="text-lg font-semibold text-gray-800">{cliente}</p>
                <p className="text-gray-600">{email}</p>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-sm text-gray-500 uppercase mb-3">Itens</h2>
                <div className="space-y-2">
                  {itens.map((item, index) => (
                    <div key={index} className="flex justify-between text-gray-700">
                      <span>{item.produto}</span>
                      <span className="text-right">
                        {item.quantidade} × R$ {Number(item.valor).toFixed(2)}
                        <span className="ml-2 font-medium text-gray-900">
                          = R$ {calcularSubtotal(item).toFixed(2)}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center bg-blue-50 rounded-lg p-4">
                <span className="text-lg font-semibold text-gray-700">Total</span>
                <span className="text-2xl font-bold text-blue-600">R$ {totalGeral.toFixed(2)}</span>
              </div>

              {mensagem && (
                <div className="text-center text-sm py-2">{mensagem}</div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button onClick={baixarPDF} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors">
                  📄 Baixar PDF
                </button>
                <button onClick={novoOrcamento} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors">
                  {modoEdicao ? "Voltar" : "Novo Orçamento"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}