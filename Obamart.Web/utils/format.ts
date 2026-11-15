export const dinheiro = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    valor || 0,
  );
export const data = (valor: string | null) =>
  valor
    ? new Date(valor).toLocaleDateString("pt-BR", { timeZone: "UTC" })
    : "—";
export const cpfFormatado = (cpf: string) =>
  cpf?.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4") || "—";
