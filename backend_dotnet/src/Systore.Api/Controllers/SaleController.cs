using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using System;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace Systore.Api.Controllers
{
    [Route("api/[controller]")]
    public class SaleController : BaseController<Sale>
    {        

        public SaleController(ISaleService Service, ILogger<SaleController> logger)
            : base(Service, logger)
        {
            
        }

        [Authorize]
        [HttpGet("GetSaleFullById/{id:int}")]
        public virtual async Task<IActionResult> GetSaleFullById(int id)
        {            
            try
            {                
                return Ok(await (_service as ISaleService).GetSaleFullById(id));                
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

    }
}