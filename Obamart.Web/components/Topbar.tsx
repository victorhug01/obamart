import { ChevronRight, Sun, Moon } from "lucide-react";
import type { useClientesPage } from "../hooks/useClientesPage";

export function Topbar({
  tema,
  alternarTema,
}: Pick<ReturnType<typeof useClientesPage>, "tema" | "alternarTema">) {
  return (
    <>
      <header className="topbar">
        <div>
          <span className="crumb">ESPAÇO DE TRABALHO</span>
          <ChevronRight size={14} />
          <span>Clientes</span>
        </div>
        <div className="top-right">
          <button
            className="theme-toggle"
            type="button"
            onClick={alternarTema}
            aria-label={
              tema === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
            }
            title={tema === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
          >
            {tema === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            <span>{tema === "dark" ? "Claro" : "Escuro"}</span>
          </button>
          <span className="online" /> Sistema de gestão
        </div>
      </header>
    </>
  );
}
