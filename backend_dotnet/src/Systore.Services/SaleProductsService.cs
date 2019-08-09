using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;

namespace Systore.Services
{
    public class SaleProductsService : BaseService<SaleProducts>, ISaleProductsService
    {
        public SaleProductsService(ISaleProductsRepository repository) : base(repository)
        {

        }
    }
}
