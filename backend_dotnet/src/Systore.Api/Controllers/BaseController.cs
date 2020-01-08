using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Systore.Domain.Abstractions;
using Systore.Domain.Dtos;

namespace Systore.Api.Controllers
{
    [Route("api/[controller]")]
    public abstract class BaseController<TEntity> : ControllerBase, IDisposable where TEntity : class
    {
        protected readonly IBaseService<TEntity> _service = null;
        protected readonly ILogger<BaseController<TEntity>> _logger;

        public BaseController(IBaseService<TEntity> Service, ILogger<BaseController<TEntity>> logger)
        {
            _service = Service;
            _logger = logger;
        }

        protected virtual object GetEntityId(TEntity entity)
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

        [Authorize]
        [HttpGet("")]        
        // GET: api/Entity
        public virtual async Task<IActionResult> GetAllAsync()
        {
            try
            {
                return Ok(await _service.GetAllAsync());
            }
            catch (Exception e)
            {
                return SendBadRequest(e);
            }
        }

        [Authorize]
        [HttpGet("{id:int}")]
        // GET: api/Entity/5
        public virtual async Task<IActionResult> Get(int id)
        {
            try
            {
                return Ok(await _service.GetAsync(id));
            }
            catch (Exception e)
            {
                return SendBadRequest(e);
            }
        }

        [Authorize]
        [HttpPost("")]        
        // POST: api/Entity
        public virtual async Task<IActionResult> Post([FromBody]TEntity entity)
        {
            try
            {
                string ret = await _service.AddAsync(entity);
                var objectId = new { id = GetEntityId(entity) };
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
        [HttpPut("")]        
        // PUT: api/Entity
        public async virtual Task<IActionResult> Put([FromBody]TEntity entity)
        {
            try
            {
                string ret = await _service.UpdateAsync(entity);
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

        [Authorize]
        [HttpDelete("{id:int}")]        
        // DELETE: api/Entity
        public async virtual Task<IActionResult> Delete([FromRoute]int id)
        {
            try
            {
                string ret = await _service.RemoveAsync(id);
                if (string.IsNullOrWhiteSpace(ret))
                    return Ok("");
                else
                    return SendBadRequest(ret.Split('|', StringSplitOptions.RemoveEmptyEntries));
            }
            catch (Exception e)
            {
                return SendBadRequest(e);
            }
        }

        [Authorize]
        [HttpPost("count")]
        public async virtual Task<IActionResult> Count([FromBody]IEnumerable<FilterDto> filterDto)
        {
            try
            {
                var count = await _service.CountWhereAsync(filterDto);

                return Ok(count);

            }
            catch (Exception e)
            {
                return SendBadRequest(e);
            }
        }

        [Authorize]
        [HttpPost("getpaginate")]
        public async virtual Task<IActionResult> GetPaginate([FromBody]FilterPaginateDto filterPaginateDto)
        {
            try
            {
                var count = await _service.GetWhereAsync(filterPaginateDto);

                return Ok(count);

            }
            catch (Exception e)
            {
                return SendBadRequest(e);
            }
        }


        protected IActionResult SendStatusCode(int statusCode, string[] errors)
        {
            return StatusCode(statusCode, new { errors = errors.ToArray() });
        }

        protected IActionResult SendStatusCode(int statusCode, string error)
        {

            return StatusCode(statusCode, new { errors = new string[] { error } });
        }

        protected IActionResult SendStatusCode(int statusCode, Exception e)
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



        protected IActionResult SendBadRequest(string[] errors)
        {

            _logger.LogError(string.Join(Environment.NewLine, errors));
            return BadRequest(new { errors = errors.ToArray() });
        }

        protected IActionResult SendBadRequest(string error)
        {
            _logger.LogError(error);
            return BadRequest(new { errors = new string[] { error } });
        }

        protected IActionResult SendBadRequest(Exception e)
        {
            _logger.LogError(e, "Exception error: ");
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