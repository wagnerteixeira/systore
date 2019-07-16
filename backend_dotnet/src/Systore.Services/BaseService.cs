using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using System.Linq.Expressions;


namespace Systore.Services
{
  public abstract class BaseService<TEntity> : IBaseService<TEntity> where TEntity : class
  {
    private readonly IBaseRepository<TEntity> _repository;
    public BaseService(IBaseRepository<TEntity> repository)
    {
      this._repository = repository;
    }

    public Task<string> Add(TEntity entity) => _repository.Add(entity);

    public Task<TEntity> Get(int id) => _repository.Get(id);

    public Task<IEnumerable<TEntity>> GetAllAsync() => _repository.GetAllAsync();


    public IEnumerable<TEntity> GetAll() => _repository.GetAll();

    public Task<List<TEntity>> GetWhere(Expression<Func<TEntity, bool>> predicate) => _repository.GetWhere(predicate);

    public Task<TEntity> FirstOrDefault(Expression<Func<TEntity, bool>> predicate) => _repository.FirstOrDefault(predicate);

    public Task<int> CountAll() => _repository.CountAll();
    public Task<int> CountWhere(Expression<Func<TEntity, bool>> predicate) => _repository.CountWhere(predicate);

    public Task<string> Update(TEntity entity) => _repository.Update(entity);

    public Task<string> Remove(TEntity entity) => _repository.Remove(entity);

  }
}
