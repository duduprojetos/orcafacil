"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Perfil() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [uploadandoLogo, setUploadandoLogo] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [perfilExiste, setPerfilExiste] = useState(false);

  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [emailEmpresa, setEmailEmpresa] = useState("");
  const [endereco, setEndereco] = useState("");
  const [documento, setDocumento] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

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
    setCarregando(false);
  }

  async function carregarPerfil(userId) {
    const { data, error } = await supabase
      .from("perfis")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao carregar perfil:", error);
      return;
    }

    if (data) {
      setNomeEmpresa(data.nome_empresa || "");
      setTelefone(data.telefone || "");
      setEmailEmpresa(data.email_empresa || "");
      setEndereco(data.endereco || "");
      setDocumento(data.documento || "");
      setLogoUrl(data.logo_url || "");
      setPerfilExiste(true);
    }
  }

  async function fazerUploadLogo(arquivo) {
    if (!arquivo) return;

    // Validação de tipo
    const tiposPermitidos = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!tiposPermitidos.includes(arquivo.type)) {
      setMensagem("❌ Apenas imagens PNG, JPG ou WEBP");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    // Validação de tamanho (2MB)
    if (arquivo.size > 2 * 1024 * 1024) {
      setMensagem("❌ Imagem muito grande. Máximo 2MB");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    setUploadandoLogo(true);
    setMensagem("");

    // Se já tem logo, apaga a antiga primeiro
    if (logoUrl) {
      const urlAntiga = logoUrl.split("/logos/")[1];
      if (urlAntiga) {
        await supabase.storage.from("logos").remove([urlAntiga]);
      }
    }

    // Extensão do arquivo
    const extensao = arquivo.name.split(".").pop();
    const nomeArquivo = `${usuario.id}/logo-${Date.now()}.${extensao}`;

    // Upload
    const { error: erroUpload } = await supabase.storage
      .from("logos")
      .upload(nomeArquivo, arquivo, {
        cacheControl: "3600",
        upsert: false,
      });

    if (erroUpload) {
      setMensagem("❌ Erro ao enviar: " + erroUpload.message);
      setUploadandoLogo(false);
      return;
    }

    // Pega a URL pública
    const { data: urlData } = supabase.storage
      .from("logos")
      .getPublicUrl(nomeArquivo);

    setLogoUrl(urlData.publicUrl);
    setUploadandoLogo(false);
    setMensagem("✅ Logo enviada! Não esqueça de salvar o perfil.");
  }

  async function removerLogo() {
    const confirmar = confirm("Tem certeza que deseja remover a logo?");
    if (!confirmar) return;

    // Apaga do Storage
    if (logoUrl) {
      const urlAntiga = logoUrl.split("/logos/")[1];
      if (urlAntiga) {
        await supabase.storage.from("logos").remove([urlAntiga]);
      }
    }

    setLogoUrl("");
    setMensagem("Logo removida. Salve o perfil para confirmar.");
    setTimeout(() => setMensagem(""), 3000);
  }

  async function salvarPerfil(e) {
    e.preventDefault();
    setSalvando(true);
    setMensagem("");

    const dadosPerfil = {
      nome_empresa: nomeEmpresa,
      telefone: telefone,
      email_empresa: emailEmpresa,
      endereco: endereco,
      documento: documento,
      logo_url: logoUrl,
      user_id: usuario.id,
    };

    let resultado;

    if (perfilExiste) {
      resultado = await supabase
        .from("perfis")
        .update(dadosPerfil)
        .eq("user_id", usuario.id);
    } else {
      resultado = await supabase
        .from("perfis")
        .insert([dadosPerfil]);
      setPerfilExiste(true);
    }

    setSalvando(false);

    if (resultado.error) {
      setMensagem("❌ Erro ao salvar: " + resultado.error.message);
      return;
    }

    setMensagem("✅ Perfil salvo com sucesso!");
    setTimeout(() => setMensagem(""), 3000);
  }

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Barra superior com navegação */}
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2 text-sm">
          <span className="text-gray-600">👤 {usuario?.email}</span>
          <div className="flex gap-4 items-center">
            <Link href="/app" className="text-gray-700 hover:text-blue-600 font-medium">
              ➕ Novo Orçamento
            </Link>
            <Link href="/orcamentos" className="text-gray-700 hover:text-blue-600 font-medium">
              📄 Orçamentos
            </Link>
            <button onClick={sair} className="text-red-600 hover:text-red-800 font-medium">Sair</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">⚙️ Meu Perfil</h1>
            <p className="text-gray-500 mt-2">
              Configure os dados da sua empresa uma vez só. Eles serão preenchidos automaticamente nos orçamentos.
            </p>
          </div>

          <form onSubmit={salvarPerfil} className="space-y-6">

            {/* UPLOAD DE LOGO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo da empresa
                <span className="text-xs text-gray-400 font-normal ml-2">(opcional)</span>
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                {logoUrl ? (
                  <div className="space-y-3">
                    <img
                      src={logoUrl}
                      alt="Logo da empresa"
                      className="max-h-32 mx-auto object-contain"
                    />
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadandoLogo}
                        className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {uploadandoLogo ? "Enviando..." : "🔄 Trocar logo"}
                      </button>
                      <button
                        type="button"
                        onClick={removerLogo}
                        className="text-sm bg-red-100 hover:bg-red-200 text-red-700 font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        🗑️ Remover
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-4xl">🖼️</div>
                    <p className="text-gray-600 text-sm">
                      Adicione uma logo para aparecer nos seus PDFs
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadandoLogo}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {uploadandoLogo ? "Enviando..." : "📤 Escolher imagem"}
                    </button>
                    <p className="text-xs text-gray-400">PNG, JPG ou WEBP · Máx 2MB</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => fazerUploadLogo(e.target.files?.[0])}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da empresa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Reformas do João"
                value={nomeEmpresa}
                onChange={(e) => setNomeEmpresa(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
              <input
                type="text"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail da empresa</label>
              <input
                type="email"
                placeholder="contato@suaempresa.com"
                value={emailEmpresa}
                onChange={(e) => setEmailEmpresa(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
              <input
                type="text"
                placeholder="Rua, número, bairro, cidade"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ / CPF</label>
              <input
                type="text"
                placeholder="00.000.000/0000-00 ou 000.000.000-00"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {mensagem && (
              <div className={`text-center text-sm py-3 rounded-lg ${
                mensagem.startsWith("✅")
                  ? "bg-green-50 text-green-700"
                  : mensagem.startsWith("❌")
                    ? "bg-red-50 text-red-700"
                    : "bg-blue-50 text-blue-700"
              }`}>
                {mensagem}
              </div>
            )}

            <button
              type="submit"
              disabled={salvando}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {salvando ? "Salvando..." : perfilExiste ? "Atualizar Perfil" : "Salvar Perfil"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}