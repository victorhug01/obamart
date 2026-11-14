using obamart.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace obamart.Services
{
    public class ClienteService
    {

        public bool Criar(Cliente cliente, out List<ValidationResult> erros)
        {
            if (!Validar(cliente, out erros)) return false;

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
