import { ArrowDownLeft, Users, Wallet } from "lucide-react";
import type { useClientesPage } from "../hooks/useClientesPage";
import { dinheiro } from "../utils/format";

export function Resumo({
  clientes,
  totalPagina,
}: Pick<ReturnType<typeof useClientesPage>, "clientes" | "totalPagina">) {
  return (
    <>
      <div className="overview">
        <div className="overview-title">
          <span>VISÃO GERAL</span>
          <small>Resumo desta página</small>
        </div>
        <div className="stat">
          <span className="stat-icon">
            <Users size={21} />
          </span>
          <div>
            <small>Clientes exibidos</small>
            <strong>{String(clientes.length).padStart(2, "0")}</strong>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon pale">
            <Wallet size={21} />
          </span>
          <div>
            <small>Em aberto nesta página</small>
            <strong>{dinheiro(totalPagina)}</strong>
          </div>
        </div>
        <div className="overview-note">
          <span>UM OLHAR MAIS CLARO</span>
          <p>Mais controle para o que importa.</p>
          <ArrowDownLeft size={25} />
        </div>
      </div>
    </>
  );
}
