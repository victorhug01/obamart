"use client";

import { useCallback, useEffect, useState } from "react";
import type { Cliente, Divida, Modal } from "../types/models";
import { clientesService } from "../services/clientes";
import { dividasService } from "../services/dividas";

const vazio = { nome: "", cpf: "", email: "", dataNascimento: "" };
export function useClientesPage() {
  const [tema, setTema] = useState<"light" | "dark">("dark");
  useEffect(() => {
    setTema(
      document.documentElement.dataset.theme === "light" ? "light" : "dark",
    );
  }, []);
  function alternarTema() {
    const proximo = tema === "dark" ? "light" : "dark";
    setTema(proximo);
    document.documentElement.dataset.theme = proximo;
    try {
      localStorage.setItem("obamart-theme", proximo);
    } catch {}
  }
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [page, setPage] = useState(1);
  const [busca, setBusca] = useState("");
  const [termo, setTermo] = useState("");
  const [selecionado, setSelecionado] = useState<Cliente | null>(null);
  const [dividas, setDividas] = useState<Divida[]>([]);
  const [divPage, setDivPage] = useState(1);
  const [confirmacao, setConfirmacao] = useState<
    | { tipo: "cliente"; cliente: Cliente }
    | { tipo: "divida"; divida: Divida }
    | null
  >(null);
  const [excluindo, setExcluindo] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [editCliente, setEditCliente] = useState<Cliente | null>(null);
  const [editDivida, setEditDivida] = useState<Divida | null>(null);
  const [form, setForm] = useState(vazio);
  const [valor, setValor] = useState("");
  const [situacao, setSituacao] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingDividas, setLoadingDividas] = useState(true);
  const [saving, setSaving] = useState(false);
  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const result = await clientesService.listar(page, termo);
      setClientes(result);
      setErro("");
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, termo]);
  const carregarDividas = useCallback(async (id: string, pagina: number) => {
    setLoadingDividas(true);
    try {
      setDividas(await dividasService.listar(id, pagina));
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setLoadingDividas(false);
    }
  }, []);
  useEffect(() => {
    carregar();
  }, [carregar]);
  useEffect(() => {
    if (selecionado) carregarDividas(selecionado.id, divPage);
  }, [selecionado, divPage, carregarDividas]);
  function abrirCliente(cliente?: Cliente) {
    setErro("");
    setEditCliente(cliente || null);
    setForm(
      cliente
        ? {
            nome: cliente.nome,
            cpf: cliente.cpf,
            email: cliente.email || "",
            dataNascimento: cliente.dataNascimento.slice(0, 10),
          }
        : vazio,
    );
    setModal("cliente");
  }
  function abrirDivida(divida?: Divida) {
    setErro("");
    setEditDivida(divida || null);
    setValor(divida ? String(divida.valor) : "");
    setSituacao(divida?.situacao || false);
    setModal("divida");
  }
  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErro("");
    try {
      if (modal === "cliente") {
        await clientesService.salvar(
          {
            ...form,
            cpf: form.cpf.replace(/\D/g, ""),
            dataNascimento: form.dataNascimento,
          },
          editCliente?.id,
        );
        setAviso(
          editCliente
            ? "Cliente atualizado com sucesso."
            : "Cliente cadastrado com sucesso.",
        );
        if (editCliente && selecionado?.id === editCliente.id)
          setSelecionado({ ...selecionado, ...form });
      }
      if (modal === "divida" && selecionado) {
        await dividasService.salvar(
          { clienteId: selecionado.id, valor: Number(valor), situacao },
          editDivida?.id,
        );
        setAviso(
          editDivida
            ? "Conta atualizada com sucesso."
            : "Conta registrada com sucesso.",
        );
        await carregarDividas(selecionado.id, divPage);
      }
      setModal(null);
      await carregar();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setSaving(false);
    }
  }
  async function acao(operacao: () => Promise<unknown>, mensagem: string) {
    setErro("");
    try {
      await operacao();
      setAviso(mensagem);
      if (selecionado) await carregarDividas(selecionado.id, divPage);
      await carregar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }
  function pagarDivida(id: string) {
    return acao(() => dividasService.pagar(id), "Pagamento registrado.");
  }
  function excluirDivida(id: string) {
    return acao(() => dividasService.excluir(id), "Conta excluída.");
  }
  async function excluirCliente(c: Cliente) {
    try {
      await clientesService.excluir(c.id);
      setSelecionado(null);
      setAviso("Cliente excluído.");
      await carregar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }
  const totalPagina = clientes.reduce((total, c) => total + c.totalDividas, 0);
  return {
    tema,
    alternarTema,
    clientes,
    page,
    setPage,
    busca,
    setBusca,
    termo,
    setTermo,
    selecionado,
    setSelecionado,
    dividas,
    setDividas,
    divPage,
    setDivPage,
    confirmacao,
    setConfirmacao,
    excluindo,
    setExcluindo,
    modal,
    setModal,
    editCliente,
    editDivida,
    form,
    setForm,
    valor,
    setValor,
    situacao,
    setSituacao,
    erro,
    setErro,
    aviso,
    setAviso,
    loading,
    loadingDividas,
    setLoadingDividas,
    saving,
    carregar,
    abrirCliente,
    abrirDivida,
    salvar,
    pagarDivida,
    excluirDivida,
    excluirCliente,
    totalPagina,
  };
}
