import { Check, X, AlertCircle } from "lucide-react";
import type { useClientesPage } from "../hooks/useClientesPage";

export function Avisos({
  erro,
  modal,
  setErro,
  aviso,
  setAviso,
}: Pick<
  ReturnType<typeof useClientesPage>,
  "erro" | "modal" | "setErro" | "aviso" | "setAviso"
>) {
  return (
    <>
      {erro && !modal && (
        <div className="alert error">
          <AlertCircle size={18} />
          {erro}
          <button onClick={() => setErro("")} aria-label="Fechar aviso">
            <X size={16} />
          </button>
        </div>
      )}
      {aviso && (
        <div className="alert success">
          <Check size={18} />
          {aviso}
          <button onClick={() => setAviso("")} aria-label="Fechar aviso">
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
