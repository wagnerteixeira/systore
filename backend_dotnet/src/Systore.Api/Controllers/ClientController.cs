using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;

namespace Systore.Api.Controllers
{
  [Route("api/[controller]")]
  public class ClientController : BaseController<Client>
  {
    public ClientController(IClientService Service)
        : base(Service)
    {

    }
  }
}