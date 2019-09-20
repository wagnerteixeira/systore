using System.Threading.Tasks;
using Systore.Domain.Entities;

namespace Systore.Data.Abstractions
{
    public interface ISaleRepository : IBaseRepository<Sale>
    {
        Task<Sale> GetSaleFullByIdAsync(int id);
    }
}
