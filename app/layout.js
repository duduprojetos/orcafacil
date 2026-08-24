import "./globals.css";

export const metadata = {
  title: "OrçaFácil — Orçamentos profissionais em 1 minuto",
  description:
    "Crie e envie orçamentos profissionais em PDF direto do celular. Sem planilha, sem enrolação — feito para quem vende serviço.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
