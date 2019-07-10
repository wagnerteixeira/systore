using Application.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Services.Interfaces
{
    public interface IServiceBase<TEntity>
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
