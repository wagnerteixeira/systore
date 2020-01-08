using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Systore.Domain.Abstractions;
using Systore.Domain.Dtos;
using Systore.Data.Abstractions;
using System.Linq.Expressions;


namespace Systore.Services
{
    public abstract class BaseService<TEntity> : IBaseService<TEntity> where TEntity : class
    {
        protected readonly IBaseRepository<TEntity> _repository;
        public BaseService(IBaseRepository<TEntity> repository)
        {
            this._repository = repository;
        }

        public virtual Task<string> AddAsync(TEntity entity) => _repository.AddAsync(entity);

        public virtual Task<TEntity> GetAsync(int id) => _repository.GetAsync(id);

        public virtual Task<IEnumerable<TEntity>> GetAllAsync() => _repository.GetAllAsync();


        public virtual IQueryable<TEntity> GetAll() => _repository.GetAll();

        public virtual Task<List<TEntity>> GetWhereAsync(Expression<Func<TEntity, bool>> predicate) => _repository.GetWhereAsync(predicate);
        public virtual Task<List<TEntity>> GetWhereAsync(FilterPaginateDto filterPaginateDto) => _repository.GetWhereAsync(filterPaginateDto);

        public virtual Task<TEntity> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate) => _repository.FirstOrDefaultAsync(predicate);

        public virtual Task<int> CountAllAsync() => _repository.CountAllAsync();

        public virtual Task<int> CountWhereAsync(Expression<Func<TEntity, bool>> predicate) => _repository.CountWhereAsync(predicate);

        public virtual Task<int> CountWhereAsync(IEnumerable<FilterDto> filters) => _repository.CountWhereAsync(filters);

        public virtual Task<string> UpdateAsync(TEntity entity) => _repository.UpdateAsync(entity);

        public virtual Task<string> RemoveAsync(int id) => _repository.RemoveAsync(id);


    }
}
