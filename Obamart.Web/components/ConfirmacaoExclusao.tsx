import { Trash2 } from "lucide-react";
import type { useClientesPage } from "../hooks/useClientesPage";
import { dinheiro } from "../utils/format";

export function ConfirmacaoExclusao({
  confirmacao,
  setConfirmacao,
  excluindo,
  setExcluindo,
  excluirCliente,
  excluirDivida,
}: Pick<
  ReturnType<typeof useClientesPage>,
  | "confirmacao"
  | "setConfirmacao"
  | "excluindo"
  | "setExcluindo"
  | "excluirCliente"
  | "excluirDivida"
>) {
  return (
    <>
      {confirmacao && (
        <div
          className="overlay modal-overlay"
          onClick={() => {
            if (!excluindo) setConfirmacao(null);
          }}
        >
          <div
            className="modal confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-description"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape" && !excluindo) setConfirmacao(null);
            }}
          >
            <div className="confirm-icon">
              <Trash2 size={22} />
            </div>
            <h2 id="confirm-title">
              {confirmacao.tipo === "cliente"
                ? "Excluir cliente?"
                : "Excluir conta?"}
            </h2>
            <p id="confirm-description">
              {confirmacao.tipo === "cliente" ? (
                <>
                  Você está prestes a excluir{" "}
                  <strong>{confirmacao.cliente.nome}</strong>.
                </>
              ) : (
                <>
                  Você está prestes a excluir a conta de{" "}
                  <strong>{dinheiro(confirmacao.divida.valor)}</strong>.
                </>
              )}{" "}
              Esta ação não pode ser desfeita.
            </p>
            <div className="form-actions">
              <button
                autoFocus
                type="button"
                className="secondary"
                disabled={excluindo}
                onClick={() => setConfirmacao(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="confirm-delete"
                disabled={excluindo}
                onClick={async () => {
                  setExcluindo(true);
                  try {
                    if (confirmacao.tipo === "cliente")
                      await excluirCliente(confirmacao.cliente);
                    else await excluirDivida(confirmacao.divida.id);
                    setConfirmacao(null);
                  } finally {
                    setExcluindo(false);
                  }
                }}
              >
                <Trash2 size={16} />
                {excluindo ? "Excluindo..." : "Sim, excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
