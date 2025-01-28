"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ClientManager() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    status: true,
  });
  const [loading, setLoading] = useState(false);

  // Função para criar um novo cliente
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar cliente.");
      }

      alert("Cliente cadastrado com sucesso!");
      setFormData({ nome: "", email: "", status: true });
      location.reload();
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar cliente. Tente novamente.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle>Adicionar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite o nome do cliente"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite o email"
                required
              />
            </div>

            <div className="flex items-center">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mr-2">
                Ativo
              </label>
              <input
                id="status"
                name="status"
                type="checkbox"
                checked={formData.status}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Cadastrar Cliente
            </Button>
          </form>
        </CardContent>
      </Card>

    </div>
  );
}