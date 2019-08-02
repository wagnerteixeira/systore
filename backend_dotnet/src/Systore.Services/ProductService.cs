using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;

namespace Systore.Services
{
    public class ProductService : BaseService<Product>, IProductService
    {
        public ProductService(IProductRepository repository) : base(repository)
        {

        }
    }
}
