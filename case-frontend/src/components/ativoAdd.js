"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Ativos() {
  const [ativos, setAtivos] = useState([]);
  const [loadingAtivos, setLoadingAtivos] = useState(true);
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [rentabilidade, setRentabilidade] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Busca ativos
  const fetchAtivos = async () => {
    try {
      setLoadingAtivos(true);
      const response = await fetch("http://localhost:3000/ativos");
      if (!response.ok) {
        throw new Error("Erro ao buscar ativos.");
      }
      const data = await response.json();
      setAtivos(data);
    } catch (error) {
      console.error("Erro ao carregar a lista de ativos:", error);
      alert("Erro ao carregar a lista de ativos.");
    } finally {
      setLoadingAtivos(false);
    }
  };

  useEffect(() => {
    fetchAtivos();
  }, []);

  // Enviar novo ativo
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !valor || !rentabilidade) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoadingSubmit(true);

    try {
      const response = await fetch("http://localhost:3000/ativos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          valor: parseFloat(valor),
          rentabilidade: parseFloat(rentabilidade),
          clienteId: clienteId ? parseInt(clienteId, 10) : null,
        }),
      });

      if (response.ok) {
        alert("Ativo criado com sucesso!");
        setNome("");
        setValor("");
        setRentabilidade("");
        setClienteId("");
        location.reload();
      } else {
        alert("Erro ao criar ativo. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao criar ativo:", error);
      alert("Erro ao criar ativo. Tente novamente.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-8">
      {/* Formulário para criar ativos */}
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle>Cadastrar Novo Ativo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="nome"
                placeholder="Nome do Ativo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="number"
                name="valor"
                placeholder="Valor do Ativo"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="number"
                name="rentabilidade"
                placeholder="Rentabilidade (%)"
                value={rentabilidade}
                onChange={(e) => setRentabilidade(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="number"
                name="clienteId"
                placeholder="ID do Cliente (opcional)"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={loadingSubmit}
              >
                {loadingSubmit ? "Criando..." : "Criar Ativo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
