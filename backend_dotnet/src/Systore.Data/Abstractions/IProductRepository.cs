using System.Collections.Generic;
using System.Threading.Tasks;
using Systore.Domain.Dtos;
using Systore.Domain.Entities;

namespace Systore.Data.Abstractions
{
    public interface IProductRepository : IBaseRepository<Product>
    {
        Task<List<Product>> GetProductsForExportToBalance(FilterProductsToBalance filterProductsToBalance);
        Task<string> UpdateAsyncWithOutExportToBalance(Product entity);
    }
}
