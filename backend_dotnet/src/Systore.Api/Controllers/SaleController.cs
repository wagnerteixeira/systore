using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using System;

namespace Systore.Api.Controllers
{
    [Route("api/[controller]")]
    public class SaleController : BaseController<Sale>
    {
        public SaleController(ISaleService Service)
            : base(Service)
        {

        }
    }
}