using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Systore.Infra.Abstractions;
using System.Linq.Expressions;
using Systore.Data.Abstractions;
using Systore.Domain.Entities;
using Systore.Domain.Enums;

namespace Systore.Data.Repositories
{
    public abstract class BaseRepository<TEntity> : IDisposable, IBaseRepository<TEntity> where TEntity : class
    {
        protected readonly IDbContext _context;
        protected readonly DbSet<TEntity> _entities;

        public BaseRepository(IDbContext context)
        {
            this._context = context;
            this._entities = _context.Instance.Set<TEntity>();
        }

        public async virtual Task<string> Add(TEntity entity)
        {
            await this._entities.AddAsync(entity);
            return await this.SaveChangesAsync();
        }
        public virtual Task<TEntity> Get(int id) => this._entities.FindAsync(id);

        public virtual async Task<IEnumerable<TEntity>> GetAllAsync() => await this._entities.ToListAsync();

        public virtual IEnumerable<TEntity> GetAll() => _context.Instance.Set<TEntity>();

        public Task<List<TEntity>> GetWhere(Expression<Func<TEntity, bool>> predicate) => this._entities.Where(predicate).ToListAsync();
        public Task<List<TEntity>> GetWhere(FilterPaginateDto filterPaginateDto) {
            var query = this._entities
                .Where(QueryExpressionBuilder.GetExpression<TEntity>(filterPaginateDto.filters))
                .Skip(filterPaginateDto.Skip)
                .Take(filterPaginateDto.Limit);
            var param = Expression.Parameter(typeof(TEntity), "t");
            MemberExpression member = Expression.Property(param, filterPaginateDto.SortPropertyName);
            var orderBy = Expression.Lambda<Func<TEntity, object>>(member, param);
            if (filterPaginateDto.Order == Order.Asc)
                return query.OrderBy(orderBy).ToListAsync();
            else
                return query.OrderByDescending(orderBy).ToListAsync();

        }

        public Task<TEntity> FirstOrDefault(Expression<Func<TEntity, bool>> predicate) => this._entities.FirstOrDefaultAsync(predicate);

        public Task<int> CountAll() => this._entities.CountAsync();
        public Task<int> CountWhere(Expression<Func<TEntity, bool>> predicate) => this._entities.CountAsync(predicate);
        public Task<int> CountWhere(IEnumerable<FilterDto> filters) => this._entities.CountAsync(QueryExpressionBuilder.GetExpression<TEntity>(filters));


        public virtual Task<string> Update(TEntity entity)
        {
            // In case AsNoTracking is used
            _context.Instance.Entry(entity).State = EntityState.Modified;
            return this.SaveChangesAsync();
        }

        public virtual Task<string> Remove(TEntity entity)
        {
            _context.Instance.Remove(entity);
            return this.SaveChangesAsync();
        }

        public Task<int> ExecuteCommandAsync(string command, params object[] parameters)
        {
            return _context.Instance.Database.ExecuteSqlCommandAsync(command, parameters);
        }

        public int ExecuteCommand(string command, params object[] parameters)
        {
            return _context.Instance.Database.ExecuteSqlCommand(command, parameters);
        }


        protected async virtual Task<string> SaveChangesAsync()
        {
            try
            {
                await this._context.Instance.SaveChangesAsync();
                return "";
            }
            /*
            catch (DbEntityValidationException erro)
            {
                string mensagem = "";
                foreach (DbEntityValidationResult entityvalidationErrors in erro.EntityValidationErrors)
                    foreach (DbValidationError validationError in entityvalidationErrors.ValidationErrors)
                        mensagem += string.Format("Entity: {0} \nProperty: {1} \nError: {2}\n\r", entityvalidationErrors.Entry, validationError.PropertyName, validationError.ErrorMessage);
                return mensagem;
            } */
            catch (Exception e)
            {
                if (e.InnerException != null)
                {
                    if (e.InnerException.InnerException != null)
                        return e.InnerException.InnerException.Message;
                    else
                        return e.InnerException.Message;
                }
                else
                    return e.Message;
            }
        }

        public void Dispose()
        {

        }
    }
}
