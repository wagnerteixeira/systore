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
using System.IO;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.WebUtilities;

namespace Systore.Api.Controllers
{
    [Route("api/[controller]")]
    public class ProductController : BaseController<Product>
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public ProductController(IProductService Service, ILogger<ProductController> logger, IHostingEnvironment hostingEnvironment)
            : base(Service, logger)
        {
            _hostingEnvironment = hostingEnvironment;
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

        [Authorize]
        [HttpPost("generate-files-to-balance")]
        public async Task<IActionResult> GenerateFilesToBalance([FromBody]int[] productsId)
        {
            try
            {
                string guid = Guid.NewGuid().ToString();
                var folder = Path.Combine(_hostingEnvironment.ContentRootPath, "temp", guid);
                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);
                var itensFileContent = await (_service as IProductService).GenerateFileContentItensToBalance(productsId);
                var infoFileContent = await (_service as IProductService).GenerateFileContentInfoToBalance(productsId);
                await (_service as IProductService).UpdateProductsExportedToBalance(productsId);
                
                return Ok(new
                {
                    itensFilecontent = Base64UrlTextEncoder.Encode(Encoding.UTF8.GetBytes(itensFileContent)),
                    infoFileContent = Base64UrlTextEncoder.Encode(Encoding.UTF8.GetBytes(infoFileContent)),
                });
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
        [HttpGet("download-temp-file/{folderGuid}/{fileNameBase64}")]
        public async Task<IActionResult> DownloadFile([FromRoute]string folderGuid, [FromRoute]string fileNameBase64)
        {
            try
            {
                string file = Encoding.UTF8.GetString(Base64UrlTextEncoder.Decode(fileNameBase64));
                var filePath = Path.Combine(_hostingEnvironment.ContentRootPath, "temp", folderGuid, file);
                string fileContent = await System.IO.File.ReadAllTextAsync(filePath);
                return File(Encoding.UTF8.GetBytes(fileContent), "text/plain", file);
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
        [HttpPost("generate-file-info-to-balance")]
        public async Task<IActionResult> GenerateFileInfoToBalance([FromBody]int[] productsId)
        {
            try
            {
                var result = await (_service as IProductService).GenerateFileContentItensToBalance(productsId);
                return File(Encoding.UTF8.GetBytes(result), "text/plain", "TXINFO.txt");
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