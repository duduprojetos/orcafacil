import Link from "next/link";

function Carimbo({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-black/15 text-black text-xs font-semibold uppercase tracking-[0.14em] px-3 py-1.5 rounded-full bg-white ${className}`}
    >
      {children}
    </span>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden antialiased">

      {/* MENU */}
      <header className="border-b border-zinc-200 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
              O
            </div>
            <span className="text-xl font-bold tracking-tight">OrçaFácil</span>
          </div>
          <div className="flex gap-2 items-center">
            <Link
              href="/login"
              className="text-zinc-500 hover:text-black font-medium px-4 py-2 transition-colors hidden sm:block"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="bg-black hover:bg-zinc-800 text-white font-semibold px-5 py-2.5 rounded-lg transition-all"
            >
              Testar grátis
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            <div className="text-center lg:text-left">
              <Carimbo className="mb-6">Beta aberto</Carimbo>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.05] tracking-tight">
                Mande o orçamento<br />
                <span className="font-normal text-zinc-500">
                  antes do concorrente.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-zinc-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Enquanto você formata tabela no Word, seu cliente já fechou com outro.
                Faça orçamentos profissionais em PDF — direto do celular, em 1 minuto.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                <Link
                  href="/login"
                  className="bg-black hover:bg-zinc-800 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all text-center"
                >
                  Fazer meu primeiro orçamento
                </Link>
              </div>

              <p className="text-sm text-zinc-500">
                Sem cartão · Cadastro em 30 segundos
              </p>
            </div>

            {/* Mockup do orçamento */}
            <div className="relative">
              <div className="absolute inset-0 bg-black rounded-xl translate-x-3 translate-y-3 opacity-[0.04]"></div>

              <div className="relative bg-white rounded-xl shadow-xl border border-zinc-200 p-6 md:p-8">
                <div className="text-center border-b border-dashed border-zinc-200 pb-4 mb-4">
                  <h3 className="text-2xl font-bold tracking-tight">ORÇAMENTO</h3>
                  <p className="text-sm text-zinc-500 font-mono">Nº 0042 · 15/08/2026</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">De</p>
                    <p className="font-semibold">Reformas do João</p>
                    <p className="text-zinc-500">(11) 99999-9999</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Para</p>
                    <p className="font-semibold">Ana Santos</p>
                    <p className="text-zinc-500">ana@email.com</p>
                  </div>
                </div>

                <div className="border-t border-zinc-200 pt-4 mb-4">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Itens</p>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Pintura sala (25m²)</span>
                      <span className="font-medium">R$ 850,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Material</span>
                      <span className="font-medium">R$ 320,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Deslocamento</span>
                      <span className="font-medium">R$ 80,00</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 flex justify-between items-center">
                  <span className="font-semibold text-zinc-500">Total</span>
                  <span className="text-2xl font-bold font-mono">R$ 1.250,00</span>
                </div>

                <div className="mt-5 flex justify-center">
                  <Carimbo>Aprovado</Carimbo>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-black text-white rounded-lg shadow-xl px-4 py-2.5 hidden md:block">
                <p className="text-[10px] uppercase tracking-widest text-white/60">Criado em</p>
                <p className="text-sm font-semibold font-mono">47 segundos</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMPARAÇÃO */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <Carimbo className="mb-4">Comparação honesta</Carimbo>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              A diferença é <span className="font-normal text-zinc-500">gritante.</span>
            </h2>
            <p className="text-zinc-600 text-lg">
              Sério, não tem competição.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto border-collapse bg-white rounded-xl overflow-hidden border border-zinc-200">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left p-4 text-zinc-500 text-sm font-medium"></th>
                  <th className="text-center p-4">
                    <div className="text-zinc-500 text-sm font-medium mb-1">Do jeito antigo</div>
                    <div className="text-base font-semibold">Word / Excel</div>
                  </th>
                  <th className="text-center p-4">
                    <div className="text-zinc-500 text-sm font-medium mb-1">Do jeito antigo</div>
                    <div className="text-base font-semibold">Papel e caneta</div>
                  </th>
                  <th className="text-center p-4 bg-zinc-50">
                    <div className="text-black text-xs font-bold uppercase tracking-widest mb-1">Recomendado</div>
                    <div className="text-base font-semibold">OrçaFácil</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-mono">
                {[
                  { feature: "Tempo por orçamento", word: "~30 min", papel: "~20 min", nosso: "~1 min" },
                  { feature: "Funciona no celular", word: "Limitado", papel: "Não", nosso: "Sim" },
                  { feature: "Cálculo automático", word: "Não", papel: "Não", nosso: "Sim" },
                  { feature: "PDF profissional", word: "Às vezes", papel: "Não", nosso: "Sim" },
                  { feature: "Histórico organizado", word: "Confuso", papel: "Se perde", nosso: "Sim" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-zinc-200">
                    <td className="p-4 text-black font-sans font-medium">{row.feature}</td>
                    <td className="p-4 text-center text-zinc-500">{row.word}</td>
                    <td className="p-4 text-center text-zinc-500">{row.papel}</td>
                    <td className="p-4 text-center font-semibold text-black bg-zinc-50">
                      {row.nosso}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="p-4"></td>
                  <td className="p-4"></td>
                  <td className="p-4"></td>
                  <td className="p-4 bg-zinc-50">
                    <Link
                      href="/login"
                      className="block text-center bg-black hover:bg-zinc-800 text-white font-semibold py-3 rounded-lg transition-all font-sans"
                    >
                      Experimentar
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3 RECURSOS PRINCIPAIS */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <Carimbo className="mb-4">Como funciona</Carimbo>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Simples do jeito certo.
            </h2>
            <p className="text-zinc-600 text-lg">
              Sem menu confuso. Sem 500 configurações. Só o que importa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 rounded-xl overflow-hidden">

            {[
              { titulo: "Funciona no celular", texto: "Chegou no cliente? Já sai com o orçamento pronto. Sem depender do PC em casa." },
              { titulo: "PDF profissional", texto: "Layout limpo que passa credibilidade. Manda no WhatsApp e fecha mais rápido." },
              { titulo: "Histórico salvo", texto: "Todos seus orçamentos ficam guardados. Achou o cliente antigo? Reabre e reenvia." },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8">
                <p className="text-xs text-black font-bold mb-4 font-mono">
                  0{i + 1}
                </p>
                <h3 className="text-xl font-bold mb-3">{item.titulo}</h3>
                <p className="text-zinc-600 leading-relaxed">
                  {item.texto}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <Carimbo className="mb-4">Para quem é</Carimbo>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Feito para quem <span className="font-normal text-zinc-500">vende serviço.</span>
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
                className="bg-white border border-zinc-200 rounded-lg p-4 text-center hover:border-black/20 transition-all"
              >
                <div className="text-2xl mb-1">{item.emoji}</div>
                <p className="text-sm font-medium">{item.texto}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-zinc-500 text-sm mt-8">
            E qualquer outro profissional autônomo. Se você cobra por serviço, é pra você.
          </p>
        </div>
      </section>

      {/* PREÇOS */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <Carimbo className="mb-4">Preços</Carimbo>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Preço que <span className="font-normal text-zinc-500">cabe no bolso.</span>
            </h2>
            <p className="text-zinc-600 text-lg">
              Comece grátis. Evolua quando fizer sentido.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

            {/* FREE */}
            <div className="bg-white border border-zinc-200 rounded-xl p-8 flex flex-col">
              <h3 className="text-xl font-bold mb-1">Grátis</h3>
              <p className="text-sm text-zinc-500 mb-6">Perfeito pra começar</p>

              <div className="mb-6 font-mono">
                <span className="text-4xl font-bold">R$ 0</span>
                <span className="text-zinc-500 ml-1 text-sm">/ para sempre</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1 text-sm">
                <li className="flex gap-3"><span>✓</span><span>Até 5 orçamentos por mês</span></li>
                <li className="flex gap-3"><span>✓</span><span>PDF profissional</span></li>
                <li className="flex gap-3"><span>✓</span><span>Histórico completo</span></li>
                <li className="flex gap-3"><span>✓</span><span>Funciona no celular</span></li>
                <li className="flex gap-3 text-zinc-400"><span>—</span><span>Logo no PDF</span></li>
                <li className="flex gap-3 text-zinc-400"><span>—</span><span>Múltiplos usuários</span></li>
              </ul>

              <Link
                href="/login"
                className="block text-center border border-black hover:bg-black hover:text-white font-semibold py-3 rounded-lg transition-all"
              >
                Começar grátis
              </Link>
            </div>

            {/* PRO */}
            <div className="bg-black text-white rounded-xl p-8 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-white text-black text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                  Mais popular
                </span>
              </div>

              <h3 className="text-xl font-bold mb-1">Pro</h3>
              <p className="text-sm text-white/60 mb-6">Para profissionais sérios</p>

              <div className="mb-6 font-mono">
                <span className="text-4xl font-bold">R$ 19</span>
                <span className="text-white/60 ml-1 text-sm">/ mês</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1 text-sm">
                <li className="flex gap-3"><span>✓</span><span className="font-semibold">Orçamentos ilimitados</span></li>
                <li className="flex gap-3"><span>✓</span><span>PDF personalizado (logo, cores)</span></li>
                <li className="flex gap-3"><span>✓</span><span>Histórico ilimitado</span></li>
                <li className="flex gap-3"><span>✓</span><span>Backup automático na nuvem</span></li>
                <li className="flex gap-3"><span>✓</span><span>Suporte por e-mail</span></li>
                <li className="flex gap-3 text-white/40"><span>—</span><span>Múltiplos usuários</span></li>
              </ul>

              <button
                disabled
                className="block text-center bg-white/10 border border-white/20 font-semibold py-3 rounded-lg opacity-70 cursor-not-allowed w-full"
              >
                Em breve
              </button>
            </div>

            {/* BUSINESS */}
            <div className="bg-white border border-zinc-200 rounded-xl p-8 flex flex-col">
              <h3 className="text-xl font-bold mb-1">Business</h3>
              <p className="text-sm text-zinc-500 mb-6">Para equipes e empresas</p>

              <div className="mb-6 font-mono">
                <span className="text-4xl font-bold">R$ 49</span>
                <span className="text-zinc-500 ml-1 text-sm">/ mês</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1 text-sm">
                <li className="flex gap-3"><span>✓</span><span className="font-semibold">Tudo do Pro</span></li>
                <li className="flex gap-3"><span>✓</span><span>Múltiplos usuários</span></li>
                <li className="flex gap-3"><span>✓</span><span>API para integração</span></li>
                <li className="flex gap-3"><span>✓</span><span>Relatórios avançados</span></li>
                <li className="flex gap-3"><span>✓</span><span>Suporte prioritário</span></li>
              </ul>

              <button
                disabled
                className="block text-center bg-zinc-50 border border-zinc-200 font-semibold py-3 rounded-lg opacity-70 cursor-not-allowed w-full"
              >
                Em breve
              </button>
            </div>

          </div>

          <p className="text-center text-zinc-500 text-sm mt-8">
            Enquanto estamos em Beta, tudo é grátis. Aproveite.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <Carimbo className="mb-4">Dúvidas comuns</Carimbo>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Vamos direto ao ponto.
            </h2>
          </div>

          <div className="divide-y divide-zinc-200 border-y border-zinc-200 bg-white rounded-xl px-6">

            {[
              { p: "É grátis mesmo? Onde está a pegadinha?", r: "Grátis de verdade, sem cartão de crédito. Enquanto estamos em Beta, todas as funções liberadas. Nossa aposta é: você usar, gostar, e virar cliente pago quando lançarmos o Pro." },
              { p: "Preciso instalar algo?", r: "Não. Funciona direto no navegador do celular ou do PC. Sem download, sem instalação." },
              { p: "Meus dados estão seguros?", r: "Sim. Cada usuário só acessa os próprios orçamentos, com controle de acesso reforçado no banco de dados." },
              { p: "Consigo enviar por WhatsApp?", r: "Baixe o PDF e envie por WhatsApp, e-mail, ou qualquer outro canal. É um arquivo PDF comum." },
              { p: "E se eu quiser cancelar?", r: "Cancela quando quiser, sem burocracia. Aliás, hoje nem tem o que cancelar — tá tudo grátis." },
            ].map((item, i) => (
              <div key={i} className="py-6">
                <h3 className="text-lg font-bold mb-2">{item.p}</h3>
                <p className="text-zinc-600 leading-relaxed">{item.r}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative bg-black text-white rounded-xl p-12 md:p-16 text-center overflow-hidden">
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
                Seu próximo cliente<br />
                <span className="font-normal text-zinc-400">está esperando.</span>
              </h2>
              <p className="text-white/60 text-lg md:text-xl mb-8 max-w-xl mx-auto">
                E provavelmente já mandou WhatsApp pra três concorrentes. Chega junto.
              </p>
              <Link
                href="/login"
                className="inline-block bg-white text-black font-semibold px-10 py-5 rounded-lg text-lg transition-all hover:bg-zinc-100"
              >
                Começar agora →
              </Link>
              <p className="text-white/40 text-sm mt-6">
                Grátis · Sem cartão · Cadastro em 30 segundos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="border-t border-zinc-200 py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
              O
            </div>
            <span className="text-lg font-bold">OrçaFácil</span>
          </div>
          <p className="text-zinc-500 text-sm mb-2">
            © 2026 OrçaFácil · Feito no Brasil
          </p>
          <Link href="/privacidade" className="text-zinc-500 text-sm underline hover:text-black">
            Política de Privacidade
          </Link>
        </div>
      </footer>

    </div>
  );
}
