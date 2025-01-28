"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Adicionando o roteamento
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClienteList() {
  const router = useRouter(); // Hook do Next.js para navegação
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCliente, setEditCliente] = useState(null); // ID do cliente sendo editado
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    status: false,
  });

  // Busca os clientes
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEdit = (cliente) => {
    setEditCliente(cliente.id);
    setFormData(cliente); // Preenche o formulário com os dados do cliente
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
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
        const errorData = await response.json(); // Obtém a resposta do erro
        if (errorData.error === "Email já está em uso") {
          alert("Erro: Email já está em uso por outro cliente.");
        } else {
          throw new Error("Erro ao atualizar cliente.");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar cliente. Tente novamente.");
    }
  };
  

  const handleCancel = () => {
    setEditCliente(null);
    setFormData({ nome: "", email: "", status: false });
  };

  const handleRemove = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja remover este cliente?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Cliente removido com sucesso!");
        setClientes(clientes.filter((cliente) => cliente.id !== id));
      } else {
        throw new Error("Erro ao remover cliente.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao remover cliente. Tente novamente.");
    }
  };

  return (
    <div>
      <Card className="w-full max-w-5xl shadow-xl">
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
                  <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Ativos</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <React.Fragment key={cliente.id}>
                    <tr className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{cliente.nome}</td>
                      <td className="border border-gray-300 px-4 py-2">{cliente.email}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {cliente.status ? "Ativo" : "Inativo"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {cliente.ativos && cliente.ativos.length > 0 ? (
                          <Button
                            className="bg-gray-500 hover:bg-gray-600"
                            onClick={() => router.push(`/clientes/${cliente.id}`)}
                          >
                            Ver Ativos
                          </Button>
                        ) : (
                          <span className="text-gray-500">Sem Ativos</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            className="bg-blue-500 hover:bg-blue-600 flex items-center space-x-1"
                            onClick={() => handleEdit(cliente)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            className="bg-red-500 hover:bg-red-600 flex items-center space-x-1"
                            onClick={() => handleRemove(cliente.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">Nenhum cliente encontrado.</p>
          )}
        </CardContent>
      </Card>

      {/* Formulário de Edição */}
      {editCliente && (
        <div className="mt-8 max-w-3xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Editar Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="nome"
                    id="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="status" className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="status"
                      id="status"
                      checked={formData.status}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Status: Ativo
                  </label>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                    Salvar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
