using Application.Domain.Entities;
using Application.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/person")]
    public class PersonController : BaseController<Person>
    {
        public PersonController(IPersonService Service)
            : base(Service)
        {

        }
    }
}