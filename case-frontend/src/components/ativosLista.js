"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AtivoList() {
  const [ativos, setAtivos] = useState([]);
  const [loadingAtivos, setLoadingAtivos] = useState(true);

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
      console.error(error);
      alert("Erro ao carregar a lista de ativos.");
    } finally {
      setLoadingAtivos(false);
    }
  };

  useEffect(() => {
    fetchAtivos();
  }, []);

  return (
    <Card className="w-full max-w-3xl shadow-xl">
      <CardHeader>
        <CardTitle>Lista de Ativos</CardTitle>
      </CardHeader>
      <CardContent>
        {loadingAtivos ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : ativos.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Valor</th>
              </tr>
            </thead>
            <tbody>
              {ativos.map((ativo) => (
                <tr key={ativo.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{ativo.nome}</td>
                  <td className="border border-gray-300 px-4 py-2">
                  R$ {ativo.valor.toFixed(2).replace(".", ",")} </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">Nenhum ativo encontrado.</p>
        )}
      </CardContent>
    </Card>
  );
}