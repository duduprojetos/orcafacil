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
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#16241c] text-[#fffdf7] shadow-lg" style={{ fontFamily: "var(--font-display)" }}>
              O
            </div>
            <div className="min-w-0">
              <p className="app-title text-xl font-semibold leading-none">OrçaFácil</p>
              <p className="truncate text-xs text-[#5c6b60]">{usuario?.email}</p>
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
                      ? "bg-[#16241c] text-[#fffdf7] shadow-md"
                      : "text-[#5c6b60] hover:bg-[#16241c]/5 hover:text-[#16241c]"
                  }`}
                >
                  <span className="mr-1.5">{link.icone}</span>{link.label}
                </Link>
              );
            })}
            <button
              onClick={sair}
              className="ml-1 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              Sair
            </button>
          </nav>

          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-[#d9dccd] bg-[#fffdf7]/80 text-[#16241c] shadow-sm md:hidden"
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
            className="fixed inset-0 z-40 bg-[#16241c]/35 backdrop-blur-sm md:hidden"
            onClick={() => setMenuAberto(false)}
          />

          <div className="fixed bottom-0 right-0 top-0 z-50 flex w-80 max-w-[88vw] flex-col border-l border-[#d9dccd] bg-[#fffdf7] shadow-2xl md:hidden">
            <div className="relative overflow-hidden bg-[#16241c] p-6 text-[#fffdf7]">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl" />
              <div className="relative mb-5 flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fffdf7] text-[#16241c] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  O
                </div>
                <button onClick={() => setMenuAberto(false)} className="text-[#fffdf7]/70 hover:text-[#fffdf7]">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-100/70">Logado como</p>
              <p className="truncate text-sm font-semibold">{usuario?.email}</p>
            </div>

            <nav className="flex-1 space-y-2 p-4">
              {links.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMenuAberto(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold ${
                    paginaAtiva === link.key
                      ? "bg-[#16241c] text-[#fffdf7]"
                      : "text-[#26372d] hover:bg-[#16241c]/5"
                  }`}
                >
                  <span className="text-xl">{link.icone}</span>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-[#d9dccd] p-4">
              <button
                onClick={sair}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-50 px-4 py-3 font-bold text-red-700 hover:bg-red-100"
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
