using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;


namespace Systore.Services
{
  public abstract class BaseService<TEntity> : IBaseService<TEntity> where TEntity : class
  {
    private readonly IBaseRepository<TEntity> _repository;
    public BaseService(IBaseRepository<TEntity> repository)
    {
      this._repository = repository;
    }

    public string Add(TEntity entity)
    {
      return _repository.Add(entity);
    }

    public TEntity Get(int id)
    {
      return _repository.Get(id);
    }

    public async Task<IEnumerable<TEntity>> GetAllAsync()
    {
      return await _repository.GetAllAsync();
    }

    public IEnumerable<TEntity> GetAll()
    {
      return _repository.GetAll();
    }

    public string Update(TEntity entity)
    {
      return _repository.Update(entity);
    }

    public string Remove(int id)
    {
      return _repository.Remove(id);
    }
  }
}
