using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;

namespace Systore.Services
{
    public class SaleService : BaseService<Sale>, ISaleService
    {
        private ISaleRepository _repository;
        public SaleService(ISaleRepository repository) : base(repository)
        {
            _repository = repository;
        }

        public Sale GetSaleFullById(int id)
        {
            return _repository.GetSaleFullById(id);
        }
    }
}
