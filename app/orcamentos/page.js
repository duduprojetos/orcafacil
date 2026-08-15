"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Orcamentos() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [orcamentos, setOrcamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    verificarLoginEBuscar();
  }, []);

  async function verificarLoginEBuscar() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setUsuario(user);
    buscarOrcamentos();
  }

  async function buscarOrcamentos() {
    setCarregando(true);
    const { data, error } = await supabase
      .from("orcamentos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar:", error);
    } else {
      setOrcamentos(data);
    }
    setCarregando(false);
  }

  async function deletarOrcamento(id) {
    const confirmar = confirm("Tem certeza que deseja deletar?");
    if (!confirmar) return;

    const { error } = await supabase
      .from("orcamentos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao deletar: " + error.message);
    } else {
      setOrcamentos(orcamentos.filter((o) => o.id !== id));
    }
  }

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function formatarData(dataStr) {
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Barra superior */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <span className="text-gray-600">
            👤 {usuario?.email}
          </span>
          <button onClick={sair} className="text-red-600 hover:text-red-800 font-medium">
            Sair
          </button>
        </div>

        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Meus Orçamentos</h1>
            <p className="text-gray-500 mt-1">Histórico de orçamentos gerados</p>
          </div>
          <Link href="/app" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
            + Novo Orçamento
          </Link>
        </div>

        {carregando && (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
            Carregando...
          </div>
        )}

        {!carregando && orcamentos.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
            <p className="mb-4">Você ainda não criou nenhum orçamento.</p>
            <Link href="/app" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Criar primeiro orçamento
            </Link>
          </div>
        )}

        {!carregando && orcamentos.length > 0 && (
          <div className="space-y-3">
            {orcamentos.map((orc) => (
              <div key={orc.id} className="bg-white rounded-2xl shadow p-5 flex justify-between items-center hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">#{orc.id}</span>
                    <span className="text-xs text-gray-400">{formatarData(orc.created_at)}</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{orc.cliente}</p>
                  <p className="text-sm text-gray-500">De: {orc.empresa}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-2xl font-bold text-blue-600">R$ {Number(orc.total).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">
                    {orc.itens?.length || 0} {orc.itens?.length === 1 ? "item" : "itens"}
                  </p>
                </div>
                <button onClick={() => deletarOrcamento(orc.id)} className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2 rounded hover:bg-red-50 transition-colors">
                  Deletar
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}