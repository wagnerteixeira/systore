using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Systore.Domain.Dtos;
using Microsoft.AspNetCore.Authorization;
using System.Text;
using Microsoft.Extensions.Logging;
using Serilog;

namespace Systore.Api.Controllers
{
    [Route("api/[controller]")]
    public class ProductController : BaseController<Product>
    {
        public ProductController(IProductService Service, ILogger<ProductController> logger)
            : base(Service, logger)
        {
            
        }

        [Authorize]
        [HttpPost("get-products-for-export-to-balance")]
        public async Task<IActionResult> GetProductsForExportToBalance([FromBody]FilterProductsToBalance filterProductsToBalance)
        {
            try
            {
                throw new FormatException("Mensagem");
                var result = await (_service as IProductService).GetProductsForExportToBalance(filterProductsToBalance);
                return Ok(result);
            }
            catch (NotSupportedException e)
            {
                return SendBadRequest(e.Message.Split('|'));
            }
            catch (Exception e)
            {
                return SendBadRequest(e);
            }

        }

        [Authorize]
        [HttpPost("generate-file-itens-to-balance")]
        public async Task<IActionResult> GenerateFileItensToBalance([FromBody]int[] productsId)
        {
            try
            {
                var result = await (_service as IProductService).GenerateFileItensToBalance(productsId);                
                return File(Encoding.UTF8.GetBytes(result), "text/plain", "BALANCA.txt");
            }
            catch (NotSupportedException e)
            {
                _logger.LogError(e, "Error");
                return SendBadRequest(e.Message.Split('|'));
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error");
                return SendBadRequest(e);
            }

        }

        [Authorize]
        [HttpPost("generate-file-info-to-balance")]
        public async Task<IActionResult> GenerateFileInfoToBalance([FromBody]int[] productsId)
        {
            try
            {
                var result = await (_service as IProductService).GenerateFileItensToBalance(productsId);
                return File(Encoding.UTF8.GetBytes(result), "text/plain", "BALANCA.txt");
            }
            catch (NotSupportedException e)
            {
                return SendBadRequest(e.Message.Split('|'));
            }
            catch (Exception e)
            {
                return SendBadRequest(e);
            }

        }
    }
}