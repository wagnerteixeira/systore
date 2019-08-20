using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using System.Threading.Tasks;
using System.Collections.Generic;
using Systore.Domain.Dtos;

namespace Systore.Services
{
    public class ProductService : BaseService<Product>, IProductService
    {

        public ProductService(IProductRepository repository) : base(repository)
        {

        }

        public Task<List<Product>> GetProductsForExportToBalance(FilterProductsToBalance filterProductsToBalance)
        {
            return (_repository as IProductRepository).GetProductsForExportToBalance(filterProductsToBalance);
        }
    }
}
