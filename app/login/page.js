"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();

  const [modo, setModo] = useState("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(e) {
    e.preventDefault();
    setCarregando(true);
    setMensagem("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    setCarregando(false);

    if (error) {
      setMensagem("❌ " + error.message);
      return;
    }

    setMensagem("✅ Login realizado! Redirecionando...");
    setTimeout(() => router.push("/dashboard"), 1000);
  }

  async function fazerCadastro(e) {
    e.preventDefault();
    setCarregando(true);
    setMensagem("");

    const { error } = await supabase.auth.signUp({
      email: email,
      password: senha,
    });

    setCarregando(false);

    if (error) {
      setMensagem("❌ " + error.message);
      return;
    }

    setMensagem("✅ Conta criada! Redirecionando...");
    setTimeout(() => router.push("/dashboard"), 1000);
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gray-50 p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden lg:block">
          <Link href="/" className="mb-10 inline-flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#16241c] text-[#fffdf7] text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>O</div>
            <span className="app-title text-2xl font-semibold">OrçaFácil</span>
          </Link>

          <span className="kicker mb-5">Orçamentos profissionais</span>
          <h1 className="app-title max-w-xl text-5xl font-semibold leading-[1.05]">
            Feche mais rápido com uma apresentação que passa confiança.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#5c6b60]">
            Crie, salve, envie por WhatsApp e acompanhe aprovações sem depender de planilha ou documento improvisado.
          </p>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["1 min", "para montar"],
              ["PDF", "pronto para envio"],
              ["Link", "para aprovação"],
            ].map(([valor, label]) => (
              <div key={valor} className="app-card p-5">
                <p className="app-title text-3xl font-semibold">{valor}</p>
                <p className="mt-1 text-sm text-[#5c6b60]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="app-card mx-auto w-full max-w-md p-6 sm:p-8">
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center justify-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#16241c] text-[#fffdf7] text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>O</div>
              <span className="app-title text-2xl font-semibold">OrçaFácil</span>
            </Link>
          </div>

          <div className="mb-8">
            <span className="kicker mb-4">{modo === "login" ? "Área do usuário" : "Comece grátis"}</span>
            <h1 className="app-title text-3xl font-semibold">
              {modo === "login" ? "Entre na sua conta" : "Crie sua conta"}
            </h1>
            <p className="mt-2 text-[#5c6b60]">
              {modo === "login" ? "Acesse seus orçamentos e acompanhe seus clientes." : "Leva poucos segundos para começar a vender com mais presença."}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-[#d9dccd] bg-[#16241c]/5 p-1">
            <button
              onClick={() => { setModo("login"); setMensagem(""); }}
              className={`rounded-xl py-2.5 text-sm font-bold ${modo === "login" ? "bg-[#fffdf7] text-[#16241c] shadow" : "text-[#5c6b60]"}`}
            >
              Login
            </button>
            <button
              onClick={() => { setModo("cadastro"); setMensagem(""); }}
              className={`rounded-xl py-2.5 text-sm font-bold ${modo === "cadastro" ? "bg-[#fffdf7] text-[#16241c] shadow" : "text-[#5c6b60]"}`}
            >
              Cadastro
            </button>
          </div>

          <form onSubmit={modo === "login" ? fazerLogin : fazerCadastro} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[#26372d]">E-mail</span>
              <input
                type="email"
                placeholder="voce@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[#26372d]">Senha</span>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {mensagem && (
              <div className={`rounded-xl px-4 py-3 text-center text-sm font-semibold ${mensagem.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {mensagem}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="btn-primary w-full px-6 py-3.5 disabled:opacity-50"
            >
              {carregando
                ? "Aguarde..."
                : modo === "login"
                  ? "Entrar na plataforma"
                  : "Criar conta grátis"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#5c6b60]">
            Ao continuar, você concorda com a nossa <Link href="/privacidade" className="font-bold text-[#1f7a4d]">Política de Privacidade</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
