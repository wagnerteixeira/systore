using System;
using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Enums;
using Systore.Domain.Dtos;
using Systore.Domain.Abstractions;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace Systore.Api.Controllers
{
    [Route("api/[controller]")]
    public class BillReceiveController : BaseController<BillReceive>
    {
        public BillReceiveController(IBillReceiveService Service)
            : base(Service)
        {

        }

        [Authorize]
        [HttpGet("client/{clientid}")]
        public async Task<IActionResult> GetBillReceivesByClient(int ClientId)
        {
            try
            {
                var result = await (_service as IBillReceiveService).GetBillReceivesByClient(ClientId);
                return Ok(result);
            }
            catch (Exception e)
            {
                return SendBadRequest(e);
            }
        }

        [Authorize]
        [HttpGet("client/{clientid}/paid")]                
        public async Task<IActionResult> GetPaidBillReceivesByClient(int ClientId)
        {
            try
            {
                var result = await (_service as IBillReceiveService).GetPaidBillReceivesByClient(ClientId);
                return Ok(result);
            }
            catch (Exception e)
            {
                return SendBadRequest(e);
            }
        }

        [Authorize]
        [HttpGet("client/{clientid}/nopaid")]
        public async Task<IActionResult> GetNoPaidBillReceivesByClient(int ClientId)
        {
            try
            {
                var result = await (_service as IBillReceiveService).GetNoPaidBillReceivesByClient(ClientId);
                return Ok(result);
            }
            catch (Exception e)
            {
                return SendBadRequest(e);
            }
        }

        [Authorize]
        [HttpGet("nextcode")]                
        public async Task<IActionResult> NextCode()
        {
            try
            {
                var result = await (_service as IBillReceiveService).NextCode();
                return Ok(result);
            }
            catch (Exception e)
            {
                return SendBadRequest(e);
            }
        }


        [Authorize]
        [HttpPost("createbillreceives")]
        public async Task<IActionResult> CreateBillReceives([FromBody]CreateBillReceivesDto createBillReceivesDto)
        {
            try
            {
                var result = await (_service as IBillReceiveService).CreateBillReceives(createBillReceivesDto);
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
        [HttpDelete("{code:int}")]                
        public override async Task<IActionResult> Delete([FromRoute]int Code)
        {
            if (await (_service as IBillReceiveService).CountWhereAsync(c => c.Code == Code) == 0)
                return SendBadRequest("Carnê não encontrado!");
            if (await (_service as IBillReceiveService).CountWhereAsync(c => c.Code == Code && c.Situation == BillReceiveSituation.Closed) > 0)
                return SendBadRequest("Carnê não pode ser excluído pois existe parcela paga!");

            await (_service as IBillReceiveService).RemoveBillReceivesByCode(Code);
            return Ok();
        }

    }


}