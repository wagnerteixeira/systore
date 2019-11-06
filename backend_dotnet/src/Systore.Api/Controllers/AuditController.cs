using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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
        private readonly ILogger<AuditController> _logger;

        public AuditController(IAuditService auditService, ILogger<AuditController> logger)
        {
            _auditService = auditService;
            _logger = logger;
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
                return SendBadRequest(e);
            }
        }

         protected IActionResult SendBadRequest(Exception e)
        {
            _logger.LogError(e, "Exception error: ");
            string error = e.Message;
            if (e.InnerException != null)
            {
                error += '|' + e.InnerException.Message;
                if (e.InnerException.InnerException != null)
                    error += '|' + e.InnerException.InnerException.Message;

            }

            return BadRequest(new { errors = error.Split('|') });
        }
    }
}
