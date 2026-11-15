"use client";

import { useClientesPage } from "../hooks/useClientesPage";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { Intro } from "../components/Intro";
import { Avisos } from "../components/Avisos";
import { Resumo } from "../components/Resumo";
import { BuscaClientes } from "../components/BuscaClientes";
import { ListaClientes } from "../components/ListaClientes";
import { PainelCliente } from "../components/PainelCliente";
import { ConfirmacaoExclusao } from "../components/ConfirmacaoExclusao";
import { FormularioModal } from "../components/FormularioModal";

export function ClientesPage() {
  const state = useClientesPage();
  return (
    <main className="shell">
      <Sidebar />
      <section className="workspace">
        <Topbar {...state} />
        <div className="content">
          <Intro {...state} />
          <Avisos {...state} />
          <Resumo {...state} />
          <BuscaClientes {...state} />
          <ListaClientes {...state} />
        </div>
      </section>
      <PainelCliente {...state} />
      <ConfirmacaoExclusao {...state} />
      <FormularioModal {...state} />
    </main>
  );
}
