using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Abstractions;

namespace Systore.Data.Repositories
{
    public class SaleProductsRepository : BaseRepository<SaleProducts>, ISaleProductsRepository
    {
        public SaleProductsRepository(IDbContext context) : base(context)
        {

        }        
    }
}
