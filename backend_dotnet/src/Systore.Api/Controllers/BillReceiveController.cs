using System;
using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Enums;
using Systore.Domain.Dtos;
using Systore.Domain.Abstractions;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Systore.Api.Controllers
{
  [Route("api/[controller]")]
  public class BillReceiveController : BaseController<BillReceive>
  {
    public BillReceiveController(IBillReceiveService Service)
        : base(Service)
    {

    }
    [HttpGet]
    [Route("client/{clientid}")]
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

    [HttpGet]
    [Route("client/{clientid}/paid")]
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

    [HttpGet]
    [Route("client/{clientid}/nopaid")]
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

    [HttpGet]
    [Route("nextcode")]
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

    [HttpGet]
    [Route("createbillreceives2")]
    public IActionResult CreateBillReceives2()
    {
      List<BillReceive> billReceives = new List<BillReceive>();
      billReceives.Add(new BillReceive(){
            Quota = 1,
            OriginalValue = 25.64M,
            Interest = 0,
            FinalValue = 25.36M,
            DueDate = DateTime.Now,
            Vendor = "TESTE"
          });
        billReceives.Add(new BillReceive(){
            Quota = 2,
            OriginalValue = 25.64M,
            Interest = 0,
            FinalValue = 25.36M,
            DueDate = DateTime.Now,
            Vendor = "TESTE"
          });

      var result = new CreateBillReceivesDto(){
        BillReceives = billReceives,
        OriginalValue = 154.36M,
        PurchaseDate = DateTime.Now.AddDays(-10)
      };
      return Ok(result);
    }
    

    [HttpPost]
    [Route("createbillreceives")]
    public async Task<IActionResult> CreateBillReceives([FromBody]CreateBillReceivesDto createBillReceivesDto)
    {
      try
      {
        var result = await (_service as IBillReceiveService).CreateBillReceives(createBillReceivesDto);
        return Ok(result);
      }
      catch(NotSupportedException e){
        return SendBadRequest(e.Message.Split('|'));
      }
      catch (Exception e)
      {
        return SendBadRequest(e);
      }
    }

    [HttpDelete]
    [Route("{code:int}")]
    public override async Task<IActionResult> Delete([FromRoute]int Code)
    {
      if (await (_service as IBillReceiveService).CountWhereAsync(c=> c.Code == Code) == 0)
        return SendBadRequest("Carnê não encontrado!");
      if (await (_service as IBillReceiveService).CountWhereAsync(c=> c.Code == Code && c.Situation == BillReceiveSituation.Closed) > 0)
        return SendBadRequest("Carnê não pode ser excluído pois existe parcela paga!");
      
      await (_service as IBillReceiveService).RemoveBillReceivesByCode(Code);
      return Ok();
    }

  }

  
}