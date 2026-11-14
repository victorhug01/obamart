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

        [HttpPut("{id:guid}")]
        public IActionResult Atualizar(Guid id, [FromBody] Cliente cliente)
        {
            if (service.Atualizar(id, cliente, out var erros)) return NoContent();
            if (erros.Count == 0) return NotFound();
            return UnprocessableEntity(erros);
        }

        [HttpDelete("{id:guid}")]
        public IActionResult Excluir(Guid id)
        {
            if (!service.Excluir(id)) return NotFound();
            return NoContent();
        }
    }
}
