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

        private ISaleService _service = null;

        public SaleController(ISaleService Service, ILogger<SaleController> logger)
            : base(Service, logger)
        {
            _service = Service;
        }

        [Authorize]
        [HttpGet("GetSaleFullById/{id:int}")]
        public virtual async Task<IActionResult> GetSaleFullById(int id)
        {            
            try
            {
                Sale teste = _service.GetSaleFullById(id);
                return Ok(teste);                
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

    }
}