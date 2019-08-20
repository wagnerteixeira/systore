using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Abstractions;

namespace Systore.Data.Repositories
{
    public class SaleRepository : BaseRepository<Sale>, ISaleRepository
    {
        public SaleRepository(IDbContext context, IHeaderAuditRepository headerAuditRepository) : base(context, headerAuditRepository)
        {

        }        
    }
}
