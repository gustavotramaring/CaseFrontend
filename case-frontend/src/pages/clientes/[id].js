"use client";

import "../../app/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ClienteAtivos() {
  const router = useRouter();
  const { id } = router.query;

  const [cliente, setCliente] = useState(null); // Armazena os dados do cliente
  const [ativos, setAtivos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Busca os dados do cliente e seus ativos
    const fetchCliente = async () => {
      try {
        const response = await fetch(`http://localhost:3000/clientes/${id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados do cliente.");
        }
        const data = await response.json();
        setCliente(data); // Armazena os dados do cliente
        setAtivos(data.ativos || []); // Garante que ativos seja uma lista, mesmo se for undefined
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar os dados do cliente.");
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [id]);

  const valorTotal = ativos.reduce((total, ativo) => total + ativo.valor, 0);

  return (
    <div>
      {loading ? (
        <p>Carregando...</p>
      ) : cliente ? (
        <div>
          <h1 className="text-2xl font-bold">
            Ativos do Cliente {cliente.nome}
          </h1>
          {ativos.length > 0 ? (
            <div>
              <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Valor</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Rentabilidade (12M)</th>
                  </tr>
                </thead>
                <tbody>
                  {ativos.map((ativo) => (
                    <tr key={ativo.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{ativo.nome}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        R$ {ativo.valor.toFixed(2).replace(".", ",")}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {ativo.rentabilidade?.toFixed(2).replace(".", ",") ?? "N/A"}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 font-bold">
                Valor Total em ativos: R$ {valorTotal.toFixed(2).replace(".", ",")}
              </p>
            </div>
          ) : (
            <p>Nenhum ativo encontrado para este cliente.</p>
          )}
        </div>
      ) : (
        <p>Cliente não encontrado.</p>
      )}
    </div>
  );
}
