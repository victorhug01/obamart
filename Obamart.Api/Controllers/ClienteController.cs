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
        public IActionResult Listar([FromQuery] string? pesquisa, [FromQuery] int page = 1)
        {
            if (page < 1) return BadRequest("A página deve ser maior que zero.");
            return Ok(service.Consultar(pesquisa, page));
        }

        [HttpGet("{id:guid}")]
        public IActionResult Consultar(Guid id)
        {
            var cliente = service.ConsultarPorId(id);
            return cliente == null ? NotFound() : Ok(cliente);
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
