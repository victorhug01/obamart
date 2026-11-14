using Microsoft.EntityFrameworkCore;
using obamart.Contexts;
using obamart.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace obamart.Services
{
    public class ClienteService
    {
        private ObamartDbContext context;

        public ClienteService(ObamartDbContext context) => this.context = context;

        public List<Cliente> Consultar(int page = 1)
        {
            int pageSize = 20;
            int skip = (page - 1) * pageSize;

            var resultado = context.Cliente.OrderBy(a => a.Nome).Skip(skip).Take(pageSize).ToList();

            return resultado;
        }

        public List<Cliente> Consultar(string pesquisa, int page = 1)
        {
            var cliente = Consultar();
            int pageSize = 20;

            int skip = (page - 1) * pageSize;

            var resultado = context.Cliente
                .Where((cliente) => cliente.Nome.Contains(pesquisa) || cliente.Email.Contains(pesquisa) || cliente.Cpf == pesquisa)
                .OrderBy(x => x.Nome)
                .Skip(skip) 
                .Take(pageSize);

            return resultado.ToList();
        }

        public bool Criar(Cliente cliente, out List<ValidationResult> erros)
        {
            if (!Validar(cliente, out erros)) return false;

            cliente.DataNascimento = cliente.DataNascimento.Date.ToUniversalTime();
            context.Add(cliente);
            context.SaveChanges();

            return true;
        }

        public bool Validar(Cliente cliente, out List<ValidationResult> erros)
        {
            var context = new ValidationContext(cliente);
            erros = new List<ValidationResult>();
            return Validator.TryValidateObject(cliente, context, erros, true);

        }
    }
}
