using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace obamart.Models
{
    public class Cliente
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required, MinLength(5), MaxLength(80)]
        public required string Nome { get; set; }

        [Required, StringLength(11)]
        public string Cpf { get; set; }

        [MaxLength(100), EmailAddress]
        public string Email { get; set; }

        [Required]
        public required DateTime DataNascimento { get; set; }

        public int Idade
        {
            get
            {
                var dataAtual = DateTime.Today;
                var idade = dataAtual.Year - DataNascimento.Year;
                if (DataNascimento.Date > dataAtual.AddYears(-idade)) --idade;
                return idade;
            }
        }
    }
}
