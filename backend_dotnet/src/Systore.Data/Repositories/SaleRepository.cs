using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Abstractions;
using Systore.Infra.Context;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Systore.Data.Repositories
{
    public class SaleRepository : BaseRepository<Sale>, ISaleRepository
    {        
        public SaleRepository(ISystoreContext context, IHeaderAuditRepository headerAuditRepository) : base(context, headerAuditRepository)
        {
        }        

        public async Task<Sale> GetSaleFullByIdAsync(int id)
        {
            return await _entities.Where(c => c.Id == id)
               .Include(c => c.SaleProducts).FirstOrDefaultAsync();
            
        }
    }
}
