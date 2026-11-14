using obamart.Contexts;
using obamart.Models;
using System.ComponentModel.DataAnnotations;

namespace obamart.Services
{
    public class DividaService
    {
        private readonly ObamartDbContext context;

        public DividaService(ObamartDbContext context) => this.context = context;

        public List<Divida> Consultar(Guid clienteId, int page = 1)
        {
            int pageSize = 20;
            int skip = (page - 1) * pageSize;

            return context.Divida.Where(d => d.ClienteId == clienteId)
                .OrderByDescending(d => d.DataCriacao)
                .Skip(skip).Take(pageSize).ToList();
        }

        public bool Criar(Divida divida, out List<ValidationResult> erros)
        {
            if (!Validar(divida, out erros)) return false;

            divida.DataCriacao = DateTime.UtcNow;
            divida.DataPagamento = divida.Situacao ? DateTime.UtcNow : null;
            context.Divida.Add(divida);
            context.SaveChanges();
            return true;
        }

        public bool Atualizar(Guid id, Divida divida, out List<ValidationResult> erros)
        {
            var existente = context.Divida.Find(id);
            if (existente == null)
            {
                erros = new List<ValidationResult>();
                return false;
            }

            if (!Validar(divida, out erros, id)) return false;

            existente.ClienteId = divida.ClienteId;
            existente.Valor = divida.Valor;
            existente.DataPagamento = divida.Situacao ? existente.DataPagamento ?? DateTime.UtcNow: null;
            existente.Situacao = divida.Situacao;
            context.SaveChanges();
            return true;
        }

        public bool MarcarPagamento(Guid id)
        {
            var divida = context.Divida.Find(id);
            if (divida == null) return false;

            if (!divida.Situacao)
            {
                divida.Situacao = true;
                divida.DataPagamento = DateTime.UtcNow;
                context.SaveChanges();
            }
            return true;
        }

        public bool Excluir(Guid id)
        {
            var divida = context.Divida.Find(id);
            if (divida == null) return false;

            context.Divida.Remove(divida);
            context.SaveChanges();
            return true;
        }

        public bool Validar(Divida divida, out List<ValidationResult> erros, Guid? id = null)
        {
            erros = new List<ValidationResult>();
            Validator.TryValidateObject(divida, new ValidationContext(divida), erros, true);

            if (divida.Valor <= 0)
                erros.Add(new ValidationResult("O valor da dívida deve ser maior que zero.", new[] { nameof(Divida.Valor) }));

            if (!context.Cliente.Any(c => c.Id == divida.ClienteId))
                erros.Add(new ValidationResult("Cliente não encontrado.", new[] { nameof(Divida.ClienteId) }));

            if (!divida.Situacao && context.Divida.Any(d => d.ClienteId == divida.ClienteId && !d.Situacao && d.Id != id))
                erros.Add(new ValidationResult("O cliente já possui uma dívida em aberto.", new[] { nameof(Divida.ClienteId) }));

            return erros.Count == 0;
        }
    }
}
