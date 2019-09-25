using Systore.Domain.Entities;
using System.Threading.Tasks;
using Systore.Domain.Dtos;

namespace Systore.Domain.Abstractions
{
  public interface ISaleService : IBaseService<Sale>
  {
        Task<Sale> GetSaleFullById(int id);
        Task<string> UpdateAsync(SaleDto entity);

  }
}
