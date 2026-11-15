import { Search } from "lucide-react";
import type { useClientesPage } from "../hooks/useClientesPage";

export function BuscaClientes({
  setPage,
  setTermo,
  busca,
  setBusca,
}: Pick<
  ReturnType<typeof useClientesPage>,
  "setPage" | "setTermo" | "busca" | "setBusca"
>) {
  return (
    <>
      <div className="section-head">
        <div>
          <div className="eyebrow muted">SUA CARTEIRA</div>
          <h2>
            Todos os clientes <span>↗</span>
          </h2>
          <p>Consulte os dados e gerencie as contas de cada cliente.</p>
        </div>
        <form
          className="search"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setTermo(busca);
          }}
        >
          <Search size={18} />
          <input
            aria-label="Buscar cliente por nome"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      </div>
    </>
  );
}
