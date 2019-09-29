using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using System.Threading.Tasks;
using Systore.Domain.Dtos;
using Systore.Domain.Enums;
using Systore.Data.Repositories;

namespace Systore.Services
{
    public class SaleService : BaseService<Sale>, ISaleService
    {
        private readonly IItemSaleRepository _itemSaleRepository;

        public SaleService(ISaleRepository repository, IItemSaleRepository itemSaleRepository) : base(repository)
        {
            _itemSaleRepository = itemSaleRepository;
        }

        public Task<SaleDto> GetSaleFullById(int id) => (_repository as ISaleRepository).GetSaleFullByIdAsync(id);

        public async Task<string> UpdateAsync(SaleDto entity)
        {
            string retorno = "";

            Sale sale = new Sale()
            {
                ClientId = entity.ClientId,
                FinalValue = entity.FinalValue,
                Id = entity.Id,
                SaleDate = entity.SaleDate,
                Vendor = entity.Vendor
            };

            retorno = await _repository.UpdateAsync(sale);
            
            if (retorno == "")
            {             
                foreach (ItemSaleDto item in entity.ItemSale)
                {
                    if (item.Action == ActionItem.Insert)
                    {

                        retorno = await _itemSaleRepository.AddAsync(new ItemSale()
                        {
                            Id = item.Id,
                            Price = item.Price,
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            SaleId = item.SaleId,
                            TotalPrice = item.TotalPrice
                        });
                    }
                    else if (item.Action == ActionItem.Alter)
                    {
                        retorno = await _itemSaleRepository.UpdateAsync(new ItemSale()
                        {
                            Id = item.Id,
                            Price = item.Price,
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            SaleId = item.SaleId,
                            TotalPrice = item.TotalPrice
                        });
                    }
                    else if (item.Action == ActionItem.Delete)
                    {
                        retorno = await _itemSaleRepository.RemoveAsync(item.Id);
                    }

                    if (retorno != "")
                        break;
                }
            }

            return retorno;
        }
    }
}
