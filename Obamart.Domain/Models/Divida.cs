using System.ComponentModel.DataAnnotations;

namespace obamart.Models
{
    public class Divida
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid ClienteId { get; set; }

        [Required]
        public decimal Valor { get; set; }

        public bool Situacao { get; set; }

        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        public DateTime? DataPagamento { get; set; }
    }
}
