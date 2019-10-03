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
        private readonly IItemSaleRepository _itemSaleRepository;
        public ProductRepository(ISystoreContext context, IHeaderAuditRepository headerAuditRepository, IItemSaleRepository itemSaleRepository) : base(context, headerAuditRepository)
        {

            _itemSaleRepository = itemSaleRepository;
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

        private async Task<string> ValidateDelete(int id)
        {
            string validations = "";

            if (await _itemSaleRepository.ExistsByProduct(id))
                validations += "Não é possível excluir um produto que possua venda|"; 
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

        public override async Task<string> RemoveAsync(int id)
        {
            string ret = await ValidateDelete(id);
            if (!string.IsNullOrWhiteSpace(ret))
                return ret;
            return await base.RemoveAsync(id);
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
