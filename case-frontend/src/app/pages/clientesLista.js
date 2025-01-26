"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ClienteList() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCliente, setEditCliente] = useState(null); // ID do cliente sendo editado
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    status: false,
  });

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/clientes");
      if (!response.ok) {
        throw new Error("Erro ao buscar clientes.");
      }
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar a lista de clientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (cliente) => {
    setEditCliente(cliente.id);
    setFormData(cliente);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:3000/clientes/${editCliente}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Cliente atualizado com sucesso!");
      setEditCliente(null);
      const updatedClientes = clientes.map((cliente) =>
        cliente.id === editCliente ? { ...cliente, ...formData } : cliente
      );
      setClientes(updatedClientes);
    } else {
      alert("Erro ao atualizar cliente. Tente novamente.");
    }
  };

  return (
    <div>
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500">Carregando...</p>
          ) : clientes.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Ativo</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-100">
                    {editCliente === cliente.id ? (
                      <>
                        <td className="border border-gray-300 px-4 py-2">
                          <Input
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Nome"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Input
                            name="status"
                            type="checkbox"
                            checked={formData.status}
                            onChange={(e) =>
                              setFormData({ ...formData, status: e.target.checked })
                            }
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Button
                            className="bg-green-500 hover:bg-green-600"
                            onClick={handleSave}
                          >
                            Salvar
                          </Button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border border-gray-300 px-4 py-2">{cliente.nome}</td>
                        <td className="border border-gray-300 px-4 py-2">{cliente.email}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {cliente.status ? "Sim" : "Não"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Button
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={() => handleEdit(cliente)}
                          >
                            Editar
                          </Button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">Nenhum cliente encontrado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
