using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using System;
using Microsoft.Extensions.Logging;

namespace Systore.Api.Controllers
{
    [Route("api/[controller]")]
    public class SaleController : BaseController<Sale>
    {
        public SaleController(ISaleService Service, ILogger<SaleController> logger)
            : base(Service, logger)
        {

        }
    }
}