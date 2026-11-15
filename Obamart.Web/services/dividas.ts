import { api } from "./api";
import type { Divida } from "../types/models";

type DadosDivida = { clienteId: string; valor: number; situacao: boolean };

export const dividasService = {
  listar: (clienteId: string, page: number) =>
    api<Divida[]>(`Divida?clienteId=${clienteId}&page=${page}`),
  salvar: (dados: DadosDivida, id?: string) =>
    api(`Divida${id ? `/${id}` : ""}`, {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(dados),
    }),
  pagar: (id: string) => api(`Divida/${id}/pagamento`, { method: "PATCH" }),
  excluir: (id: string) => api(`Divida/${id}`, { method: "DELETE" }),
};
