"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Ativos() {
  const router = useRouter();
  const { id } = router.query; // ID do cliente vindo da URL
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar os ativos do cliente
  const fetchAtivos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/clientes/${id}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar detalhes do cliente.");
      }
      const data = await response.json();
      setCliente(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar os detalhes do cliente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAtivos();
    }
  }, [id]);

  const calcularTotal = (ativos) => {
    return ativos.reduce((total, ativo) => total + ativo.valor, 0);
  };

  return (
    <div>
      {loading ? (
        <p className="text-center text-gray-500">Carregando...</p>
      ) : cliente ? (
        <Card className="w-full max-w-5xl shadow-xl">
          <CardHeader>
            <CardTitle>Ativos de {cliente.nome}</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Valor</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {cliente.ativos.map((ativo) => (
                  <tr key={ativo.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{ativo.nome}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      R${ativo.valor.toFixed(2).replace(".", ",")}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {ativo.status ? "Ativo" : "Inativo"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <strong>Total de Ativos: </strong>
              <span>R${calcularTotal(cliente.ativos).toFixed(2).replace(".", ",")}</span>
            </div>
            <Button className="mt-4" onClick={() => router.push("/clientes")}>
              Voltar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-gray-500">Cliente não encontrado.</p>
      )}
    </div>
  );
}
