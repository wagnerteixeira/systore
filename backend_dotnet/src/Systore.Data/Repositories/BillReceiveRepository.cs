using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Abstractions;
using System.Threading.Tasks;
using System.Linq.Expressions;

namespace Systore.Data.Repositories
{
  public class BillReceiveRepository : BaseRepository<BillReceive>, IBillReceiveRepository
  {
    public BillReceiveRepository(IDbContext context) : base(context)
    {

    }

    public Task<int> CountBillReceivesByClient(int clientId) {
       return CountWhere(c => c.ClientId == clientId);
    }
  }
}
