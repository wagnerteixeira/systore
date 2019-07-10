using Application.Domain.DataTransferObjects;
using Application.Domain.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Application.Domain.Entities;

namespace WebApi.Controllers
{
    public abstract class BaseController<TEntity> : ControllerBase, IDisposable where TEntity : class
    {
        public readonly IServiceBase<TEntity> _service = null;
        public BaseController(IServiceBase<TEntity> Service)
        {
            _service = Service;
            /*if (service == null)
            {
                service = (IBaseService<TEntity>)Services.Kernel.Get(typeof(IBaseService<TEntity>));
            }*/
        }
       
        public virtual int GetEntityId(TEntity entity)
        {
            return 0;
        }

        [HttpGet]
        [Route("")]
        // GET: api/Entity
        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _service.GetAllAsync();
        }

        [HttpGet]
        [Route("{id}")]
        // GET: api/Entity/5
        public TEntity Get(int id)
        {
            return _service.Get(id);
        }

        [HttpPost]
        [Route("")]
        // POST: api/Entity
        public ResultDTO Post([FromBody]TEntity value)
        {
            string ret = _service.Add(value);
            if (string.IsNullOrWhiteSpace(ret))
                return new ResultDTO() { Success = true, Message = "", Id = this.GetEntityId(value) };
            else
                return new ResultDTO() { Success = false, Message = ret };
        }
        [HttpPut]
        [Route("{id}")]
        // PUT: api/Entity/5
        public ResultDTO Put(int id, [FromBody]TEntity value)
        {
            string ret = _service.Update(value);
            if (string.IsNullOrWhiteSpace(ret))
                return new ResultDTO() { Success = true, Message = "" };
            else
                return new ResultDTO() { Success = false, Message = ret };
        }

        [HttpDelete]
        [Route("{id}")]
        // DELETE: api/Entity/5
        public ResultDTO Delete(int Id)
        {
            string ret = _service.Remove(Id);
            if (string.IsNullOrWhiteSpace(ret))
                return new ResultDTO() { Success = true, Message = "" };
            else
                return new ResultDTO() { Success = false, Message = ret };
        }


        private bool _disposed = false;        
        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
                return;

            if (disposing)
            {
                _service.Dispose();                
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