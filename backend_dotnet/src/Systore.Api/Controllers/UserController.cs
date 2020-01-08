using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using System;
using Microsoft.Extensions.Logging;

namespace Systore.Api.Controllers
{
  [Route("api/[controller]")]
  public class UserController : BaseController<User>
  {
    public UserController(IUserService Service, ILogger<UserController> logger)
        : base(Service, logger)
    {

    }
  }
}