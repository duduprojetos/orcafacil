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
    { href: "/app", label: "Novo Orçamento", icone: "➕", key: "app" },
    { href: "/orcamentos", label: "Orçamentos", icone: "📄", key: "orcamentos" },
    { href: "/perfil", label: "Perfil", icone: "⚙️", key: "perfil" },
  ];

    if (usuario?.email === "admin@edu.com") {
  links.push({ href: "/admin", label: "Admin", icone: "🔒", key: "admin" });
}

  return (
    <>
      {/* Barra superior */}
      <div className="flex justify-between items-center mb-4 gap-2">

        {/* Email do usuário */}
        <span className="text-gray-600 text-sm truncate flex-1">
          👤 {usuario?.email}
        </span>

        {/* MENU DESKTOP (visível em telas grandes) */}
        <div className="hidden md:flex gap-4 items-center text-sm">
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`font-medium transition-colors ${
                paginaAtiva === link.key
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {link.icone} {link.label}
            </Link>
          ))}
          <button
            onClick={sair}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Sair
          </button>
        </div>

        {/* MENU MOBILE (só aparece em telas pequenas) */}
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="md:hidden bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
          aria-label="Menu"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuAberto ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* DROPDOWN MOBILE */}
      {menuAberto && (
        <>
          {/* Overlay pra fechar clicando fora */}
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setMenuAberto(false)}
          />

          {/* Menu */}
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-white shadow-2xl z-50 md:hidden flex flex-col">

            {/* Cabeçalho do menu */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl">👤</div>
                <button
                  onClick={() => setMenuAberto(false)}
                  className="text-white/80 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-blue-100 uppercase font-semibold">Logado como</p>
              <p className="text-sm font-medium truncate">{usuario?.email}</p>
            </div>

            {/* Links */}
            <nav className="flex-1 p-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMenuAberto(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    paginaAtiva === link.key
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-xl">{link.icone}</span>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Botão sair */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={sair}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
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