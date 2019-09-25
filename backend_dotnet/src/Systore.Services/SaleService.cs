using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using System.Threading.Tasks;
using Systore.Domain.Dtos;

namespace Systore.Services
{
    public class SaleService : BaseService<Sale>, ISaleService
    {        
        public SaleService(ISaleRepository repository) : base(repository)
        {

        }

        public Task<Sale> GetSaleFullById(int id) => (_repository as ISaleRepository).GetSaleFullByIdAsync(id);

        public async Task<string> UpdateAsync(SaleDto entity)
        {
            string retorno = "";

            Sale sale = new Sale()
            {
                Client = entity.Client,
                ClientId = entity.ClientId,
                FinalValue = entity.FinalValue,
                Id = entity.Id,
                SaleDate = entity.SaleDate,
                Vendor = entity.Vendor
            };

            //sale.ItemSale = entity.ItemSale.Select(c => new ItemSale()
            //{
            //    Id = c.Id,
            //    Price = c.Price,
            //    ProductId = c.ProductId,
            //    Quantity = c.Quantity,
            //    SaleId = c.SaleId,
            //    TotalPrice = c.TotalPrice
            //}).ToList();

            retorno = await _repository.UpdateAsync(sale);

            return retorno;
        }
    }
}
