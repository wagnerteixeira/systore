using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Abstractions;

namespace Systore.Data.Repositories
{
  public class BillReceiveRepository : BaseRepository<BillReceive>, IBillReceiveRepository
  {
    public BillReceiveRepository(IDbContext context) : base(context)
    {

    }
  }
}
