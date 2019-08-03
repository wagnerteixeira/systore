using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Abstractions;
using Systore.Dtos;

namespace Systore.Api.Controllers
{
  public abstract class BaseController<TEntity> : ControllerBase, IDisposable where TEntity : class
  {
    public readonly IBaseService<TEntity> _service = null;
    public BaseController(IBaseService<TEntity> Service)
    {
      _service = Service;
    }

    public virtual object GetEntityId(TEntity entity)
    {
      try
      {
        return entity.GetType().GetProperty("Id").GetValue(entity, null);
      }
      catch
      {
        return 0;
      }
    }

    [HttpGet]
    [Route("")]
    // GET: api/Entity
    public async Task<IActionResult> GetAllAsync()
    {
      try
      {
        return Ok(await _service.GetAllAsync());
      }
      catch (Exception e)
      {
        return BadRequest(e);
      }
    }

    [HttpGet]
    [Route("{id}")]
    // GET: api/Entity/5
    public IActionResult Get(int id)
    {
      try
      {
        return Ok(_service.Get(id));
      }
      catch (Exception e)
      {
        return BadRequest(e);
      }
    }

    [HttpPost]
    [Route("")]
    // POST: api/Entity
    public IActionResult Post([FromBody]TEntity value)
    {
      try
      {
        string ret = _service.Add(value);
        if (string.IsNullOrWhiteSpace(ret))
          return Ok(new ResultDTO() { Success = true, Message = "", Key = GetEntityId(value) });
        else
          return Ok(new ResultDTO() { Success = false, Message = ret });
      }
      catch (Exception e)
      {
        return BadRequest(e);
      }
    }
    [HttpPut]
    [Route("{id}")]
    // PUT: api/Entity/5
    public IActionResult Put(int id, [FromBody]TEntity value)
    {
      try
      {
        string ret = _service.Update(value);
        if (string.IsNullOrWhiteSpace(ret))
          return Ok(new ResultDTO() { Success = true, Message = "" });
        else
          return Ok(new ResultDTO() { Success = false, Message = ret });
      }
      catch (Exception e)
      {
        return BadRequest(e);
      }
    }

    [HttpDelete]
    [Route("{id}")]
    // DELETE: api/Entity/5
    public IActionResult Delete(int Id)
    {
      try
      {
        string ret = _service.Remove(Id);
        if (string.IsNullOrWhiteSpace(ret))
          return Ok(new ResultDTO() { Success = true, Message = "" });
        else
          return Ok(new ResultDTO() { Success = false, Message = ret });
      }
      catch (Exception e)
      {
        return BadRequest(e);
      }
    }


    private bool _disposed = false;
    protected virtual void Dispose(bool disposing)
    {
      if (_disposed)
        return;

      if (disposing)
      {
        Dispose(false);
      }
      _disposed = true;
    }

    public void Dispose()
    {
      Dispose(true);
      GC.SuppressFinalize(this);
    }

  }
}