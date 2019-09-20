using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Context;

namespace Systore.Data.Repositories
{
    public class SaleProductsRepository : BaseRepository<SaleProducts>, ISaleProductsRepository
    {
        public SaleProductsRepository(ISystoreContext context, IHeaderAuditRepository headerAuditRepository) : base(context, headerAuditRepository)
        {

        }                
    }
}
