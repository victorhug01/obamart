using Microsoft.AspNetCore.Mvc;
using obamart.Models;
using obamart.Services;

namespace Obamart.Api.Controllers
{
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private ClienteService service;
        public ClienteController(ClienteService service)
        {
            this.service = service;
        }

        [HttpGet]
        public IActionResult Listar()
        {
            var alunos = service.Consultar();
            return Ok(alunos);
        }

        [HttpPost]
        public IActionResult Cadastrar([FromBody] Cliente cliente)
        {
            var sucesso = service.Criar(cliente, out var erros);
            if (sucesso) return Ok(cliente);
            return UnprocessableEntity(erros);
        }
    }
}
