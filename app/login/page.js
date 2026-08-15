"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();

  const [modo, setModo] = useState("login"); // "login" ou "cadastro"
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(e) {
    e.preventDefault();
    setCarregando(true);
    setMensagem("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    setCarregando(false);

    if (error) {
      setMensagem("❌ " + error.message);
      return;
    }

    setMensagem("✅ Login realizado! Redirecionando...");
    setTimeout(() => router.push("/app"), 1000);
  }

  async function fazerCadastro(e) {
    e.preventDefault();
    setCarregando(true);
    setMensagem("");

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: senha,
    });

    setCarregando(false);

    if (error) {
      setMensagem("❌ " + error.message);
      return;
    }

    setMensagem("✅ Conta criada! Redirecionando...");
    setTimeout(() => router.push("/app"), 1000);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">OrçaFácil</h1>
          <p className="text-gray-500 mt-2">
            {modo === "login" ? "Entre na sua conta" : "Crie sua conta grátis"}
          </p>
        </div>

        {/* Abas */}
        <div className="flex gap-2 mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => { setModo("login"); setMensagem(""); }}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
              modo === "login" ? "bg-white shadow text-blue-600" : "text-gray-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setModo("cadastro"); setMensagem(""); }}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
              modo === "cadastro" ? "bg-white shadow text-blue-600" : "text-gray-500"
            }`}
          >
            Cadastro
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={modo === "login" ? fazerLogin : fazerCadastro} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Senha (mínimo 6 caracteres)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {mensagem && (
            <div className="text-center text-sm py-2">{mensagem}</div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {carregando
              ? "Aguarde..."
              : modo === "login"
              ? "Entrar"
              : "Criar conta"}
          </button>
        </form>

      </div>
    </div>
  );
}