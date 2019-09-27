using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Systore.Domain.Abstractions;

namespace Systore.Api.Controllers
{
    [Route("api/[controller]")]
    public class AuditController : ControllerBase
    {
        private readonly IAuditService _auditService;

        public AuditController(IAuditService auditService)
        {
            _auditService = auditService;
        }
        [Authorize]
        [HttpGet("")]
        // GET: api/Entity
        public virtual async Task<IActionResult> GetAllAsync([FromQuery]DateTime initialDate, [FromQuery]DateTime finalDate)
        {
            try
            {
                return Ok(await _auditService.GetAuditsByDateAsync(initialDate, finalDate));
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
    }
}
