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
    public virtual async Task<IActionResult> GetAllAsync()
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
    public virtual async Task<IActionResult> Get(int id)
    {
      try
      {
        return Ok(await _service.Get(id));
      }
      catch (Exception e)
      {
        return BadRequest(e);
      }
    }

    [HttpPost]
    [Route("")]
    // POST: api/Entity
    public virtual async Task<IActionResult> Post([FromBody]TEntity entity)
    {
      try
      {
        string ret = await _service.Add(entity);
        if (string.IsNullOrWhiteSpace(ret))
          return CreatedAtAction(nameof(Get), new { id = GetEntityId(entity) }, entity);
        else
          return SendBadRequest(ret);
      }
      catch (Exception e)
      {
        return SendBadRequest(e);
      }
    }
    [HttpPut]
    [Route("")]
    // PUT: api/Entity
    public async virtual Task<IActionResult> Put([FromBody]TEntity entity)
    {
      try
      {
        string ret = await _service.Update(entity);
        if (string.IsNullOrWhiteSpace(ret))
          return Ok(entity);
        else
          return SendBadRequest(ret);
      }
      catch (Exception e)
      {
        return SendBadRequest(e);
      }
    }

    [HttpDelete]
    [Route("")]
    // DELETE: api/Entity
    public async virtual Task<IActionResult> Delete([FromBody]TEntity entity)
    {
      try
      {
        string ret = await _service.Remove(entity);
        if (string.IsNullOrWhiteSpace(ret))
          return Ok("");
        else
          return SendBadRequest(ret);
      }
      catch (Exception e)
      {
        return SendBadRequest(e);
      }
    }


    public IActionResult SendStatusCode(int statusCode, string[] errors)
    {
      return StatusCode(statusCode, new { errors = errors.ToArray() });
    }

    public IActionResult SendStatusCode(int statusCode, string error)
    {

      return StatusCode(statusCode, new { errors = new string[] { error } });
    }

    public IActionResult SendStatusCode(int statusCode, Exception e)
    {
      string error = e.Message;
      if (e.InnerException != null)
      {
        error += '|' + e.InnerException.Message;
        if (e.InnerException.InnerException != null)
          error += '|' + e.InnerException.InnerException.Message;

      }

      return StatusCode(statusCode, new { errors = error.Split('|') });
    }



    public IActionResult SendBadRequest(string[] errors)
    {
      return BadRequest(new { errors = errors.ToArray() });
    }

    public IActionResult SendBadRequest(string error)
    {

      return BadRequest(new { errors = new string[] { error } });
    }

    public IActionResult SendBadRequest(Exception e)
    {
      string error = e.Message;
      if (e.InnerException != null)
      {
        error += '|' + e.InnerException.Message;
        if (e.InnerException.InnerException != null)
          error += '|' + e.InnerException.InnerException.Message;

      }

      return BadRequest(new { errors = error.Split('|') });
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