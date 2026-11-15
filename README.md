# Obamart

API em .NET 10 para cadastro de clientes e controle de dívidas, com PostgreSQL.

## Execução

1. Instale o SDK .NET 10 e o PostgreSQL e crie um banco vazio chamado `obamart`.
2. Execute `psql -U postgres -d obamart -f schema.sql` a partir da raiz do projeto.
3. Configure a conexão, por exemplo no PowerShell:

   ```powershell
   $env:ConnectionStrings__Postgres = 'Host=localhost;Port=5432;Database=obamart;Username=postgres;Password=SUA_SENHA'
   dotnet run --project Obamart.Api --launch-profile http
   ```

A API estará disponível em `http://localhost:5042`. Em desenvolvimento, a especificação OpenAPI está em `/openapi/v1.json`. O script cria as tabelas em um banco vazio; para um banco existente, adapte o schema e resolva CPFs duplicados ou dívidas em aberto duplicadas antes de criar os índices.

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/cliente?pesquisa=ana&page=1` | Busca por nome; 10 por página, ordenados pelo total em aberto. |
| GET | `/api/cliente/{id}` | Consulta um cliente. |
| POST | `/api/cliente` | Cadastra um cliente. |
| PUT | `/api/cliente/{id}` | Atualiza um cliente. |
| DELETE | `/api/cliente/{id}` | Exclui um cliente e suas dívidas. |
| GET | `/api/divida?clienteId={id}&page=1` | Lista dívidas de um cliente, 20 por página. |
| POST | `/api/divida` | Cadastra uma dívida. |
| PUT | `/api/divida/{id}` | Atualiza uma dívida. |
| PATCH | `/api/divida/{id}/pagamento` | Marca uma dívida como paga. |
| DELETE | `/api/divida/{id}` | Exclui uma dívida. |

Exemplo de cliente: `{"nome":"Ana Silva","cpf":"52998224725","dataNascimento":"1990-05-15","email":"ana@example.com"}`. O e-mail é opcional. A resposta da listagem inclui idade e `totalDividas`, a soma das dívidas não pagas.

Exemplo de dívida: `{"clienteId":"00000000-0000-0000-0000-000000000000","valor":50.00,"situacao":false}`; substitua o identificador pelo de um cliente existente. O servidor define a data de criação e a data de pagamento. Cada CPF só pode ser cadastrado uma vez e cada cliente pode ter apenas uma dívida em aberto. Erros de validação retornam HTTP 422; registros inexistentes nas operações individuais retornam 404.
