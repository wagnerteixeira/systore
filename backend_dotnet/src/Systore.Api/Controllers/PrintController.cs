using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Systore.Domain.Abstractions;

namespace Systore.Api.Controllers
{
    [Route("api/[controller]")]
    public class PrintController : ControllerBase
    {
        private readonly ILogger<PrintController> _logger;

        private readonly IReport _report;

        public PrintController(ILogger<PrintController> logger, IReport report)
        {
            _logger = logger;
            _report = report;
        }

        [Authorize]
        [HttpGet("printer-test")]
        public async Task<IActionResult> PrinterTest()
        {
            var res = await _report.GenerateReport("", new object[] { });
            return File(res, "application/pdf", "");
        }
    }
}
