using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using System;
using Microsoft.Extensions.Logging;

namespace Systore.Api.Controllers
{
    public class SaleProductsController : BaseController<SaleProducts>
    {
        public SaleProductsController(ISaleProductsService Service, ILogger<SaleProductsController> logger)
            : base(Service, logger)
        {

        }
    }
}