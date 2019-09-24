using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Context;

namespace Systore.Data.Repositories
{
    public class ItemSaleRepository : BaseRepository<ItemSale>, IItemSaleRepository
    {
        public ItemSaleRepository(ISystoreContext context, IHeaderAuditRepository headerAuditRepository) : base(context, headerAuditRepository)
        {

        }                
    }
}
