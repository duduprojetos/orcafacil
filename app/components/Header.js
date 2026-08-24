"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Header({ usuario, paginaAtiva = "" }) {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const links = [
    { href: "/dashboard", label: "Dashboard", icone: "📊", key: "dashboard" },
    { href: "/app", label: "Novo", icone: "✦", key: "app" },
    { href: "/orcamentos", label: "Orçamentos", icone: "📄", key: "orcamentos" },
    { href: "/perfil", label: "Perfil", icone: "⚙️", key: "perfil" },
  ];

  if (usuario?.email === "admin@edu.com") {
    links.push({ href: "/admin", label: "Admin", icone: "🔒", key: "admin" });
  }

  return (
    <>
      <div className="app-card sticky top-4 z-30 mb-8 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm font-bold">
              O
            </div>
            <div className="min-w-0">
              <p className="app-title text-xl font-bold leading-none">OrçaFácil</p>
              <p className="truncate text-xs text-teal-700">{usuario?.email}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const ativo = paginaAtiva === link.key;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    ativo
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-teal-700 hover:bg-emerald-100 hover:text-emerald-700"
                  }`}
                >
                  <span className="mr-1.5">{link.icone}</span>{link.label}
                </Link>
              );
            })}
            <button
              onClick={sair}
              className="ml-1 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
            >
              Sair
            </button>
          </nav>

          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-emerald-200 bg-white text-emerald-950 shadow-sm md:hidden"
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAberto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuAberto && (
        <>
          <div
            className="fixed inset-0 z-40 bg-emerald-950/40 backdrop-blur-sm md:hidden"
            onClick={() => setMenuAberto(false)}
          />

          <div className="fixed bottom-0 right-0 top-0 z-50 flex w-80 max-w-[88vw] flex-col border-l border-emerald-200 bg-white shadow-2xl md:hidden">
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white">
              <div className="relative mb-5 flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-white text-emerald-800 font-bold">
                  O
                </div>
                <button onClick={() => setMenuAberto(false)} className="text-white/70 hover:text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">Logado como</p>
              <p className="truncate text-sm font-semibold">{usuario?.email}</p>
            </div>

            <nav className="flex-1 space-y-2 p-4">
              {links.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMenuAberto(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold ${
                    paginaAtiva === link.key
                      ? "bg-emerald-600 text-white"
                      : "text-emerald-800 hover:bg-emerald-100"
                  }`}
                >
                  <span className="text-xl">{link.icone}</span>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-emerald-200 p-4">
              <button
                onClick={sair}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-100 px-4 py-3 font-bold text-emerald-800 hover:bg-emerald-200"
              >
                <span className="text-xl">🚪</span>
                Sair
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
