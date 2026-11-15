import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Users,
  RefreshCw,
} from "lucide-react";
import type { useClientesPage } from "../hooks/useClientesPage";
import { cpfFormatado, dinheiro } from "../utils/format";

export function ListaClientes({
  page,
  carregar,
  loading,
  clientes,
  setSelecionado,
  setDivPage,
  setDividas,
  setLoadingDividas,
  termo,
  setPage,
}: Pick<
  ReturnType<typeof useClientesPage>,
  | "page"
  | "carregar"
  | "loading"
  | "clientes"
  | "setSelecionado"
  | "setDivPage"
  | "setDividas"
  | "setLoadingDividas"
  | "termo"
  | "setPage"
>) {
  return (
    <>
      <div className="table-card">
        <div className="table-top">
          <div>
            <strong>Lista de clientes</strong>
            <span> Página {page}</span>
          </div>
          <button
            className="icon-button"
            aria-label="Atualizar lista"
            onClick={carregar}
          >
            <RefreshCw size={17} />
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>CLIENTE</th>
                <th>CPF</th>
                <th>CONTATO</th>
                <th>EM ABERTO</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 4 }, (_, i) => (
                    <tr key={i} aria-hidden="true">
                      <td>
                        <div className="person">
                          <span className="skeleton skeleton-avatar" />
                          <span className="skeleton skeleton-name" />
                        </div>
                      </td>
                      <td>
                        <span className="skeleton skeleton-line" />
                      </td>
                      <td>
                        <span className="skeleton skeleton-line" />
                      </td>
                      <td>
                        <span className="skeleton skeleton-line short" />
                      </td>
                      <td />
                    </tr>
                  ))
                : clientes.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => {
                        setSelecionado(c);
                        setDivPage(1);
                        setDividas([]);
                        setLoadingDividas(true);
                      }}
                    >
                      <td>
                        <div className="person">
                          <span className="avatar">
                            {c.nome.slice(0, 1).toUpperCase()}
                          </span>
                          <div>
                            <strong>{c.nome}</strong>
                            <small>{c.idade} anos</small>
                          </div>
                        </div>
                      </td>
                      <td>{cpfFormatado(c.cpf)}</td>
                      <td>{c.email || "—"}</td>
                      <td>
                        <span
                          className={c.totalDividas > 0 ? "amount" : "clear"}
                        >
                          {dinheiro(c.totalDividas)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="row-action"
                          aria-label={`Ver contas de ${c.nome}`}
                        >
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {loading && (
          <span className="sr-only" role="status">
            Carregando clientes...
          </span>
        )}
        {!loading && clientes.length === 0 && (
          <div className="empty">
            <Users size={26} />
            <strong>Nenhum cliente encontrado</strong>
            <span>
              {termo
                ? "Tente buscar por outro nome."
                : "Comece cadastrando seu primeiro cliente."}
            </span>
          </div>
        )}
        <div className="pagination">
          <span>Até 10 clientes por página</span>
          <div>
            <button
              disabled={loading || page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ArrowLeft size={16} /> Anterior
            </button>
            <b>{page}</b>
            <button
              disabled={loading || clientes.length < 10}
              onClick={() => setPage(page + 1)}
            >
              Próxima <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <footer>
        OBAMART <span>•</span> GESTÃO COM LEVEZA{" "}
        <span className="footer-right">
          Feito para cuidar das suas relações.
        </span>
      </footer>
    </>
  );
}
