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

        public bool Atualizar(Guid id, Cliente cliente, out List<ValidationResult> erros)
        {
            var existente = context.Cliente.Find(id);
            if (existente == null)
            {
                erros = new List<ValidationResult>();
                return false;
            }

            if (!Validar(cliente, out erros)) return false;

            existente.Nome = cliente.Nome;
            existente.Cpf = cliente.Cpf;
            existente.Email = cliente.Email;
            existente.DataNascimento = cliente.DataNascimento.Date.ToUniversalTime();
            context.SaveChanges();
            return true;
        }

        public bool Excluir(Guid id)
        {
            var cliente = context.Cliente.Find(id);
            if (cliente == null) return false;

            context.Cliente.Remove(cliente);
            context.SaveChanges();
            return true;
        }

        public bool Validar(Cliente cliente, out List<ValidationResult> erros)
        {
            var context = new ValidationContext(cliente);
            erros = new List<ValidationResult>();
            Validator.TryValidateObject(cliente, context, erros, true);

            if (!string.IsNullOrWhiteSpace(cliente.Cpf) && !CpfValido(cliente.Cpf))
                erros.Add(new ValidationResult("CPF inválido.", new[] { nameof(Cliente.Cpf) }));

            return erros.Count == 0;
        }

        private static bool CpfValido(string cpf)
        {
            if (cpf.Length != 11 || cpf.Any(c => c < '0' || c > '9') || cpf.All(c => c == cpf[0]))
                return false;

            for (int digito = 9; digito <= 10; digito++)
            {
                int soma = 0;
                for (int i = 0; i < digito; i++)
                    soma += (cpf[i] - '0') * (digito + 1 - i);

                int resto = soma % 11;
                int esperado = resto < 2 ? 0 : 11 - resto;
                if (cpf[digito] - '0' != esperado) return false;
            }

            return true;
        }
    }
}
