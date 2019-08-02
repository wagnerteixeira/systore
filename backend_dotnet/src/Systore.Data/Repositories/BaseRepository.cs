using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Systore.Infra.Abstractions;
using System.Linq.Expressions;
using Systore.Data.Abstractions;
using Systore.Domain.Enums;
using Systore.Domain.Dtos;

namespace Systore.Data.Repositories
{
    public abstract class BaseRepository<TEntity> : IDisposable, IBaseRepository<TEntity> where TEntity : class
    {
        protected readonly IDbContext _context;
        protected readonly DbSet<TEntity> _entities;

        public BaseRepository(IDbContext context)
        {
            _context = context;
            _entities = _context.Instance.Set<TEntity>();
        }

        public virtual async Task<string> AddAsync(TEntity entity)
        {
            await _entities.AddAsync(entity);
            return await SaveChangesAsync();
        }
        public virtual async Task<TEntity> GetAsync(int id) => await _entities.FindAsync(id);

        public virtual async Task<IEnumerable<TEntity>> GetAllAsync() => await _entities.ToListAsync();

        public virtual IQueryable<TEntity> GetAll() => _entities.Select(x => x);

        public virtual async Task<List<TEntity>> GetWhereAsync(Expression<Func<TEntity, bool>> predicate) => await _entities.Where(predicate).ToListAsync();
        public virtual async Task<List<TEntity>> GetWhereAsync(FilterPaginateDto filterPaginateDto) {
            var query = _entities.Select(x => x);
            if (filterPaginateDto.filters != null)
                query = query.Where(QueryExpressionBuilder.GetExpression<TEntity>(filterPaginateDto.filters));

            query = query
                .Skip(filterPaginateDto.Skip)
                .Take(filterPaginateDto.Limit);
           
            var param = Expression.Parameter(typeof(TEntity), "t");
            MemberExpression member = Expression.Property(param, filterPaginateDto.SortPropertyName);           
            
            switch (member.Type.Name)
            {
                case "Int32":
                    var int32Expression = Expression.Lambda<Func<TEntity, Int32>>(member, param);
                    if (filterPaginateDto.Order == Order.Asc)
                        return await query.OrderBy(int32Expression).ToListAsync();
                    else
                        return await query.OrderByDescending(int32Expression).ToListAsync();
                    
                case "String":
                    var stringExpression = Expression.Lambda<Func<TEntity, string>>(member, param);
                    if (filterPaginateDto.Order == Order.Asc)
                        return await query.OrderBy(stringExpression).ToListAsync();
                    else
                        return await query.OrderByDescending(stringExpression).ToListAsync();                    
                case "DateTime":
                    var dateTimeExpression = Expression.Lambda<Func<TEntity, string>>(member, param);
                    if (filterPaginateDto.Order == Order.Asc)
                        return await query.OrderBy(dateTimeExpression).ToListAsync();
                    else
                        return await query.OrderByDescending(dateTimeExpression).ToListAsync();                    
                case "Nullable`1":
                    var nullableType = Nullable.GetUnderlyingType(member.Type);
                    switch (nullableType.Name)
                    {
                        case "DateTime":
                            var nullDateTimeExpression = Expression.Lambda<Func<TEntity, DateTime?>>(member, param);
                            if (filterPaginateDto.Order == Order.Asc)
                                return await query.OrderBy(nullDateTimeExpression).ToListAsync();
                            else
                                return await query.OrderByDescending(nullDateTimeExpression).ToListAsync();
                        case "Int32":
                            var nullInt32Expression = Expression.Lambda<Func<TEntity, Int32?>>(member, param);
                            if (filterPaginateDto.Order == Order.Asc)
                                return await query.OrderBy(nullInt32Expression).ToListAsync();
                            else
                                return await query.OrderByDescending(nullInt32Expression).ToListAsync();
                        default:
                            var nullObjExpression = Expression.Lambda<Func<TEntity, object>>(member, param);
                            if (filterPaginateDto.Order == Order.Asc)
                                return await query.OrderBy(nullObjExpression).ToListAsync();
                            else
                                return await query.OrderByDescending(nullObjExpression).ToListAsync();                            
                    }
                default:
                    var objExpression = Expression.Lambda<Func<TEntity, object>>(member, param);
                    if (filterPaginateDto.Order == Order.Asc)
                        return await query.OrderBy(objExpression).ToListAsync();
                    else
                        return await query.OrderByDescending(objExpression).ToListAsync();                    
            }
        }

        public virtual async Task<TEntity> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate) => await _entities.FirstOrDefaultAsync(predicate);

        public virtual async Task<int> CountAllAsync() => await _entities.CountAsync();
        public virtual async Task<int> CountWhereAsync(Expression<Func<TEntity, bool>> predicate) => await _entities.CountAsync(predicate);
        public virtual async Task<int> CountWhereAsync(IEnumerable<FilterDto> filters) => await _entities.CountAsync(QueryExpressionBuilder.GetExpression<TEntity>(filters));


        public virtual async Task<string> UpdateAsync(TEntity entity)
        {
            // In case AsNoTracking is used
            _context.Instance.Entry(entity).State = EntityState.Modified;
            return await SaveChangesAsync();
        }

        public virtual async Task<string> RemoveAsync(int id)
        {
            var entity = await _entities.FindAsync(id);
            _context.Instance.Remove(entity);
            return await SaveChangesAsync();
        }

        public virtual async Task<int> ExecuteCommandAsync(string command, params object[] parameters)
        {
            return await _context.Instance.Database.ExecuteSqlCommandAsync(command, parameters);
        }
        
        protected virtual async Task<string> SaveChangesAsync()
        {
            try
            {
                await _context.Instance.SaveChangesAsync();
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
