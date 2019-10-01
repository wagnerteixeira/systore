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

        private string Validate(Product entity, bool edit)
        {
            if (IsConversion)
                return "";
            string validations = "";
            if (string.IsNullOrWhiteSpace(entity.Description))
                validations += $"Informe a descrição do produto|";
            if (entity.Price == 0.0M)
                validations += $"Informe o Preço do produto|";
            return validations;

        }

        public override Task<string> AddAsync(Product entity)
        {
            string ret = Validate(entity, false);
            if (!string.IsNullOrWhiteSpace(ret))
                return Task.FromResult(ret); ;
            entity.ExportToBalance = true;
            return base.AddAsync(entity);
        }

        public override Task<string> UpdateAsync(Product entity)
        {
            string ret = Validate(entity, true);
            if (!string.IsNullOrWhiteSpace(ret))
                return Task.FromResult(ret);
            entity.ExportToBalance = true;
            return base.UpdateAsync(entity);
        }

        public Task<string> UpdateAsyncWithOutExportToBalance(Product entity)
        {
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
