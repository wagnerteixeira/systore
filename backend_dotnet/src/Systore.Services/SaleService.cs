using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;

namespace Systore.Services
{
    public class SaleService : BaseService<Sale>, ISaleService
    {
        public SaleService(ISaleRepository repository) : base(repository)
        {

        }
    }
}
