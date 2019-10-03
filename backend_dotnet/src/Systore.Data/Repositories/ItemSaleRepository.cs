using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Context;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Systore.Data.Repositories
{
    public class ItemSaleRepository : BaseRepository<ItemSale>, IItemSaleRepository
    {
        public ItemSaleRepository(ISystoreContext context, IHeaderAuditRepository headerAuditRepository) : base(context, headerAuditRepository)
        {

        }

        public Task<bool> ExistsByProduct(int productId)
        {
            return GetAll().Where(c => c.ProductId == productId).AnyAsync();
        }
    }
}
