using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace Systore.Api.Controllers
{
    [Route("api/[controller]")]
    public class ClientController : BaseController<Client>
    {

        public ClientController(IClientService Service, ILogger<ClientController> logger)
            : base(Service, logger)
        {

        }

        [Authorize]
        [HttpDelete("{id:int}")]        
        public override async Task<IActionResult> Delete([FromRoute]int id)
        {

            if (await (_service as IClientService).ExistBillReceiveForClient(id))
            {
                return SendBadRequest("Não é possível excluir o cliente pois ele possui títulos.");//BadRequest(new { errors = new[] { "Nao foi possivel" }  };
            }

            return await base.Delete(id);
        }

        [Authorize]
        [HttpPost("")]
        public override async Task<IActionResult> Post([FromBody]Client entity)
        {
            var _client = await _service.FirstOrDefaultAsync(c => c.Cpf == entity.Cpf);
            if (_client != null)
            {

                return SendBadRequest($"Já existe um cliente com o CPF {_client.Cpf}, {_client.Name}");
            }
            return await base.Post(entity);
        }

        [Authorize]
        [HttpPut("")]
        public override async Task<IActionResult> Put([FromBody]Client entity)
        {
            var _client = await _service.FirstOrDefaultAsync(c => c.Cpf == entity.Cpf && c.Id != entity.Id);
            if (_client != null)
            {
                return SendBadRequest($"Já existe um cliente com o CPF {_client.Cpf}, {_client.Name}");
            }
            return await base.Put(entity);
        }

        [Authorize]
        [HttpGet("existcpf/{edit}/{id}/{cpf}")]        
        public async Task<IActionResult> ExistCpf([FromRoute]int Edit, [FromRoute]int Id, [FromRoute]string Cpf)
        {
            var _client = (Edit == 1) ?
                           await _service.FirstOrDefaultAsync(c => c.Cpf == Cpf && c.Id != Id) :
                           await _service.FirstOrDefaultAsync(c => c.Cpf == Cpf);

            if (_client != null)
                return SendStatusCode(412, $"Já existe um cliente com o CPF {_client.Cpf}, {_client.Name}");
            else
                return Ok("");
        }
    }
}