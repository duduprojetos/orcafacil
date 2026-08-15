import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* MENU */}
      <header className="border-b border-white/5 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-green-500/30">
              O
            </div>
            <span className="text-xl font-bold text-white">OrçaFácil</span>
          </div>
          <div className="flex gap-2 items-center">
            <Link
              href="/login"
              className="text-gray-400 hover:text-white font-medium px-4 py-2 transition-colors hidden sm:block"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-black font-semibold px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 hover:-translate-y-0.5"
            >
              Testar grátis
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,197,94,0.15),transparent_50%)]"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-green-500 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute top-20 -right-40 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-20"></div>

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-green-400 text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Novo · Beta aberto
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.05] tracking-tight">
                Mande o orçamento<br />
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
                  antes do concorrente.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Enquanto você formata tabela no Word, seu cliente já fechou com outro.
                Faça orçamentos profissionais em PDF — direto do celular, em 1 minuto.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-black font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 hover:-translate-y-1"
                >
                  Fazer meu primeiro orçamento
                </Link>
              </div>

              <div className="flex items-center gap-2 justify-center lg:justify-start text-sm text-gray-500">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Sem cartão · Cadastro em 30 segundos
              </div>
            </div>

            {/* Mockup do PDF */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl blur-3xl opacity-30 scale-95"></div>

              <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 md:p-8">
                <div className="text-center border-b border-white/10 pb-4 mb-4">
                  <h3 className="text-2xl font-bold text-white">ORÇAMENTO</h3>
                  <p className="text-sm text-gray-500">Nº 0042 · 15/08/2026</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">De</p>
                    <p className="font-semibold text-white">Reformas do João</p>
                    <p className="text-gray-400">(11) 99999-9999</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Para</p>
                    <p className="font-semibold text-white">Ana Santos</p>
                    <p className="text-gray-400">ana@email.com</p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mb-4">
                  <p className="text-xs text-gray-500 uppercase mb-2">Itens</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Pintura sala (25m²)</span>
                      <span className="font-medium text-white">R$ 850,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Material</span>
                      <span className="font-medium text-white">R$ 320,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Deslocamento</span>
                      <span className="font-medium text-white">R$ 80,00</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 flex justify-between items-center">
                  <span className="font-semibold text-gray-300">Total</span>
                  <span className="text-2xl font-bold text-green-400">R$ 1.250,00</span>
                </div>

                <div className="mt-4 flex justify-center">
                  <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium px-4 py-2 rounded-lg">
                    ✓ Pronto para enviar
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl px-4 py-2 hidden md:block">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="text-xs text-gray-500">Criado em</p>
                    <p className="text-sm font-bold text-white">47 segundos</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMPARAÇÃO */}
      <section className="py-24 bg-[#0f0f0f] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-block bg-white/5 border border-white/10 text-green-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Comparação honesta
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
              A diferença é <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">gritante.</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Sério, não tem competição.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="text-left p-4 text-gray-500 text-sm font-medium"></th>
                  <th className="text-center p-4">
                    <div className="text-gray-400 text-sm font-medium mb-1">Do jeito antigo</div>
                    <div className="text-lg font-bold text-white">Word / Excel 😴</div>
                  </th>
                  <th className="text-center p-4">
                    <div className="text-gray-400 text-sm font-medium mb-1">Do jeito antigo</div>
                    <div className="text-lg font-bold text-white">Papel e caneta ✍️</div>
                  </th>
                  <th className="text-center p-4 bg-gradient-to-b from-green-500/10 to-transparent border-t border-l border-r border-green-500/30 rounded-t-2xl">
                    <div className="text-green-400 text-sm font-bold mb-1">RECOMENDADO</div>
                    <div className="text-lg font-bold text-white">OrçaFácil 🚀</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { feature: "Tempo por orçamento", word: "~30 min", papel: "~20 min", nosso: "~1 min" },
                  { feature: "Funciona no celular", word: "🥲", papel: "🤷", nosso: "✅" },
                  { feature: "Cálculo automático", word: "❌", papel: "❌", nosso: "✅" },
                  { feature: "PDF profissional", word: "😬", papel: "❌", nosso: "✅" },
                  { feature: "Histórico organizado", word: "😵‍💫", papel: "🗑️", nosso: "✅" },
                  { feature: "Cliente impressionado", word: "❌", papel: "❌", nosso: "✅" },
                ].map((row, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="p-4 text-gray-300 font-medium">{row.feature}</td>
                    <td className="p-4 text-center text-gray-400">{row.word}</td>
                    <td className="p-4 text-center text-gray-400">{row.papel}</td>
                    <td className="p-4 text-center text-green-400 font-semibold bg-gradient-to-b from-green-500/5 to-transparent border-l border-r border-green-500/30">
                      {row.nosso}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="p-4"></td>
                  <td className="p-4"></td>
                  <td className="p-4"></td>
                  <td className="p-4 bg-gradient-to-b from-transparent to-green-500/10 border-l border-r border-b border-green-500/30 rounded-b-2xl">
                    <Link
                      href="/login"
                      className="block text-center bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-black font-semibold py-3 rounded-lg transition-all shadow-lg shadow-green-500/30"
                    >
                      Experimentar
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8 italic">
            * Sim, colocamos "papel e caneta" na comparação. É sério.
          </p>
        </div>
      </section>

      {/* 3 RECURSOS PRINCIPAIS */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.08),transparent_70%)]"></div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-block bg-white/5 border border-white/10 text-green-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Como funciona
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Simples do jeito certo.
            </h2>
            <p className="text-gray-400 text-lg">
              Sem menu confuso. Sem 500 configurações. Só o que importa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="group bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-3xl p-8 hover:border-green-500/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                📱
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Funciona no celular</h3>
              <p className="text-gray-400 leading-relaxed">
                Chegou no cliente? Já sai com o orçamento pronto. Sem depender do PC em casa.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-3xl p-8 hover:border-green-500/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                📄
              </div>
              <h3 className="text-xl font-bold text-white mb-3">PDF profissional</h3>
              <p className="text-gray-400 leading-relaxed">
                Layout limpo que passa credibilidade. Manda no WhatsApp e fecha mais rápido.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-3xl p-8 hover:border-green-500/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                🗂️
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Histórico salvo</h3>
              <p className="text-gray-400 leading-relaxed">
                Todos seus orçamentos ficam guardados. Achou o cliente antigo? Reabre e reenvia.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="py-24 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <div className="inline-block bg-white/5 border border-white/10 text-green-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Para quem é
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Feito para quem <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">vende serviço.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { emoji: "🔧", texto: "Reformas" },
              { emoji: "🎨", texto: "Design" },
              { emoji: "🍰", texto: "Confeitaria" },
              { emoji: "💻", texto: "Consultoria" },
              { emoji: "📸", texto: "Fotografia" },
              { emoji: "🌱", texto: "Jardinagem" },
              { emoji: "✂️", texto: "Estética" },
              { emoji: "🚚", texto: "Fretes" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-xl p-4 text-center hover:border-green-500/30 transition-all"
              >
                <div className="text-2xl mb-1">{item.emoji}</div>
                <p className="text-sm font-medium text-gray-300">{item.texto}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            E qualquer outro profissional autônomo. Se você cobra por serviço, é pra você.
          </p>
        </div>
      </section>

      {/* PREÇOS */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.08),transparent_70%)]"></div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-block bg-white/5 border border-white/10 text-green-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Preços
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Preço que <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">cabe no bolso.</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Comece grátis. Evolua quando fizer sentido.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

            {/* FREE */}
            <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-3xl p-8 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎁</span>
                <h3 className="text-xl font-bold text-white">Grátis</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">Perfeito pra começar</p>

              <div className="mb-6">
                <span className="text-5xl font-bold text-white">R$ 0</span>
                <span className="text-gray-500 ml-1">/ para sempre</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>Até 5 orçamentos por mês</span>
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>PDF profissional</span>
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>Histórico completo</span>
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>Funciona no celular</span>
                </li>
                <li className="flex gap-3 text-gray-500">
                  <span className="text-gray-600 flex-shrink-0">✗</span>
                  <span>Logo no PDF</span>
                </li>
                <li className="flex gap-3 text-gray-500">
                  <span className="text-gray-600 flex-shrink-0">✗</span>
                  <span>Múltiplos usuários</span>
                </li>
              </ul>

              <Link
                href="/login"
                className="block text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Começar grátis
              </Link>
            </div>

            {/* PRO */}
            <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/5 border-2 border-green-500/50 rounded-3xl p-8 flex flex-col relative shadow-2xl shadow-green-500/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-black text-xs font-bold px-4 py-1 rounded-full shadow-lg shadow-green-500/50">
                  MAIS POPULAR
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚡</span>
                <h3 className="text-xl font-bold text-white">Pro</h3>
              </div>
              <p className="text-sm text-green-400 mb-6">Para profissionais sérios</p>

              <div className="mb-6">
                <span className="text-5xl font-bold text-white">R$ 19</span>
                <span className="text-gray-400 ml-1">/ mês</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex gap-3 text-white">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span className="font-semibold">Orçamentos ilimitados</span>
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>PDF personalizado (logo, cores)</span>
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>Histórico ilimitado</span>
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>Backup automático na nuvem</span>
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>Suporte por e-mail</span>
                </li>
                <li className="flex gap-3 text-gray-500">
                  <span className="text-gray-600 flex-shrink-0">✗</span>
                  <span>Múltiplos usuários</span>
                </li>
              </ul>

              <button
                disabled
                className="block text-center bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold py-3 rounded-xl transition-all shadow-lg shadow-green-500/30 opacity-60 cursor-not-allowed"
              >
                Em breve
              </button>
            </div>

            {/* BUSINESS */}
            <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-3xl p-8 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🚀</span>
                <h3 className="text-xl font-bold text-white">Business</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">Para equipes e empresas</p>

              <div className="mb-6">
                <span className="text-5xl font-bold text-white">R$ 49</span>
                <span className="text-gray-500 ml-1">/ mês</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex gap-3 text-white">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span className="font-semibold">Tudo do Pro</span>
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>Múltiplos usuários</span>
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>API para integração</span>
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>Relatórios avançados</span>
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>SLA garantido</span>
                </li>
              </ul>

              <button
                disabled
                className="block text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 rounded-xl transition-all opacity-60 cursor-not-allowed"
              >
                Em breve
              </button>
            </div>

          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            💡 Enquanto estamos em Beta, tudo é grátis. Aproveite.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#0f0f0f]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-white/5 border border-white/10 text-green-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Dúvidas comuns
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Vamos direto ao ponto.
            </h2>
          </div>

          <div className="space-y-4">

            <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">É grátis mesmo? Onde está a pegadinha?</h3>
              <p className="text-gray-400">
                Grátis de verdade, sem cartão de crédito. Enquanto estamos em Beta, todas as funções liberadas. Nossa aposta é: você usar, gostar, e virar cliente pago quando lançarmos o Pro.
              </p>
            </div>

            <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">Preciso instalar algo?</h3>
              <p className="text-gray-400">
                Não. Funciona direto no navegador do celular ou do PC. Sem download, sem instalação, sem "atualização importante às 3 da manhã".
              </p>
            </div>

            <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">Meus dados estão seguros?</h3>
              <p className="text-gray-400">
                Sim. Cada usuário só acessa os próprios orçamentos. Dados criptografados e armazenados em servidores da AWS (mesma infra do Netflix, Airbnb, etc.).
              </p>
            </div>

            <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">Consigo enviar por WhatsApp?</h3>
              <p className="text-gray-400">
                Baixe o PDF e envie por WhatsApp, e-mail, Telegram, pombo-correio. É um arquivo PDF comum, funciona em qualquer lugar.
              </p>
            </div>

            <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">E se eu quiser cancelar?</h3>
              <p className="text-gray-400">
                Cancela quando quiser, sem burocracia. Aliás, hoje nem tem o que cancelar — tá tudo grátis.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.1),transparent_70%)]"></div>

        <div className="relative max-w-4xl mx-auto px-6">
          <div className="relative bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-600/10 border border-green-500/20 rounded-3xl p-12 md:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,197,94,0.2),transparent_70%)]"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-3xl opacity-20 -translate-y-32 translate-x-32"></div>

            <div className="relative text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                Seu próximo cliente<br />
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">está esperando.</span>
              </h2>
              <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-xl mx-auto">
                E provavelmente já mandou WhatsApp pra três concorrentes. Chega junto.
              </p>
              <Link
                href="/login"
                className="inline-block bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-black font-bold px-10 py-5 rounded-xl text-lg transition-all shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 hover:-translate-y-1"
              >
                Começar agora →
              </Link>
              <p className="text-gray-500 text-sm mt-6">
                Grátis · Sem cartão · Cadastro em 30 segundos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="border-t border-white/5 py-10 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-black font-bold shadow-lg shadow-green-500/30">
              O
            </div>
            <span className="text-lg font-bold text-white">OrçaFácil</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 OrçaFácil · Feito no Brasil 🇧🇷
          </p>
        </div>
      </footer>

    </div>
  );
}