using Microsoft.AspNetCore.Mvc;
using obamart.Models;
using obamart.Services;

namespace Obamart.Api.Controllers
{
    [Route("api/[controller]")]
    public class DividaController : ControllerBase
    {
        private readonly DividaService service;
        public DividaController(DividaService service) => this.service = service;

        [HttpGet]
        public IActionResult Listar([FromQuery] Guid clienteId, [FromQuery] int page = 1)
        {
            if (clienteId == Guid.Empty || page < 1) return BadRequest("Informe o cliente e uma página válida.");
            return Ok(service.Consultar(clienteId, page));
        }

        [HttpPost]
        public IActionResult Cadastrar([FromBody] Divida divida)
        {
            if (service.Criar(divida, out var erros)) return Ok(divida);
            return UnprocessableEntity(erros);
        }

        [HttpPut("{id:guid}")]
        public IActionResult Atualizar(Guid id, [FromBody] Divida divida)
        {
            if (service.Atualizar(id, divida, out var erros)) return NoContent();
            return erros.Count == 0 ? NotFound() : UnprocessableEntity(erros);
        }

        [HttpPatch("{id:guid}/pagamento")]
        public IActionResult MarcarPagamento(Guid id) => service.MarcarPagamento(id) ? NoContent() : NotFound();

        [HttpDelete("{id:guid}")]
        public IActionResult Excluir(Guid id) => service.Excluir(id) ? NoContent() : NotFound();
    }
}
