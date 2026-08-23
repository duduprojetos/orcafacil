"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Privacidade() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("duvida");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  async function enviarSolicitacao(e) {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !email.trim()) {
      setErro("Preencha nome e e-mail.");
      return;
    }

    setEnviando(true);

    const { error } = await supabase.from("solicitacoes_privacidade").insert({
      nome: nome.trim(),
      email: email.trim(),
      tipo_solicitacao: tipo,
      mensagem: mensagem.trim() || null,
    });

    setEnviando(false);

    if (error) {
      setErro("Não foi possível enviar sua solicitação. Tente novamente em instantes.");
      return;
    }

    setEnviado(true);
    setNome("");
    setEmail("");
    setMensagem("");
    setTipo("duvida");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* MENU */}
      <header className="border-b border-white/5 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-green-500/30">
              O
            </div>
            <span className="text-xl font-bold text-white">OrçaFácil</span>
          </Link>
          <Link
            href="/"
            className="text-gray-400 hover:text-white font-medium px-4 py-2 transition-colors"
          >
            ← Voltar ao início
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-gray-400 mb-10">Última atualização: 22 de agosto de 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Quem somos</h2>
            <p>
              O OrçaFácil é uma ferramenta para criação e envio de orçamentos, operada por
              pessoa física, atuando como controladora dos dados pessoais tratados nesta
              plataforma, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 —
              LGPD).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Quais dados coletamos</h2>
            <p className="mb-2">
              Coletamos e armazenamos dois grupos de dados:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Dados de quem usa a plataforma</strong> (dono da
                conta): nome, e-mail, telefone, logo, endereço e documento (CNPJ/CPF), quando
                informados no perfil.
              </li>
              <li>
                <strong className="text-white">Dados de clientes finais</strong>, inseridos pelo
                usuário da plataforma ao criar um orçamento: nome, telefone, e-mail, endereço e
                documento do cliente para quem o orçamento é destinado.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Por que coletamos esses dados</h2>
            <p>
              Os dados são usados exclusivamente para permitir o funcionamento da ferramenta:
              gerar orçamentos, exibi-los para o cliente final através de um link, e permitir que
              esse cliente aprove ou recuse o orçamento recebido.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Com quem compartilhamos</h2>
            <p>
              Não vendemos nem compartilhamos dados com terceiros para fins de marketing. Os
              dados ficam armazenados em nosso banco de dados (Supabase) e a aplicação é hospedada
              na Vercel — ambos atuando como operadores técnicos, apenas armazenando e
              processando os dados sob nossa responsabilidade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. Seus direitos</h2>
            <p className="mb-2">
              Nos termos da LGPD, você pode solicitar, a qualquer momento:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Confirmação de que tratamos seus dados;</li>
              <li>Acesso aos dados que temos sobre você;</li>
              <li>Correção de dados incompletos ou desatualizados;</li>
              <li>Exclusão dos seus dados pessoais;</li>
              <li>Informações sobre com quem compartilhamos seus dados.</li>
            </ul>
            <p className="mt-2">
              Hoje essas solicitações são analisadas manualmente e respondidas em até 15 dias.
              Use o formulário abaixo para fazer um pedido.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">6. Segurança</h2>
            <p>
              Adotamos medidas técnicas para proteger os dados armazenados, incluindo controle de
              acesso por conta e políticas de segurança no banco de dados. Nenhum sistema é
              inteiramente livre de risco, e trabalhamos continuamente para reduzir
              vulnerabilidades.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">7. Contato</h2>
            <p>
              Para dúvidas, solicitações sobre seus dados, ou qualquer outro assunto relacionado a
              privacidade, use o formulário abaixo.
            </p>
          </section>
        </div>

        {/* FORMULÁRIO */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-1">Fale conosco sobre seus dados</h2>
          <p className="text-gray-400 mb-6 text-sm">
            Envie sua dúvida ou solicitação. Respondemos em até 15 dias.
          </p>

          {enviado ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-5 text-center">
              <p className="text-green-400 font-semibold text-lg mb-1">
                ✅ Solicitação enviada!
              </p>
              <p className="text-gray-300 text-sm">
                Recebemos seu pedido e vamos responder em breve.
              </p>
            </div>
          ) : (
            <form onSubmit={enviarSolicitacao} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tipo de solicitação
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                >
                  <option value="duvida">Dúvida geral</option>
                  <option value="acesso">Quero acessar meus dados</option>
                  <option value="correcao">Quero corrigir meus dados</option>
                  <option value="exclusao">Quero excluir meus dados</option>
                  <option value="outro">Outro assunto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Mensagem (opcional)
                </label>
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500 resize-none"
                  placeholder="Conte mais detalhes, se quiser."
                />
              </div>

              {erro && (
                <p className="text-red-400 text-sm">{erro}</p>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-black font-semibold px-6 py-3 rounded-lg transition-all shadow-lg shadow-green-500/30 disabled:opacity-50"
              >
                {enviando ? "Enviando..." : "Enviar solicitação"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}