# Obamart Web

Interface Next.js para cadastro de clientes e gestão de contas da API Obamart.

## Executar

1. Inicie a API e seu banco de dados. Por padrão, o frontend usa `http://localhost:5042`.
2. Execute `npm install` e depois `npm run dev` (no PowerShell, use `npm.cmd` se a execução de scripts estiver desabilitada).
3. Acesse http://localhost:3000.

Para outro endereço da API, crie um arquivo `.env.local` com `API_URL=http://localhost:5042` e reinicie o Next.js. As requisições passam pelo servidor Next.js, sem necessidade de configurar CORS na API.

A API limita as listagens a 10 clientes e 20 contas por página e permite apenas uma dívida em aberto por cliente. Os resumos no topo se referem somente à página atual.
