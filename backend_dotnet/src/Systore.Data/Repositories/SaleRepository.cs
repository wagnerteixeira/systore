using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Abstractions;
using Systore.Infra.Context;

namespace Systore.Data.Repositories
{
    public class SaleRepository : BaseRepository<Sale>, ISaleRepository
    {
        private ISystoreContext _context;
        private IHeaderAuditRepository _headerAuditRepository;

        public SaleRepository(ISystoreContext context, IHeaderAuditRepository headerAuditRepository) : base(context, headerAuditRepository)
        {
            _context = context;
            _headerAuditRepository = headerAuditRepository;
        }        

        public Sale GetSaleFullById(int id)
        {
            Sale sale = GetAsync(id).Result;

            sale.SaleProducts = new SaleProductsRepository(_context, _headerAuditRepository).GetWhereAsync(item => item.SaleId == id).Result;

            return sale;
        }
    }
}
