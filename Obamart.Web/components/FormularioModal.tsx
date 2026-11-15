import { ArrowRight, X, AlertCircle } from "lucide-react";
import type { useClientesPage } from "../hooks/useClientesPage";

export function FormularioModal({
  modal,
  setModal,
  editCliente,
  editDivida,
  selecionado,
  erro,
  salvar,
  form,
  setForm,
  valor,
  setValor,
  situacao,
  setSituacao,
  saving,
}: Pick<
  ReturnType<typeof useClientesPage>,
  | "modal"
  | "setModal"
  | "editCliente"
  | "editDivida"
  | "selecionado"
  | "erro"
  | "salvar"
  | "form"
  | "setForm"
  | "valor"
  | "setValor"
  | "situacao"
  | "setSituacao"
  | "saving"
>) {
  return (
    <>
      {modal && (
        <div className="overlay modal-overlay" onClick={() => setModal(null)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow muted">
                  {modal === "cliente"
                    ? "DADOS DO CLIENTE"
                    : "CONTAS DO CLIENTE"}
                </span>
                <h2 id="modal-title">
                  {modal === "cliente"
                    ? editCliente
                      ? "Editar cliente"
                      : "Novo cliente"
                    : editDivida
                      ? "Editar conta"
                      : "Nova conta"}
                  <span>.</span>
                </h2>
                <p>
                  {modal === "cliente"
                    ? "Preencha os dados para manter tudo organizado."
                    : `Registro para ${selecionado?.nome}.`}
                </p>
              </div>
              <button
                className="icon-button"
                aria-label="Fechar"
                onClick={() => setModal(null)}
              >
                <X />
              </button>
            </div>
            {erro && (
              <div className="alert error">
                <AlertCircle size={18} />
                {erro}
              </div>
            )}
            <form onSubmit={salvar} className="form">
              {modal === "cliente" ? (
                <>
                  <label>
                    Nome completo
                    <input
                      required
                      minLength={5}
                      maxLength={80}
                      value={form.nome}
                      onChange={(e) =>
                        setForm({ ...form, nome: e.target.value })
                      }
                      placeholder="Nome do cliente"
                    />
                  </label>
                  <label>
                    CPF
                    <input
                      required
                      inputMode="numeric"
                      maxLength={14}
                      value={form.cpf}
                      onChange={(e) =>
                        setForm({ ...form, cpf: e.target.value })
                      }
                      placeholder="000.000.000-00"
                    />
                  </label>
                  <label>
                    E-mail <span>(opcional)</span>
                    <input
                      type="email"
                      maxLength={100}
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="email@exemplo.com"
                    />
                  </label>
                  <label>
                    Data de nascimento
                    <input
                      type="date"
                      required
                      max={new Date().toLocaleDateString("en-CA")}
                      value={form.dataNascimento}
                      onChange={(e) =>
                        setForm({ ...form, dataNascimento: e.target.value })
                      }
                    />
                  </label>
                </>
              ) : (
                <>
                  <label>
                    Valor da conta (R$)
                    <input
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      placeholder="0,00"
                    />
                  </label>
                  <label>
                    Situação
                    <select
                      value={situacao ? "paga" : "aberta"}
                      onChange={(e) => setSituacao(e.target.value === "paga")}
                    >
                      <option value="aberta">Em aberto</option>
                      <option value="paga">Paga</option>
                    </select>
                  </label>
                </>
              )}
              <div className="form-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setModal(null)}
                >
                  Cancelar
                </button>
                <button className="primary" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar alterações"}
                  <ArrowRight size={17} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
