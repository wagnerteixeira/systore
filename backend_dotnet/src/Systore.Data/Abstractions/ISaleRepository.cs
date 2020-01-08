using System.Threading.Tasks;
using Systore.Domain.Dtos;
using Systore.Domain.Entities;

namespace Systore.Data.Abstractions
{
    public interface ISaleRepository : IBaseRepository<Sale>
    {
        Task<SaleDto> GetSaleFullByIdAsync(int id);
    }
}
