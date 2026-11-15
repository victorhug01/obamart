import { Plus } from "lucide-react";
import type { useClientesPage } from "../hooks/useClientesPage";

export function Intro({
  abrirCliente,
}: Pick<ReturnType<typeof useClientesPage>, "abrirCliente">) {
  return (
    <>
      <div className="intro">
        <div>
          <div className="eyebrow">
            <span /> SEU DIA A DIA, MAIS SIMPLES
          </div>
          <h1>
            Clientes <em>&</em> contas<span>.</span>
          </h1>
          <p>Organize seus clientes e acompanhe suas contas em um só lugar.</p>
        </div>
        <button className="primary" onClick={() => abrirCliente()}>
          <Plus size={18} /> Novo cliente
        </button>
      </div>
    </>
  );
}
