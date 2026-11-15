import { api } from "./api";
import type { Cliente } from "../types/models";

export type DadosCliente = {
  nome: string;
  cpf: string;
  email: string;
  dataNascimento: string;
};

export const clientesService = {
  listar: (page: number, termo: string) =>
    api<Cliente[]>(
      `Cliente?page=${page}&pesquisa=${encodeURIComponent(termo)}`,
    ),
  salvar: (dados: DadosCliente, id?: string) =>
    api(`Cliente${id ? `/${id}` : ""}`, {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(dados),
    }),
  excluir: (id: string) => api(`Cliente/${id}`, { method: "DELETE" }),
};
