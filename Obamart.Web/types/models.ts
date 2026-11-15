export type Cliente = {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  dataNascimento: string;
  idade: number;
  totalDividas: number;
};
export type Divida = {
  id: string;
  clienteId: string;
  valor: number;
  situacao: boolean;
  dataCriacao: string;
  dataPagamento: string | null;
};
export type Modal = "cliente" | "divida" | null;
