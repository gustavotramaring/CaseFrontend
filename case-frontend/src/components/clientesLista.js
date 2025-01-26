"use client";

import React from "react";
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

  // Atualiza os dados do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Inicia o modo de edição
  const handleEdit = (cliente) => {
    setEditCliente(cliente.id);
    setFormData(cliente);
  };

  // Salva as alterações do cliente
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
        throw new Error("Erro ao atualizar cliente.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar cliente. Tente novamente.");
    }
  };

  // Cancela a edição
  const handleCancel = () => {
    setEditCliente(null);
    setFormData({ nome: "", email: "", status: false });
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
                  <th className="border border-gray-300 px-4 py-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <React.Fragment key={cliente.id}>
                    <tr className="hover:bg-gray-100">
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
                              onChange={handleChange}
                            />
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <Button
                              className="bg-green-500 hover:bg-green-600 mr-2"
                              onClick={handleSave}
                            >
                              Salvar
                            </Button>
                            <Button
                              className="bg-red-500 hover:bg-red-600"
                              onClick={handleCancel}
                            >
                              Cancelar
                            </Button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border border-gray-300 px-4 py-2">{cliente.nome}</td>
                          <td className="border border-gray-300 px-4 py-2">{cliente.email}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            {cliente.status ? "Ativo" : "Inativo"}
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
                    <tr>
                      <td colSpan="4" className="border border-gray-300 px-4 py-2 bg-gray-50">
                        <strong>Ativos:</strong>
                        {cliente.ativos.length > 0 ? (
                          <ul className="list-disc pl-4 mt-2">
                            {cliente.ativos.map((ativo) => (
                              <li key={ativo.id}>
                                {ativo.nome} - R${ativo.valor.toFixed(2).replace(".", ",")}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-500">Sem ativos</span>
                        )}
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
    </div>
  );
}
