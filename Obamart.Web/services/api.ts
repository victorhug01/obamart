export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/backend/${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Não foi possível conectar à API. Verifique se ela está em execução.",
    );
  }
  if (!res.ok) {
    const body = await res.text();
    try {
      const parsed = JSON.parse(body);
      if (Array.isArray(parsed))
        throw new Error(
          parsed
            .map(
              (e: { errorMessage?: string }) =>
                e.errorMessage || "Dados inválidos.",
            )
            .join(" "),
        );
      if (parsed.title) throw new Error(parsed.title);
    } catch (e) {
      if (e instanceof SyntaxError) {
        /* texto simples */
      } else throw e;
    }
    throw new Error(
      res.status >= 500
        ? "A API não conseguiu concluir a operação. Verifique sua conexão e tente novamente."
        : body || "Não foi possível concluir a operação.",
    );
  }
  return res.status === 204 ? (undefined as T) : res.json();
}
