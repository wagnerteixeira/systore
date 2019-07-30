using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using System;

namespace Systore.Api.Controllers
{
  [Route("api/[controller]")]
  public class UserController : BaseController<User>
  {
    public UserController(IUserService Service)
        : base(Service)
    {

    }

    public override object GetEntityId(User entity)
    {
      return $"código {entity.Id} ";
    }

  }
}