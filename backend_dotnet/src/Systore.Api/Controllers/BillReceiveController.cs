using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using System.Threading.Tasks;
using System;

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
  }
}