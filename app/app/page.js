"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jsPDF } from "jspdf";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const UNIDADES = [
  { valor: "un", label: "un (unidade)" },
  { valor: "m²", label: "m² (metro quadrado)" },
  { valor: "m³", label: "m³ (metro cúbico)" },
  { valor: "m", label: "m (metro linear)" },
  { valor: "kg", label: "kg (quilograma)" },
  { valor: "h", label: "h (hora)" },
  { valor: "dia", label: "dia" },
  { valor: "km", label: "km (quilômetro)" },
  { valor: "L", label: "L (litro)" },
  { valor: "pç", label: "pç (peça)" },
  { valor: "serviço", label: "serviço" },
  { valor: "outro", label: "Outra..." },
];

function calcularValidadePadrao() {
  const hoje = new Date();
  hoje.setDate(hoje.getDate() + 30);
  return hoje.toISOString().split("T")[0];
}

// Formata telefone: (11) 99999-9999
function formatarTelefone(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length <= 10) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

// Pega só números do telefone (pra usar no link do WhatsApp)
function limparTelefone(tel) {
  if (!tel) return "";
  const numeros = tel.replace(/\D/g, "");
  // Adiciona 55 (Brasil) se não tiver
  if (numeros.length === 11 || numeros.length === 10) {
    return "55" + numeros;
  }
  return numeros;
}

async function urlParaBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Erro ao converter imagem:", error);
    return null;
  }
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idEdicao = searchParams.get("editar");

  const [usuario, setUsuario] = useState(null);
  const [verificandoLogin, setVerificandoLogin] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [perfilCarregado, setPerfilCarregado] = useState(false);
  const [perfilCompleto, setPerfilCompleto] = useState(null);
  const [idOrcamento, setIdOrcamento] = useState(null);
  const [numeroOrcamento, setNumeroOrcamento] = useState(null);

  const [empresa, setEmpresa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cliente, setCliente] = useState("");
  const [email, setEmail] = useState("");
  const [clienteTelefone, setClienteTelefone] = useState("");
  const [clienteDocumento, setClienteDocumento] = useState("");
  const [clienteEndereco, setClienteEndereco] = useState("");
  const [itens, setItens] = useState([
    { produto: "", descricao: "", quantidade: "", unidade: "un", unidadeCustom: "", valor: "" }
  ]);
  const [observacoes, setObservacoes] = useState("");
  const [validade, setValidade] = useState(calcularValidadePadrao());
  const [descontoTipo, setDescontoTipo] = useState("percentual");
  const [descontoValor, setDescontoValor] = useState("");
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
    if (idEdicao) {
      carregarOrcamento(idEdicao);
    }
    carregarPerfil(user.id);
  }

  async function carregarPerfil(userId) {
    const { data, error } = await supabase.from("perfis").select("*").eq("user_id", userId).maybeSingle();
    if (error) return;
    if (data) {
      setPerfilCompleto(data);
      if (!idEdicao) {
        setEmpresa(data.nome_empresa || "");
        setTelefone(data.telefone || "");
      }
      setPerfilCarregado(true);
    }
  }

  async function carregarOrcamento(id) {
    const { data, error } = await supabase.from("orcamentos").select("*").eq("id", id).single();
    if (error) {
      setMensagem("❌ Erro ao carregar orçamento");
      return;
    }
    if (data) {
      setIdOrcamento(data.id);
      setNumeroOrcamento(data.numero_orcamento);
      setEmpresa(data.empresa || "");
      setTelefone(data.telefone || "");
      setCliente(data.cliente || "");
      setEmail(data.email || "");
      setClienteTelefone(data.cliente_telefone || "");
      setClienteDocumento(data.cliente_documento || "");
      setClienteEndereco(data.cliente_endereco || "");

      const itensNormalizados = (data.itens || []).map(item => ({
        produto: item.produto || "",
        descricao: item.descricao || "",
        quantidade: item.quantidade || "",
        unidade: item.unidade || "un",
        unidadeCustom: item.unidadeCustom || "",
        valor: item.valor || ""
      }));

      setItens(itensNormalizados.length > 0 ? itensNormalizados : [
        { produto: "", descricao: "", quantidade: "", unidade: "un", unidadeCustom: "", valor: "" }
      ]);
      setObservacoes(data.observacoes || "");
      setValidade(data.validade || calcularValidadePadrao());
      setDescontoTipo(data.desconto_tipo || "percentual");
      setDescontoValor(data.desconto_valor ? String(data.desconto_valor) : "");
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
    setItens([...itens, { produto: "", descricao: "", quantidade: "", unidade: "un", unidadeCustom: "", valor: "" }]);
  }

  function removerItem(index) {
    if (itens.length === 1) return;
    setItens(itens.filter((_, i) => i !== index));
  }

  function calcularSubtotal(item) {
    return (Number(item.quantidade) || 0) * (Number(item.valor) || 0);
  }

  function unidadeFinal(item) {
    if (item.unidade === "outro") return item.unidadeCustom || "un";
    return item.unidade || "un";
  }

  function formatarDataBR(dataStr) {
    if (!dataStr) return "";
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function calcularDiasRestantes(dataStr) {
    if (!dataStr) return null;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const validade = new Date(dataStr + "T00:00:00");
    const diff = validade.getTime() - hoje.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function formatarNumeroOrcamento(id) {
    if (!id) return "0001";
    return String(id).padStart(4, "0");
  }

  // Enviar por WhatsApp
  function enviarWhatsApp() {
    if (!clienteTelefone) {
      alert("⚠️ Preencha o telefone do cliente antes de enviar por WhatsApp!");
      return;
    }

    const numeroLimpo = limparTelefone(clienteTelefone);
    if (numeroLimpo.length < 12) {
      alert("⚠️ Telefone inválido. Verifique o número.");
      return;
    }

    const numOrc = formatarNumeroOrcamento(numeroOrcamento);

    const mensagem = `Olá ${cliente}! 👋\n\nSegue o orçamento #${numOrc} solicitado:\n\n💰 *Total: R$ ${totalGeral.toFixed(2)}*\n📅 Válido até: ${formatarDataBR(validade)}\n\nQualquer dúvida, estou à disposição!\n\n_${empresa}_`;

    const url = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  }

  const subtotal = itens.reduce((acc, item) => acc + calcularSubtotal(item), 0);
  const descontoNumero = Number(descontoValor) || 0;
  let valorDesconto = 0;
  if (descontoTipo === "percentual") {
    valorDesconto = subtotal * (descontoNumero / 100);
  } else {
    valorDesconto = descontoNumero;
  }
  if (valorDesconto > subtotal) valorDesconto = subtotal;
  const totalGeral = subtotal - valorDesconto;
  const dataHoje = new Date().toLocaleDateString("pt-BR");
  const diasRestantes = calcularDiasRestantes(validade);

  async function gerarOrcamento(e) {
    e.preventDefault();
    setSalvando(true);
    setMensagem("");

    // Buscar próximo número (só pra novos orçamentos)
    let numeroAtual = numeroOrcamento;
    if (!modoEdicao) {
      const { data: numData, error: numError } = await supabase
        .rpc("proximo_numero_orcamento", { uid: usuario.id });

      if (numError) {
        setMensagem("❌ Erro ao gerar número: " + numError.message);
        setSalvando(false);
        return;
      }
      numeroAtual = numData;
    }

    const dadosOrcamento = {
      empresa, telefone, cliente, email,
      cliente_telefone: clienteTelefone,
      cliente_documento: clienteDocumento,
      cliente_endereco: clienteEndereco,
      itens, total: totalGeral,
      observacoes, validade,
      desconto_tipo: descontoTipo,
      desconto_valor: descontoNumero,
      numero_orcamento: numeroAtual,
      user_id: usuario.id
    };

    let resultado;
    if (modoEdicao && idEdicao) {
      resultado = await supabase.from("orcamentos").update(dadosOrcamento).eq("id", idEdicao).select();
    } else {
      resultado = await supabase.from("orcamentos").insert([dadosOrcamento]).select();
    }

    setSalvando(false);
    if (resultado.error) {
      setMensagem("❌ Erro ao salvar: " + resultado.error.message);
      return;
    }

    if (resultado.data && resultado.data.length > 0) {
      setIdOrcamento(resultado.data[0].id);
      setNumeroOrcamento(resultado.data[0].numero_orcamento);
    }

    setMensagem(modoEdicao ? "✅ Orçamento atualizado!" : "✅ Orçamento salvo!");
    setOrcamentoGerado(true);
  }

  function novoOrcamento() {
    if (modoEdicao) {
      router.push("/orcamentos");
      return;
    }
    setOrcamentoGerado(false);
    setMensagem("");
    setCliente("");
    setEmail("");
    setClienteTelefone("");
    setClienteDocumento("");
    setClienteEndereco("");
    setItens([{ produto: "", descricao: "", quantidade: "", unidade: "un", unidadeCustom: "", valor: "" }]);
    setObservacoes("");
    setValidade(calcularValidadePadrao());
    setDescontoTipo("percentual");
    setDescontoValor("");
    setIdOrcamento(null);
    setNumeroOrcamento(null);
  }

  async function baixarPDF() {
    const doc = new jsPDF();
    let yTopo = 15;

    // Logo
    if (perfilCompleto?.logo_url) {
      try {
        const logoBase64 = await urlParaBase64(perfilCompleto.logo_url);
        if (logoBase64) {
          const img = new Image();
          img.src = logoBase64;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });

          const maxWidth = 70;
          const maxHeight = 45;
          let logoW = img.width;
          let logoH = img.height;
          const ratio = Math.min(maxWidth / logoW, maxHeight / logoH);
          logoW = logoW * ratio;
          logoH = logoH * ratio;

          doc.addImage(logoBase64, "PNG", 20, yTopo, logoW, logoH);
        }
      } catch (err) {
        console.error("Erro ao adicionar logo:", err);
      }
    }

    const numOrc = formatarNumeroOrcamento(numeroOrcamento);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.text("ORCAMENTO", 190, yTopo + 5, { align: "right" });

    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`#${numOrc}`, 190, yTopo + 13, { align: "right" });

    doc.setFontSize(9);
    doc.setTextColor(80);
    doc.setFont("helvetica", "normal");
    doc.text(`Data: ${dataHoje}`, 190, yTopo + 21, { align: "right" });

    if (validade) {
      doc.setTextColor(180, 60, 60);
      doc.text(`Valido ate: ${formatarDataBR(validade)}`, 190, yTopo + 27, { align: "right" });
    }

    let ySep = yTopo + 50;
    doc.setDrawColor(220);
    doc.setLineWidth(0.5);
    doc.line(20, ySep, 190, ySep);

    // DE (Empresa)
    let yEmpresa = ySep + 8;
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("DE", 20, yEmpresa);

    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(empresa || "-", 20, yEmpresa + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80);
    let yInfoEmpresa = yEmpresa + 13;

    if (telefone) { doc.text(telefone, 20, yInfoEmpresa); yInfoEmpresa += 4; }
    if (perfilCompleto?.email_empresa) { doc.text(perfilCompleto.email_empresa, 20, yInfoEmpresa); yInfoEmpresa += 4; }
    if (perfilCompleto?.endereco) { doc.text(perfilCompleto.endereco, 20, yInfoEmpresa); yInfoEmpresa += 4; }
    if (perfilCompleto?.documento) { doc.text(`CNPJ/CPF: ${perfilCompleto.documento}`, 20, yInfoEmpresa); yInfoEmpresa += 4; }

    // PARA (Cliente)
    let yCliente = Math.max(yInfoEmpresa + 8, yEmpresa + 30);
    doc.setDrawColor(220);
    doc.line(20, yCliente, 190, yCliente);
    yCliente += 8;

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("PARA", 20, yCliente);

    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(cliente || "-", 20, yCliente + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80);
    let yInfoCliente = yCliente + 13;

    if (clienteTelefone) { doc.text(clienteTelefone, 20, yInfoCliente); yInfoCliente += 4; }
    if (email) { doc.text(email, 20, yInfoCliente); yInfoCliente += 4; }
    if (clienteDocumento) { doc.text(`CPF/CNPJ: ${clienteDocumento}`, 20, yInfoCliente); yInfoCliente += 4; }
    if (clienteEndereco) { doc.text(clienteEndereco, 20, yInfoCliente); yInfoCliente += 4; }

    // ITENS
    let yItens = Math.max(yInfoCliente + 8, yCliente + 25);
    doc.setDrawColor(220);
    doc.line(20, yItens, 190, yItens);
    yItens += 8;

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("ITENS", 20, yItens);
    yItens += 7;

    doc.setFillColor(245, 247, 250);
    doc.rect(20, yItens - 5, 170, 8, "F");

    doc.setFontSize(9);
    doc.setTextColor(60);
    doc.setFont("helvetica", "bold");
    doc.text("Descricao", 22, yItens);
    doc.text("Qtd", 115, yItens);
    doc.text("Valor Un.", 140, yItens);
    doc.text("Subtotal", 172, yItens);

    yItens += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);

    itens.forEach((item) => {
      const sub = calcularSubtotal(item);
      const unidade = unidadeFinal(item);

      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(item.produto || "-", 22, yItens);
      doc.text(`${item.quantidade} ${unidade}`, 115, yItens);
      doc.text(`R$ ${Number(item.valor).toFixed(2)}`, 140, yItens);
      doc.text(`R$ ${sub.toFixed(2)}`, 172, yItens);
      yItens += 6;

      if (item.descricao && item.descricao.trim() !== "") {
        doc.setFontSize(8);
        doc.setTextColor(120);
        const linhas = doc.splitTextToSize(item.descricao, 90);
        doc.text(linhas, 22, yItens);
        yItens += (linhas.length * 4) + 2;
        doc.setTextColor(0);
      } else {
        yItens += 1;
      }
    });

    yItens += 3;
    doc.setDrawColor(200);
    doc.line(20, yItens, 190, yItens);
    yItens += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.text("Subtotal:", 130, yItens);
    doc.text(`R$ ${subtotal.toFixed(2)}`, 190, yItens, { align: "right" });

    if (valorDesconto > 0) {
      yItens += 6;
      doc.setTextColor(180, 60, 60);
      const labelDesc = descontoTipo === "percentual"
        ? `Desconto (${descontoNumero}%):`
        : "Desconto:";
      doc.text(labelDesc, 130, yItens);
      doc.text(`- R$ ${valorDesconto.toFixed(2)}`, 190, yItens, { align: "right" });
    }

    yItens += 10;
    doc.setFillColor(240, 247, 255);
    doc.rect(115, yItens - 6, 75, 12, "F");

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("TOTAL:", 120, yItens + 1);
    doc.setTextColor(37, 99, 235);
    doc.text(`R$ ${totalGeral.toFixed(2)}`, 188, yItens + 1, { align: "right" });
    doc.setTextColor(0);

    if (observacoes && observacoes.trim() !== "") {
      let yObs = yItens + 20;
      doc.setDrawColor(220);
      doc.line(20, yObs - 5, 190, yObs - 5);

      doc.setTextColor(120);
      doc.setFontSize(9);
      doc.text("OBSERVACOES", 20, yObs);
      doc.setTextColor(60);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const linhas = doc.splitTextToSize(observacoes, 170);
      doc.text(linhas, 20, yObs + 6);
    }

    const alturaPagina = doc.internal.pageSize.height;
    doc.setDrawColor(230);
    doc.line(20, alturaPagina - 15, 190, alturaPagina - 15);

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.setFont("helvetica", "italic");
    doc.text("Gerado por OrcaFacil", 105, alturaPagina - 10, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(dataHoje, 105, alturaPagina - 6, { align: "center" });

    doc.save(`orcamento-${numOrc}-${cliente || "cliente"}.pdf`);
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

        <div className="flex flex-wrap justify-between items-center mb-4 gap-2 text-sm">
          <span className="text-gray-600">👤 {usuario?.email}</span>
          <div className="flex gap-4 items-center">
            <Link href="/perfil" className="text-gray-700 hover:text-blue-600 font-medium">⚙️ Perfil</Link>
            <Link href="/orcamentos" className="text-gray-700 hover:text-blue-600 font-medium">📄 Orçamentos</Link>
            <button onClick={sair} className="text-red-600 hover:text-red-800 font-medium">Sair</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {modoEdicao ? "Editar Orçamento" : "OrçaFácil"}
            </h1>
            <p className="text-gray-500 mt-2">
              {modoEdicao ? "Faça as alterações necessárias e salve" : "Crie orçamentos profissionais em menos de 1 minuto"}
            </p>

            {!modoEdicao && !perfilCarregado && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                💡 Dica: <Link href="/perfil" className="underline font-semibold">Configure seu perfil</Link> para preencher automaticamente os dados da sua empresa!
              </div>
            )}
          </div>

          {!orcamentoGerado && (
            <form onSubmit={gerarOrcamento} className="space-y-6">

              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Sua Empresa</h2>
                <input type="text" placeholder="Nome da empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(formatarTelefone(e.target.value))} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              {/* CLIENTE — CAMPOS EXPANDIDOS */}
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Cliente</h2>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nome do cliente *"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="📱 Telefone / WhatsApp *"
                      value={clienteTelefone}
                      onChange={(e) => setClienteTelefone(formatarTelefone(e.target.value))}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      💬 Você poderá enviar o orçamento direto por WhatsApp!
                    </p>
                  </div>

                  <input
                    type="email"
                    placeholder="E-mail (opcional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="CPF / CNPJ (opcional)"
                    value={clienteDocumento}
                    onChange={(e) => setClienteDocumento(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Endereço (opcional)"
                    value={clienteEndereco}
                    onChange={(e) => setClienteEndereco(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-700">Itens do Orçamento</h2>
                  <button type="button" onClick={adicionarItem} className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-3 py-1 rounded-lg transition-colors">
                    + Adicionar Item
                  </button>
                </div>

                {itens.map((item, index) => {
                  const sub = calcularSubtotal(item);
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-gray-700">Item {index + 1}</span>
                        {itens.length > 1 && (
                          <button type="button" onClick={() => removerItem(index)} className="text-xs text-red-500 hover:text-red-700 font-medium">
                            ✕ Remover
                          </button>
                        )}
                      </div>

                      <input type="text" placeholder="Produto ou serviço *" value={item.produto} onChange={(e) => atualizarItem(index, "produto", e.target.value)} required className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="text" placeholder="Descrição detalhada (opcional)" value={item.descricao} onChange={(e) => atualizarItem(index, "descricao", e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Qtd</label>
                          <input type="number" step="0.01" placeholder="1" value={item.quantidade} onChange={(e) => atualizarItem(index, "quantidade", e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Unidade</label>
                          <select value={item.unidade} onChange={(e) => atualizarItem(index, "unidade", e.target.value)} className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                            {UNIDADES.map(u => (<option key={u.valor} value={u.valor}>{u.label}</option>))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Valor unit. (R$)</label>
                          <input type="number" step="0.01" placeholder="0,00" value={item.valor} onChange={(e) => atualizarItem(index, "valor", e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>

                      {item.unidade === "outro" && (
                        <input type="text" placeholder="Digite a unidade" value={item.unidadeCustom} onChange={(e) => atualizarItem(index, "unidadeCustom", e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      )}

                      {sub > 0 && (
                        <div className="text-right text-sm text-gray-600 mt-2 pt-2 border-t border-gray-200">
                          Subtotal: <span className="font-semibold text-gray-900">R$ {sub.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {subtotal > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium text-gray-700">Desconto</label>
                      <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden text-xs">
                        <button type="button" onClick={() => setDescontoTipo("percentual")} className={`px-3 py-1 font-semibold ${descontoTipo === "percentual" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>%</button>
                        <button type="button" onClick={() => setDescontoTipo("fixo")} className={`px-3 py-1 font-semibold ${descontoTipo === "fixo" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>R$</button>
                      </div>
                      <input type="number" step="0.01" min="0" placeholder="0" value={descontoValor} onChange={(e) => setDescontoValor(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {valorDesconto > 0 && (
                      <div className="flex justify-between items-center text-red-600 text-sm">
                        <span>{descontoTipo === "percentual" ? `Desconto (${descontoNumero}%)` : "Desconto"}</span>
                        <span className="font-medium">- R$ {valorDesconto.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-lg p-3 -mx-1">
                    <span className="text-base font-semibold text-gray-700">Total</span>
                    <span className="text-2xl font-bold text-blue-600">R$ {totalGeral.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Validade do Orçamento</h2>
                <div className="flex gap-3 items-center">
                  <input type="date" value={validade} onChange={(e) => setValidade(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {diasRestantes !== null && (
                    <span className={`text-sm font-semibold px-3 py-2 rounded-lg ${
                      diasRestantes < 0 ? "bg-red-100 text-red-700"
                        : diasRestantes <= 7 ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                    }`}>
                      {diasRestantes < 0 ? "⚠️ Vencido" : diasRestantes === 0 ? "Vence hoje" : `${diasRestantes} dias`}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">💡 Padrão de 30 dias. Você pode alterar.</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Observações <span className="text-xs text-gray-400 font-normal ml-2">(opcional)</span>
                  </h2>
                  <span className="text-xs text-gray-400">{observacoes.length}/500</span>
                </div>
                <textarea placeholder="Ex: 50% na aprovação, 50% na entrega | Prazo: 5 dias úteis" value={observacoes} onChange={(e) => setObservacoes(e.target.value.slice(0, 500))} rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                <p className="text-xs text-gray-500 mt-1">💡 Aparecerá no PDF do orçamento</p>
              </div>

              {mensagem && <div className="text-center text-sm py-2">{mensagem}</div>}

              <button type="submit" disabled={salvando} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50">
                {salvando ? "Salvando..." : modoEdicao ? "Salvar Alterações" : "Gerar Orçamento"}
              </button>
            </form>
          )}

          {orcamentoGerado && (
            <div className="space-y-6">
              <div className="text-center border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-800">ORÇAMENTO #{formatarNumeroOrcamento(numeroOrcamento)}</h1>
                <p className="text-sm text-gray-500 mt-1">Data: {dataHoje}</p>
                {validade && (<p className="text-sm text-red-600 mt-1 font-medium">Válido até: {formatarDataBR(validade)}</p>)}
              </div>

              <div className="border-b pb-4">
                <h2 className="text-sm text-gray-500 uppercase">De</h2>
                <p className="text-lg font-semibold text-gray-800">{empresa}</p>
                <p className="text-gray-600">{telefone}</p>
                {perfilCompleto?.email_empresa && <p className="text-gray-600 text-sm">{perfilCompleto.email_empresa}</p>}
                {perfilCompleto?.endereco && <p className="text-gray-600 text-sm">{perfilCompleto.endereco}</p>}
                {perfilCompleto?.documento && <p className="text-gray-600 text-sm">CNPJ/CPF: {perfilCompleto.documento}</p>}
              </div>

              <div className="border-b pb-4">
                <h2 className="text-sm text-gray-500 uppercase">Para</h2>
                <p className="text-lg font-semibold text-gray-800">{cliente}</p>
                {clienteTelefone && <p className="text-gray-600">📱 {clienteTelefone}</p>}
                {email && <p className="text-gray-600 text-sm">{email}</p>}
                {clienteDocumento && <p className="text-gray-600 text-sm">CPF/CNPJ: {clienteDocumento}</p>}
                {clienteEndereco && <p className="text-gray-600 text-sm">{clienteEndereco}</p>}
              </div>

              <div className="border-b pb-4">
                <h2 className="text-sm text-gray-500 uppercase mb-3">Itens</h2>
                <div className="space-y-3">
                  {itens.map((item, index) => {
                    const sub = calcularSubtotal(item);
                    const unidade = unidadeFinal(item);
                    return (
                      <div key={index} className="pb-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex justify-between text-gray-700">
                          <span className="font-medium">{item.produto}</span>
                          <span className="font-semibold text-gray-900">R$ {sub.toFixed(2)}</span>
                        </div>
                        {item.descricao && (<p className="text-sm text-gray-500 mt-1">{item.descricao}</p>)}
                        <p className="text-xs text-gray-400 mt-1">{item.quantidade} {unidade} × R$ {Number(item.valor).toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 border-b pb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {valorDesconto > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>{descontoTipo === "percentual" ? `Desconto (${descontoNumero}%)` : "Desconto"}</span>
                    <span>- R$ {valorDesconto.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center bg-blue-50 rounded-lg p-4">
                <span className="text-lg font-semibold text-gray-700">Total</span>
                <span className="text-2xl font-bold text-blue-600">R$ {totalGeral.toFixed(2)}</span>
              </div>

              {observacoes && observacoes.trim() !== "" && (
                <div className="border-t pt-4">
                  <h2 className="text-sm text-gray-500 uppercase mb-2">Observações</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{observacoes}</p>
                </div>
              )}

              {mensagem && <div className="text-center text-sm py-2">{mensagem}</div>}

              {/* BOTÕES DE AÇÃO */}
              <div className="space-y-2">
                {clienteTelefone && (
                  <button
                    onClick={enviarWhatsApp}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    💬 Enviar por WhatsApp
                  </button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={baixarPDF} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                    📄 Baixar PDF
                  </button>
                  <button onClick={novoOrcamento} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors">
                    {modoEdicao ? "Voltar" : "Novo Orçamento"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}