using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Systore.Domain.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Systore.Api.Controllers
{
    [Route("api/[controller]")]
    public class ProductController : BaseController<Product>
    {
        public ProductController(IProductService Service)
            : base(Service)
        {

        }

        [Authorize]
        [HttpPost("get-products-for-export-to-balance")]
        public async Task<IActionResult> GetProductsForExportToBalance([FromBody]FilterProductsToBalance filterProductsToBalance)
        {
            try
            {
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
    }
}