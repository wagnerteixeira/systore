using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;

namespace Systore.Api.Controllers
{
  [Route("api/[controller]")]
  public class BillReceiveController : BaseController<BillReceive>
  {
    public BillReceiveController(IBillReceiveService Service)
        : base(Service)
    {

    }
  }
}