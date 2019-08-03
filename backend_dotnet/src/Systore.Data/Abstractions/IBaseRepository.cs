using System.Collections.Generic;
using System.Threading.Tasks;

namespace Systore.Data.Abstractions
{
    public interface IBaseRepository<TEntity>
    {
        string Add(TEntity entity);
        TEntity Get(int id);
        IEnumerable<TEntity> GetAll();
        Task<IEnumerable<TEntity>> GetAllAsync();
        string Update(TEntity entity);
        string Remove(int id);
        void Dispose();
    }
}
