"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();

  const [modo, setModo] = useState("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    // O evento abaixo é a fonte principal; o timer cobre links de recuperação
    // cujo hash seja processado pelo cliente antes da inscrição no listener.
    const recoveryFallback = window.setTimeout(() => {
      if (window.location.hash.includes("type=recovery")) setModo("redefinir");
    }, 0);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setModo("redefinir");
    });

    return () => {
      window.clearTimeout(recoveryFallback);
      subscription.unsubscribe();
    };
  }, []);

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

  async function enviarRecuperacao(e) {
    e.preventDefault();
    setCarregando(true);
    setMensagem("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    setCarregando(false);
    setMensagem(error
      ? "❌ " + error.message
      : "✅ Enviamos um link de recuperação para o seu e-mail.");
  }

  async function redefinirSenha(e) {
    e.preventDefault();
    setMensagem("");

    if (senha.length < 6) {
      setMensagem("❌ A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (senha !== confirmarSenha) {
      setMensagem("❌ As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setCarregando(false);

    if (error) {
      setMensagem("❌ " + error.message);
      return;
    }

    await supabase.auth.signOut();
    setSenha("");
    setConfirmarSenha("");
    setModo("login");
    setMensagem("✅ Senha alterada. Entre com a nova senha.");
    window.history.replaceState(null, "", "/login");
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
    <div className="min-h-screen overflow-hidden bg-emerald-50 p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden lg:block">
          <Link href="/" className="mb-10 inline-flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xl font-bold">O</div>
            <span className="app-title text-2xl font-bold">OrçaFácil</span>
          </Link>

          <span className="kicker mb-5">Orçamentos profissionais</span>
          <h1 className="app-title max-w-xl text-5xl font-bold leading-[1.05]">
            Feche mais rápido com uma apresentação que passa confiança.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-emerald-800">
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
                <p className="mt-1 text-sm text-teal-700">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="app-card mx-auto w-full max-w-md p-6 sm:p-8">
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center justify-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xl font-bold">O</div>
              <span className="app-title text-2xl font-bold">OrçaFácil</span>
            </Link>
          </div>

          <div className="mb-8">
            <span className="kicker mb-4">
              {modo === "login" ? "Área do usuário" : modo === "cadastro" ? "Comece grátis" : "Segurança da conta"}
            </span>
            <h1 className="app-title text-3xl font-bold">
              {modo === "login" ? "Entre na sua conta" : modo === "cadastro" ? "Crie sua conta" : modo === "recuperacao" ? "Recupere sua senha" : "Crie uma nova senha"}
            </h1>
            <p className="mt-2 text-emerald-800">
              {modo === "login"
                ? "Acesse seus orçamentos e acompanhe seus clientes."
                : modo === "cadastro"
                  ? "Leva poucos segundos para começar a vender com mais presença."
                  : modo === "recuperacao"
                    ? "Informe seu e-mail para receber o link de recuperação."
                    : "Escolha uma senha segura para voltar à sua conta."}
            </p>
          </div>

          {(modo === "login" || modo === "cadastro") && <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-emerald-200 bg-emerald-100 p-1">
            <button
              onClick={() => { setModo("login"); setMensagem(""); }}
              className={`rounded-lg py-2.5 text-sm font-bold ${modo === "login" ? "bg-white text-emerald-800 shadow-sm" : "text-teal-700"}`}
            >
              Login
            </button>
            <button
              onClick={() => { setModo("cadastro"); setMensagem(""); }}
              className={`rounded-lg py-2.5 text-sm font-bold ${modo === "cadastro" ? "bg-white text-emerald-800 shadow-sm" : "text-teal-700"}`}
            >
              Cadastro
            </button>
          </div>}

          <form
            onSubmit={modo === "login" ? fazerLogin : modo === "cadastro" ? fazerCadastro : modo === "recuperacao" ? enviarRecuperacao : redefinirSenha}
            className="space-y-4"
          >
            {modo !== "redefinir" && <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-emerald-800">E-mail</span>
              <input
                type="email"
                placeholder="voce@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </label>}
            {modo !== "recuperacao" && <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-emerald-800">
                {modo === "redefinir" ? "Nova senha" : "Senha"}
              </span>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </label>}

            {modo === "redefinir" && <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-emerald-800">Confirme a nova senha</span>
              <input
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </label>}

            {modo === "login" && (
              <button
                type="button"
                onClick={() => { setModo("recuperacao"); setMensagem(""); }}
                className="block w-full text-right text-sm font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
              >
                Esqueci minha senha
              </button>
            )}

            {mensagem && (
              <div className={`rounded-lg px-4 py-3 text-center text-sm font-semibold ${mensagem.startsWith("✅") ? "bg-emerald-600 text-white" : "bg-red-50 text-red-700 border border-red-200"}`}>
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
                  : modo === "cadastro"
                    ? "Criar conta grátis"
                    : modo === "recuperacao"
                      ? "Enviar link de recuperação"
                      : "Salvar nova senha"}
            </button>

            {(modo === "recuperacao" || modo === "redefinir") && (
              <button
                type="button"
                onClick={() => { setModo("login"); setMensagem(""); }}
                className="w-full text-sm font-semibold text-emerald-700 hover:text-emerald-900"
              >
                ← Voltar para o login
              </button>
            )}
          </form>

          <p className="mt-6 text-center text-xs text-teal-700">
            Ao continuar, você concorda com os nossos <Link href="/termos" className="font-bold text-emerald-700 underline">Termos de Uso</Link> e com a <Link href="/privacidade" className="font-bold text-emerald-700 underline">Política de Privacidade</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
