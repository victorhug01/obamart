using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using obamart.Contexts;
using obamart.Models;

namespace obamart.Services
{
    public class ClienteService
    {
        private readonly ObamartDbContext context;
        public ClienteService(ObamartDbContext context) => this.context = context;

        public List<ClienteResumo> Consultar(string pesquisa = null, int page = 1)
        {
            var clientes = context.Cliente.AsNoTracking().AsQueryable();
            if (!string.IsNullOrWhiteSpace(pesquisa))
                clientes = clientes.Where(c => c.Nome.ToLower().Contains(pesquisa.ToLower()));

            var resultados = clientes.Select(c => new
            {
                Cliente = c,
                TotalDividas = context.Divida.Where(d => d.ClienteId == c.Id && !d.Situacao)
                    .Sum(d => (decimal?)d.Valor) ?? 0m
            }).OrderByDescending(c => c.TotalDividas).ThenBy(c => c.Cliente.Nome)
                .ThenBy(c => c.Cliente.Id).Skip((page - 1) * 10).Take(10).ToList();

            return resultados.Select(c => new ClienteResumo(c.Cliente.Id, c.Cliente.Nome, c.Cliente.Cpf,
                c.Cliente.Email, c.Cliente.DataNascimento, c.Cliente.Idade, c.TotalDividas)).ToList();
        }

        public Cliente ConsultarPorId(Guid id) => context.Cliente.AsNoTracking().FirstOrDefault(c => c.Id == id);

        public bool Criar(Cliente cliente, out List<ValidationResult> erros)
        {
            if (!Validar(cliente, out erros)) return false;
            cliente.DataNascimento = DateTime.SpecifyKind(cliente.DataNascimento.Date, DateTimeKind.Utc);
            context.Cliente.Add(cliente);
            return Salvar(erros);
        }

        public bool Atualizar(Guid id, Cliente cliente, out List<ValidationResult> erros)
        {
            var existente = context.Cliente.Find(id);
            if (existente == null)
            {
                erros = new List<ValidationResult>();
                return false;
            }
            if (!Validar(cliente, out erros, id)) return false;
            existente.Nome = cliente.Nome;
            existente.Cpf = cliente.Cpf;
            existente.Email = cliente.Email;
            existente.DataNascimento = DateTime.SpecifyKind(cliente.DataNascimento.Date, DateTimeKind.Utc);
            return Salvar(erros);
        }

        public bool Excluir(Guid id)
        {
            var cliente = context.Cliente.Find(id);
            if (cliente == null) return false;
            context.Cliente.Remove(cliente);
            context.SaveChanges();
            return true;
        }

        public bool Validar(Cliente cliente, out List<ValidationResult> erros, Guid? id = null)
        {
            erros = new List<ValidationResult>();
            Validator.TryValidateObject(cliente, new ValidationContext(cliente), erros, true);
            if (!string.IsNullOrWhiteSpace(cliente.Cpf) && !CpfValido(cliente.Cpf))
                erros.Add(new ValidationResult("CPF inválido.", new[] { nameof(Cliente.Cpf) }));
            if (!string.IsNullOrWhiteSpace(cliente.Cpf) && context.Cliente.Any(c => c.Cpf == cliente.Cpf && c.Id != id))
                erros.Add(new ValidationResult("CPF já cadastrado.", new[] { nameof(Cliente.Cpf) }));
            if (cliente.DataNascimento == default || cliente.DataNascimento.Date > DateTime.Today)
                erros.Add(new ValidationResult("Data de nascimento inválida.", new[] { nameof(Cliente.DataNascimento) }));
            return erros.Count == 0;
        }

        private bool Salvar(List<ValidationResult> erros)
        {
            try { context.SaveChanges(); return true; }
            catch (DbUpdateException ex) when (ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation, ConstraintName: "ux_cliente_cpf" })
            {
                erros.Add(new ValidationResult("CPF já cadastrado.", new[] { nameof(Cliente.Cpf) }));
                return false;
            }
        }

        private static bool CpfValido(string cpf)
        {
            if (cpf.Length != 11 || cpf.Any(c => c < '0' || c > '9') || cpf.All(c => c == cpf[0])) return false;
            for (int digito = 9; digito <= 10; digito++)
            {
                int soma = 0;
                for (int i = 0; i < digito; i++) soma += (cpf[i] - '0') * (digito + 1 - i);
                int resto = soma % 11;
                if (cpf[digito] - '0' != (resto < 2 ? 0 : 11 - resto)) return false;
            }
            return true;
        }
    }

    public record ClienteResumo(Guid Id, string Nome, string Cpf, string Email, DateTime DataNascimento, int Idade, decimal TotalDividas);
}
