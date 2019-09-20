using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using System.Threading.Tasks;

namespace Systore.Services
{
    public class SaleService : BaseService<Sale>, ISaleService
    {        
        public SaleService(ISaleRepository repository) : base(repository)
        {

        }

        public Task<Sale> GetSaleFullById(int id) => (_repository as ISaleRepository).GetSaleFullByIdAsync(id);        
    }
}
