# Obamart Web

O `Obamart.Web` é a interface de gestão de clientes e contas do Obamart. Construída com Next.js e React, ela permite consultar e manter clientes e acompanhar suas dívidas por meio da [API Obamart](API.md). Na interface, as dívidas são apresentadas como **contas**.

## Tecnologias e estrutura

- Next.js 16 com App Router, React 19 e TypeScript em modo estrito.
- `lucide-react` para ícones e CSS global para apresentação e responsividade.
- A rota `/` é definida pelo App Router em `app/page.tsx` e renderiza a tela cliente `views/ClientesPage.tsx`. Os dados e o estado da interface são mantidos com hooks do React.

| Arquivo | Responsabilidade |
| --- | --- |
| `Obamart.Web/app/page.tsx` | Entrada da rota principal. |
| `Obamart.Web/views/ClientesPage.tsx` | Composição da tela de clientes. |
| `Obamart.Web/components/` | Componentes visuais da tela, painéis e formulários. |
| `Obamart.Web/hooks/useClientesPage.ts` | Estado e ações da tela. |
| `Obamart.Web/services/` | Cliente HTTP e operações de clientes e dívidas. |
| `Obamart.Web/types/` e `Obamart.Web/utils/` | Tipos compartilhados e formatação de valores, datas e CPF. |
| `Obamart.Web/app/layout.tsx` | Layout raiz, idioma, metadados e inicialização do tema. |
| `Obamart.Web/app/globals.css` | Estilos globais, temas, estados de carregamento e regras responsivas. |
| `Obamart.Web/next.config.ts` | Encaminhamento das chamadas para a API. |
| `Obamart.Web/package.json` | Dependências e comandos do projeto. |

## Execução

É necessário ter Node.js e npm instalados, além da API e do banco de dados configurados e em execução. As instruções do backend estão em [API.md](API.md).

Na raiz do repositório:

```powershell
cd Obamart.Web
npm install
npm run dev
```

Acesse `http://localhost:3000`. No PowerShell, caso a execução de scripts esteja desabilitada, use `npm.cmd` no lugar de `npm`.

Os comandos disponíveis em `Obamart.Web` são:

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera a versão de produção. |
| `npm run start` | Inicia o servidor de produção após o build. |

## Configuração e integração com a API

O navegador chama caminhos relativos `/backend/...`. O servidor Next.js os encaminha para `${API_URL}/api/...`; por exemplo, `/backend/Cliente?page=1` é encaminhado para `http://localhost:5042/api/Cliente?page=1` por padrão. Assim, o navegador se comunica com a origem do Next.js, sem exigir configuração de CORS para essas chamadas.

Para alterar o endereço do backend, crie `Obamart.Web/.env.local`:

```dotenv
API_URL=http://localhost:5042
```

Use a origem da API, sem o sufixo `/api`, e reinicie o Next.js após alterar a configuração. O endereço precisa ser acessível pelo servidor Next.js. O rewrite é definido em `next.config.ts`.

As requisições usam JSON e `cache: "no-store"`. A função `api` interpreta respostas 204 sem corpo, apresenta mensagens de validação retornadas como lista ou `title` de um objeto de erro e exibe mensagens para falhas de conexão ou operação. Os dados vêm da API; a aplicação não implementa persistência própria para clientes e contas.

### Operações utilizadas

| Ação na interface | Método e caminho após `/backend/` |
| --- | --- |
| Listar ou buscar clientes | `GET Cliente?page={pagina}&pesquisa={termo}` |
| Cadastrar cliente | `POST Cliente` |
| Editar ou excluir cliente | `PUT` ou `DELETE Cliente/{id}` |
| Listar contas de um cliente | `GET Divida?clienteId={id}&page={pagina}` |
| Cadastrar conta | `POST Divida` |
| Editar ou excluir conta | `PUT` ou `DELETE Divida/{id}` |
| Registrar pagamento | `PATCH Divida/{id}/pagamento` |

Para regras do servidor e detalhes dos endpoints, consulte [API.md](API.md).

## Funcionamento da interface

### Clientes

Ao abrir a página, a interface carrega a primeira página de clientes. A tabela exibe nome, idade, CPF, contato e total em aberto. A busca por nome é aplicada ao enviar o formulário e retorna à primeira página. O botão de atualização recarrega a lista.

A paginação apresenta até 10 clientes por página. O botão de próxima página fica habilitado quando a página atual contém 10 registros; portanto, uma página seguinte pode estar vazia. Os indicadores superiores mostram a quantidade de clientes exibidos e a soma de `totalDividas` **somente da página atual**, não totais gerais.

Ao selecionar um cliente, abre-se um painel com seus dados e contas. Nesse painel é possível editar ou excluir o cliente; a exclusão exige confirmação. Conforme a API, excluir um cliente também exclui suas dívidas.

O formulário de cliente solicita nome (5 a 80 caracteres), CPF, data de nascimento e e-mail opcional (até 100 caracteres). A data não pode ser futura no formulário. Antes do envio, o CPF tem os caracteres não numéricos removidos e a data é enviada sem horário, no formato `AAAA-MM-DD`, conforme o campo `DateOnly` da API. As demais validações e regras de unicidade são responsabilidade da API.

### Contas

O painel do cliente carrega suas contas em páginas de até 20 registros. Como na lista de clientes, a próxima página é habilitada quando a página atual está cheia. Cada conta exibe valor, data de criação, situação e, quando disponível, data de pagamento.

É possível cadastrar, editar e excluir contas, além de marcar uma conta em aberto como paga. A exclusão exige confirmação. O formulário recebe valor numérico com mínimo de `0,01` e passo de `0,01`, além da situação **em aberto** ou **paga**. No contrato da API, `situacao: false` representa uma conta em aberto e `true`, uma conta paga. A API permite apenas uma dívida em aberto por cliente.

Após alterações, a interface recarrega as listas pertinentes e apresenta avisos de sucesso ou erro. Durante o carregamento, são exibidos placeholders e mensagens acessíveis; listas vazias têm mensagens próprias.

## Apresentação e estado local

- Valores são formatados em reais (`pt-BR`); datas são exibidas no padrão brasileiro com fuso UTC e CPFs de 11 dígitos são formatados para exibição.
- O tema inicial é escuro. A seleção claro/escuro é salva no `localStorage` sob a chave `obamart-theme` e aplicada na inicialização do documento.
- O layout se adapta a telas menores, com alterações na navegação, na tabela e nos painéis. A tabela permite rolagem horizontal quando necessário.
- O documento usa `lang="pt-BR"`; botões possuem rótulos acessíveis e os diálogos utilizam atributos ARIA. O diálogo de confirmação pode ser fechado com Escape quando não há exclusão em andamento.
