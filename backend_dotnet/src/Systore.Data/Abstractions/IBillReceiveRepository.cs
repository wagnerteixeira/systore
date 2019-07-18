using Systore.Domain.Entities;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Systore.Data.Abstractions
{
  public interface IBillReceiveRepository : IBaseRepository<BillReceive>
  {
    Task<List<BillReceive>> GetBillReceivesByClient(int ClientId);
    Task<List<BillReceive>> GetPaidBillReceivesByClient(int ClientId);
    Task<List<BillReceive>> GetNoPaidBillReceivesByClient(int ClientId);
    Task<int> CountBillReceivesByClient(int clientId);
    Task<int> NextCode();
  }
}
