using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using System;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Systore.Api.AutoMapperProfiles;
using Systore.Domain.Dtos;
using AutoMapper;
using System.Linq;
using Systore.Domain.Enums;

namespace Systore.Api.Controllers
{
    [Route("api/[controller]")]
    public class SaleController : BaseController<Sale>
    {
        private readonly IMapper _mapper;

        public SaleController(ISaleService Service, ILogger<SaleController> logger, IMapper mapper)
            : base(Service, logger)
        {
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet("GetSaleFullById/{id:int}")]
        public async Task<IActionResult> GetSaleFullById(int id)
        {            
            try
            {
                Sale sale = await (_service as ISaleService).GetSaleFullById(id);
                SaleDto saleDto = new SaleDto() {
                    ClientId = sale.ClientId,
                    FinalValue = sale.FinalValue,
                    Id = sale.Id,
                    ItemSale = null,
                    SaleDate = sale.SaleDate,
                    Vendor = sale.Vendor
                };

                saleDto.ItemSale = sale.ItemSale.Select(c => new ItemSaleDto() {
                    Action = ActionItem.NoChanges,
                    Id = c.Id,
                    Price = c.Price,
                    ProductId = c.ProductId,
                    Quantity = c.Quantity,
                    SaleId = c.SaleId,
                    TotalPrice = c.TotalPrice
                }).ToList();                

                return Ok(saleDto);                
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [Authorize]
        [HttpPost("post-dto")]
        // POST: api/Entity
        public async Task<IActionResult> Post([FromBody]SaleDto entity)
        {
            try
            {
                Sale sale = new Sale()
                {
                    ClientId = entity.ClientId,
                    FinalValue = entity.FinalValue,
                    Id = entity.Id,
                    SaleDate = entity.SaleDate,
                    Vendor = entity.Vendor
                };

                sale.ItemSale = entity.ItemSale.Select(c => new ItemSale()
                {
                    Id = c.Id,
                    Price = c.Price,
                    ProductId = c.ProductId,
                    Quantity = c.Quantity,
                    SaleId = c.SaleId,
                    TotalPrice = c.TotalPrice
                }).ToList();
                string ret = await _service.AddAsync(sale);
                var objectId = new { id = GetEntityId(sale) };
                if (string.IsNullOrWhiteSpace(ret))
                    return CreatedAtAction(nameof(Get), objectId, objectId);
                else
                    return SendBadRequest(ret.Split('|', StringSplitOptions.RemoveEmptyEntries));
            }
            catch (Exception e)
            {
                return SendBadRequest(e);
            }
        }

        [Authorize]
        [HttpPut("put-dto")]
        // PUT: api/Entity
        public async virtual Task<IActionResult> Put([FromBody]SaleDto entity)
        {
            try
            {                
                string ret = await (_service as ISaleService).UpdateAsync(entity);
                if (string.IsNullOrWhiteSpace(ret))
                    return Ok(entity);
                else
                    return SendBadRequest(ret.Split('|', StringSplitOptions.RemoveEmptyEntries));
            }
            catch (Exception e)
            {
                return SendBadRequest(e);
            }
        }


    }
}