using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Abstractions;
using Systore.Infra.Context;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Systore.Domain.Dtos;

namespace Systore.Data.Repositories
{
    public class SaleRepository : BaseRepository<Sale>, ISaleRepository
    {
        public SaleRepository(ISystoreContext context, IHeaderAuditRepository headerAuditRepository) : base(context, headerAuditRepository)
        {
        }

        public async Task<SaleDto> GetSaleFullByIdAsync(int id) =>
             new SaleDto();// _entities.Where(c => c.Id == id).FirstOrDefaultAsync();
        /*_entities
               .Where(c => c.Id == id)
               .Include(c => c.ItemSale)
               .FirstOrDefaultAsync();        */

    }
}
