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

        public Task<SaleDto> GetSaleFullByIdAsync(int id) =>
             _entities
               .Where(c => c.Id == id)
               .Include(c => c.ItemSale)
               .ThenInclude(iten => iten.Product)
               .Select(c => new SaleDto()
               {
                   ClientId = c.ClientId,
                   FinalValue = c.FinalValue,
                   Id = c.Id,
                   SaleDate = c.SaleDate,
                   Vendor = c.Vendor,
                   ItemSale = c.ItemSale.Select(i => new ItemSaleDto()
                   {
                       Action = Domain.Enums.ActionItem.NoChanges,
                       Id = i.Id,
                       Price = i.Price,
                       ProductDescription = i.Product.Description,
                       ProductId = i.ProductId,
                       Quantity = i.Quantity,
                       SaleId = i.SaleId,
                       TotalPrice = i.TotalPrice
                   }).ToList()
               })
                .AsNoTracking()
               .FirstOrDefaultAsync();

    }
}
