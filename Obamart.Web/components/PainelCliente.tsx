import {
  Check,
  CircleDollarSign,
  Plus,
  X,
  Pencil,
  Trash2,
  Wallet,
  AlertCircle,
} from "lucide-react";
import type { useClientesPage } from "../hooks/useClientesPage";
import { cpfFormatado, data, dinheiro } from "../utils/format";

export function PainelCliente({
  selecionado,
  setSelecionado,
  erro,
  setErro,
  abrirCliente,
  setConfirmacao,
  abrirDivida,
  loadingDividas,
  dividas,
  pagarDivida,
  divPage,
  setDivPage,
}: Pick<
  ReturnType<typeof useClientesPage>,
  | "selecionado"
  | "setSelecionado"
  | "erro"
  | "setErro"
  | "abrirCliente"
  | "setConfirmacao"
  | "abrirDivida"
  | "loadingDividas"
  | "dividas"
  | "pagarDivida"
  | "divPage"
  | "setDivPage"
>) {
  return (
    <>
      {selecionado && (
        <div className="overlay" onClick={() => setSelecionado(null)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()}>
            {erro && (
              <div className="alert error">
                <AlertCircle size={18} />
                {erro}
                <button onClick={() => setErro("")} aria-label="Fechar aviso">
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="drawer-top">
              <span>PERFIL DO CLIENTE</span>
              <button
                className="icon-button"
                aria-label="Fechar"
                onClick={() => setSelecionado(null)}
              >
                <X />
              </button>
            </div>
            <div className="profile">
              <span className="avatar large">
                {selecionado.nome[0].toUpperCase()}
              </span>
              <div>
                <h2>{selecionado.nome}</h2>
                <p>{cpfFormatado(selecionado.cpf)}</p>
              </div>
            </div>
            <div className="profile-info">
              <div>
                <small>E-MAIL</small>
                <strong>{selecionado.email || "Não informado"}</strong>
              </div>
              <div>
                <small>NASCIMENTO</small>
                <strong>{data(selecionado.dataNascimento)}</strong>
              </div>
            </div>
            <div className="profile-actions">
              <button onClick={() => abrirCliente(selecionado)}>
                <Pencil size={16} /> Editar cliente
              </button>
              <button
                className="danger-text"
                onClick={() =>
                  setConfirmacao({ tipo: "cliente", cliente: selecionado })
                }
              >
                <Trash2 size={16} /> Excluir
              </button>
            </div>
            <div className="drawer-section">
              <div>
                <span className="eyebrow muted">ACOMPANHAMENTO</span>
                <h2>
                  Contas do cliente<span>.</span>
                </h2>
                <p>Histórico de contas e pagamentos.</p>
              </div>
              <button className="primary compact" onClick={() => abrirDivida()}>
                <Plus size={17} /> Nova conta
              </button>
            </div>
            <div className="hint">
              <CircleDollarSign size={18} /> Cada cliente pode ter uma conta em
              aberto por vez.
            </div>
            <div className="debt-list">
              {loadingDividas ? (
                <div role="status">
                  <span className="sr-only">Carregando contas...</span>
                  {Array.from({ length: 2 }, (_, i) => (
                    <div
                      className="debt skeleton-debt"
                      key={i}
                      aria-hidden="true"
                    >
                      <span className="skeleton skeleton-avatar" />
                      <div>
                        <span className="skeleton skeleton-name" />
                        <span className="skeleton skeleton-line" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : dividas.length === 0 ? (
                <div className="empty">
                  <Wallet size={26} />
                  <strong>Nenhuma conta nesta página</strong>
                  <span>As contas registradas aparecerão aqui.</span>
                </div>
              ) : (
                dividas.map((d) => (
                  <div className="debt" key={d.id}>
                    <div className="debt-main">
                      <span className="debt-icon">
                        <Wallet size={19} />
                      </span>
                      <div>
                        <strong>{dinheiro(d.valor)}</strong>
                        <small>
                          Criada em {data(d.dataCriacao)}
                          {d.dataPagamento &&
                            ` · Paga em ${data(d.dataPagamento)}`}
                        </small>
                      </div>
                      <span
                        className={d.situacao ? "badge paid" : "badge pending"}
                      >
                        {d.situacao ? "Paga" : "Em aberto"}
                      </span>
                    </div>
                    <div className="debt-actions">
                      {!d.situacao && (
                        <button onClick={() => pagarDivida(d.id)}>
                          <Check size={15} /> Marcar como paga
                        </button>
                      )}
                      <button onClick={() => abrirDivida(d)}>
                        <Pencil size={15} /> Editar
                      </button>
                      <button
                        className="danger-text"
                        onClick={() =>
                          setConfirmacao({ tipo: "divida", divida: d })
                        }
                      >
                        <Trash2 size={15} /> Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="pagination drawer-pages">
              <span>Página {divPage}</span>
              <div>
                <button
                  disabled={loadingDividas || divPage === 1}
                  onClick={() => setDivPage(divPage - 1)}
                >
                  Anterior
                </button>
                <button
                  disabled={loadingDividas || dividas.length < 20}
                  onClick={() => setDivPage(divPage + 1)}
                >
                  Próxima
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
