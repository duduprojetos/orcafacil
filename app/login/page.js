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
    <div className="min-h-screen overflow-hidden bg-zinc-50 p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden lg:block">
          <Link href="/" className="mb-10 inline-flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-black text-white text-xl font-bold">O</div>
            <span className="app-title text-2xl font-bold">OrçaFácil</span>
          </Link>

          <span className="kicker mb-5">Orçamentos profissionais</span>
          <h1 className="app-title max-w-xl text-5xl font-bold leading-[1.05]">
            Feche mais rápido com uma apresentação que passa confiança.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-zinc-600">
            Crie, salve, envie por WhatsApp e acompanhe aprovações sem depender de planilha ou documento improvisado.
          </p>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["1 min", "para montar"],
              ["PDF", "pronto para envio"],
              ["Link", "para aprovação"],
            ].map(([valor, label]) => (
              <div key={valor} className="app-card p-5">
                <p className="app-title text-3xl font-bold">{valor}</p>
                <p className="mt-1 text-sm text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="app-card mx-auto w-full max-w-md p-6 sm:p-8">
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center justify-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-black text-white text-xl font-bold">O</div>
              <span className="app-title text-2xl font-bold">OrçaFácil</span>
            </Link>
          </div>

          <div className="mb-8">
            <span className="kicker mb-4">{modo === "login" ? "Área do usuário" : "Comece grátis"}</span>
            <h1 className="app-title text-3xl font-bold">
              {modo === "login" ? "Entre na sua conta" : "Crie sua conta"}
            </h1>
            <p className="mt-2 text-zinc-600">
              {modo === "login" ? "Acesse seus orçamentos e acompanhe seus clientes." : "Leva poucos segundos para começar a vender com mais presença."}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-zinc-200 bg-zinc-100 p-1">
            <button
              onClick={() => { setModo("login"); setMensagem(""); }}
              className={`rounded-lg py-2.5 text-sm font-bold ${modo === "login" ? "bg-white text-black shadow-sm" : "text-zinc-500"}`}
            >
              Login
            </button>
            <button
              onClick={() => { setModo("cadastro"); setMensagem(""); }}
              className={`rounded-lg py-2.5 text-sm font-bold ${modo === "cadastro" ? "bg-white text-black shadow-sm" : "text-zinc-500"}`}
            >
              Cadastro
            </button>
          </div>

          <form onSubmit={modo === "login" ? fazerLogin : fazerCadastro} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-zinc-700">E-mail</span>
              <input
                type="email"
                placeholder="voce@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-zinc-700">Senha</span>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-zinc-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              />
            </label>

            {mensagem && (
              <div className={`rounded-lg px-4 py-3 text-center text-sm font-semibold ${mensagem.startsWith("✅") ? "bg-zinc-900 text-white" : "bg-red-50 text-red-700 border border-red-200"}`}>
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

          <p className="mt-6 text-center text-xs text-zinc-500">
            Ao continuar, você concorda com a nossa <Link href="/privacidade" className="font-bold text-black underline">Política de Privacidade</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
