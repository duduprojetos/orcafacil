import Link from "next/link";

export const metadata = {
  title: "Termos de Uso — OrçaFácil",
  description: "Termos e condições de uso da plataforma OrçaFácil.",
};

const secoes = [
  {
    titulo: "1. Aceitação dos termos",
    texto: "Ao criar uma conta ou utilizar o OrçaFácil, você declara que leu e concorda com estes Termos de Uso e com a nossa Política de Privacidade. Caso não concorde, não utilize a plataforma.",
  },
  {
    titulo: "2. Sobre o serviço",
    texto: "O OrçaFácil é uma ferramenta para criar, armazenar e compartilhar orçamentos. A plataforma auxilia na apresentação das propostas, mas não participa da contratação, do pagamento ou da execução dos produtos e serviços negociados entre usuários e seus clientes.",
  },
  {
    titulo: "3. Conta e segurança",
    texto: "Você é responsável por fornecer informações verdadeiras, manter sua senha em segurança e por todas as atividades realizadas em sua conta. Avise-nos caso identifique acesso não autorizado. A conta é pessoal e não deve ser cedida a terceiros.",
  },
  {
    titulo: "4. Responsabilidades do usuário",
    texto: "Você é responsável pelo conteúdo dos orçamentos, pelos dados de clientes inseridos e pelo cumprimento das obrigações fiscais, comerciais e legais aplicáveis à sua atividade. Só insira dados pessoais quando possuir uma base legal válida e os utilize exclusivamente para a finalidade informada ao titular.",
  },
  {
    titulo: "5. Uso permitido",
    texto: "É proibido usar o OrçaFácil para atividades ilegais, fraudes, envio de conteúdo ofensivo ou enganoso, violação de direitos de terceiros, tentativa de acesso indevido, exploração de falhas ou ações que prejudiquem a disponibilidade e a segurança da plataforma.",
  },
  {
    titulo: "6. Disponibilidade e alterações",
    texto: "Buscamos manter o serviço disponível e seguro, mas ele pode sofrer interrupções, manutenções ou alterações. Funcionalidades podem ser adicionadas, modificadas ou removidas. Quando uma mudança relevante afetar estes termos, a data de atualização será revisada.",
  },
  {
    titulo: "7. Planos e pagamentos",
    texto: "Recursos gratuitos e pagos podem ter limites diferentes. Quando houver contratação de um plano pago, preço, periodicidade, renovação e condições de cancelamento serão apresentados antes da confirmação da compra.",
  },
  {
    titulo: "8. Propriedade intelectual",
    texto: "A marca, o código, o design e os demais elementos do OrçaFácil são protegidos pela legislação aplicável. Você mantém os direitos e a responsabilidade sobre os conteúdos que insere e nos autoriza a processá-los apenas para prestar o serviço.",
  },
  {
    titulo: "9. Limitação de responsabilidade",
    texto: "Na medida permitida pela lei, o OrçaFácil não se responsabiliza por negociações, inadimplementos, perdas indiretas ou decisões tomadas com base nos orçamentos. Cabe ao usuário revisar todas as informações antes de enviar uma proposta ao cliente.",
  },
  {
    titulo: "10. Encerramento",
    texto: "Você pode deixar de usar o serviço a qualquer momento e solicitar a exclusão dos seus dados conforme a Política de Privacidade. Poderemos suspender contas que violem estes termos, preservado o cumprimento de obrigações legais.",
  },
  {
    titulo: "11. Legislação e contato",
    texto: "Estes termos são regidos pelas leis brasileiras. Dúvidas, solicitações ou questões relacionadas ao uso da plataforma podem ser enviadas pelo formulário disponível na página de Política de Privacidade.",
  },
];

export default function Termos() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-lg font-bold text-black shadow-lg shadow-green-500/30">O</div>
            <span className="text-xl font-bold">OrçaFácil</span>
          </Link>
          <Link href="/" className="px-4 py-2 font-medium text-gray-400 transition-colors hover:text-white">
            ← Voltar ao início
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold sm:text-4xl">Termos de Uso</h1>
        <p className="mb-10 text-gray-400">Última atualização: 24 de agosto de 2026</p>

        <div className="space-y-8 leading-relaxed text-gray-300">
          {secoes.map((secao) => (
            <section key={secao.titulo}>
              <h2 className="mb-2 text-xl font-bold text-white">{secao.titulo}</h2>
              <p>{secao.texto}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <p className="text-gray-300">Consulte também como tratamos e protegemos os seus dados.</p>
          <Link href="/privacidade" className="mt-4 inline-block rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 px-5 py-2.5 font-semibold text-black">
            Política de Privacidade
          </Link>
        </div>
      </main>
    </div>
  );
}
