using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Dtos;

namespace Systore.Api.Controllers
{
    public abstract class BaseController<TEntity> : ControllerBase, IDisposable where TEntity : class
    {
        protected readonly IBaseService<TEntity> _service = null;        

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
                return BadRequest(e);
            }
        }

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
                string ret = await _service.AddAsync(entity);
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
                    return SendBadRequest(ret);
            }
            catch (Exception e)
            {
                return SendBadRequest(e);
            }
        }

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
                    return SendBadRequest(ret);
            }
            catch (Exception e)
            {
                return SendBadRequest(e);
            }
        }

       /* public Expression<Func<TEntity, bool>> GetExpression<TEntity>(IEnumerable<FilterDto> filters)
        {
            var param = Expression.Parameter(typeof(TEntity), "t");
            var body = filters
                .Select(filter => GetExpression(param, filter))
                .DefaultIfEmpty()
                .Aggregate(Expression.AndAlso);
            return body != null ? Expression.Lambda<Func<TEntity, bool>>(body, param) : null;
        }

        private static Expression GetExpression(ParameterExpression param, FilterDto filter)
        {
            MemberExpression member = Expression.Property(param, filter.Field);
            var type = member.Type;
            ConstantExpression constant;
            switch (type.Name)
            {
                case "Int32":
                    constant = Expression.Constant(Convert.ToInt32(filter.Filter));
                    break;
                case "String":
                default:
                    constant = Expression.Constant(filter.Filter);
                    break;
            }

            // ConstantExpression constant = Expression.Constant(filter.Value);

            switch (filter.TilterType)
            {
                case Domain.Enums.Operation.Eq:
                    return Expression.Equal(member, constant);

                case Domain.Enums.Operation.Gt:
                    return Expression.GreaterThan(member, constant);

                case Domain.Enums.Operation.Gte:
                    return Expression.GreaterThanOrEqual(member, constant);

                case Domain.Enums.Operation.Lt:
                    return Expression.LessThan(member, constant);

                case Domain.Enums.Operation.Lte:
                    return Expression.LessThanOrEqual(member, constant);

                /*case Op.Contains:
                    return Expression.Call(member, ContainsMethod, constant);

                case Op.StartsWith:
                    return Expression.Call(member, StartsWithMethod, constant);

                case Op.EndsWith:
                    return Expression.Call(member, EndsWithMethod, constant);
            }

            return null;
        }*/

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