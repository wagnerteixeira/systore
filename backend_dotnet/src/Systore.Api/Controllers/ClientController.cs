using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using System.Threading.Tasks;

namespace Systore.Api.Controllers
{
  [Route("api/[controller]")]
  public class ClientController : BaseController<Client>
  {

    public ClientController(IClientService Service)
        : base(Service)
    {

    }
    public override async Task<IActionResult> Delete(Client entity)
    {

      if (await (_service as IClientService).ExistBillReceiveForClient(entity.Id))
      {
        return SendBadRequest("Não é possível excluir o cliente pois ele possui títulos.");//BadRequest(new { errors = new[] { "Nao foi possivel" }  };
      }

      return await base.Delete(entity);
    }

    public override async Task<IActionResult> Post(Client entity)
    {
      var _client = await _service.FirstOrDefault(c => c.Cpf == entity.Cpf);
      if (_client != null)
      {

        return SendBadRequest($"Já existe um cliente com o CPF {_client.Cpf}, {_client.Name}");
      }
      return await base.Post(entity);
    }

    public override async Task<IActionResult> Put(Client entity)
    {
      var _client = await _service.FirstOrDefault(c => c.Cpf == entity.Cpf && c.Id != entity.Id);
      if (_client != null)
      {
        return SendBadRequest($"Já existe um cliente com o CPF {_client.Cpf}, {_client.Name}");
      }
      return await base.Put(entity);
    }

    [HttpGet]
    [Route("existcpf/{edit}/{id}/{cpf}")]
    public async Task<IActionResult> ExistCpf(int Edit, int Id, string Cpf){
     var _client = (Edit == 1) ? 
                    await _service.FirstOrDefault(c => c.Cpf == Cpf && c.Id != Id) :
                    await _service.FirstOrDefault(c => c.Cpf == Cpf);

      if (_client != null)
        return SendStatusCode(412, $"Já existe um cliente com o CPF {_client.Cpf}, {_client.Name}");
      else
        return Ok("");
    }
  }
}