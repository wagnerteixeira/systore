using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq.Expressions;

namespace Systore.Domain.Abstractions
{
  public interface IBaseService<TEntity>
  {
    Task<string> Add(TEntity entity);
    Task<TEntity> Get(int id);
    IEnumerable<TEntity> GetAll();
    Task<IEnumerable<TEntity>> GetAllAsync();
    Task<List<TEntity>> GetWhere(Expression<Func<TEntity, bool>> predicate);
    Task<TEntity> FirstOrDefault(Expression<Func<TEntity, bool>> predicate);
    Task<int> CountAll();
    Task<int> CountWhere(Expression<Func<TEntity, bool>> predicate);
    Task<string> Update(TEntity entity);
    Task<string> Remove(TEntity entity);

  }
}
