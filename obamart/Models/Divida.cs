using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace obamart.Models
{
    public class Divida
    {
        [Required]
        public double Valor { get; set; }

        [Required]
        public string Situacao { get; set; }
    }
}
