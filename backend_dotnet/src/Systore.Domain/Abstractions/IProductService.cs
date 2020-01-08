using System.Collections.Generic;
using System.Threading.Tasks;
using Systore.Domain.Dtos;
using Systore.Domain.Entities;

namespace Systore.Domain.Abstractions
{
    public interface IProductService : IBaseService<Product>
    {
        Task<List<Product>> GetProductsForExportToBalance(FilterProductsToBalance filterProductsToBalance);
        Task<string> GenerateFileContentItensToBalance(int[] productsId);
        Task<string> GenerateFileContentInfoToBalance(int[] productsId);
        Task<string> UpdateProductsExportedToBalance(int[] productsId);
    }
}
