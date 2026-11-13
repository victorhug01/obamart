using System;
using System.Collections.Generic;
using System.Text;

namespace obamart.Models
{
    public class Cliente
    {
        public string Nome { get; set; }

        public string Cpf { get; set; }

        public string Email { get; set; }

        public DateTime DataNascimento { get; set; }

        public int Idade
        {
            get
            {
                var dataAtual = DateTime.Today;
                var idade = dataAtual.Year - DataNascimento.Year;
                if(dataAtual > DataNascimento.AddYears(-idade)) --idade;
                return idade;
            }
        }
    }
}
