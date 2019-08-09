using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using System;

namespace Systore.Api.Controllers
{
    [Route("api/[controller]")]
    public class SaleProductsController : BaseController<SaleProducts>
    {
        public SaleProductsController(ISaleProductsService Service)
            : base(Service)
        {

        }
    }
}