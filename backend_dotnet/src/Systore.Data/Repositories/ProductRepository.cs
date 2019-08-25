using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Abstractions;
using Systore.Infra.Context;
using System.Threading.Tasks;
using System.Collections.Generic;
using Systore.Domain.Dtos;
using Systore.Domain.Enums;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Systore.Data.Repositories
{
    public class ProductRepository : BaseRepository<Product>, IProductRepository
    {
        public ProductRepository(ISystoreContext context, IHeaderAuditRepository headerAuditRepository) : base(context, headerAuditRepository)
        {
        
        }

        public override Task<string> AddAsync(Product entity)
        {
            entity.ExportToBalance = true;
            return base.AddAsync(entity);
        }

        public override Task<string> UpdateAsync(Product entity)
        {
            entity.ExportToBalance = true;
            return base.UpdateAsync(entity);
        }

        public async Task<List<Product>> GetProductsForExportToBalance(FilterProductsToBalance filterProductsToBalance)
        {
            var query = _entities.Select(x => x);

            if (filterProductsToBalance.TypeOfSearchProductsToBalance == TypeOfSearchProductsToBalance.OnlyModified)
                query = query.Where(c => c.ExportToBalance == true);

            return await query.ToListAsync();
        }


    }
}
