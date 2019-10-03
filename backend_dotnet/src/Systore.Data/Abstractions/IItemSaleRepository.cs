using System.Collections.Generic;
using System.Threading.Tasks;
using Systore.Domain.Entities;

namespace Systore.Data.Abstractions
{
    public interface IItemSaleRepository : IBaseRepository<ItemSale>
    {
        Task<bool> ExistsByProduct(int productId);


    }
}
