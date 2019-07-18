using Systore.Domain.Entities;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Systore.Domain.Abstractions
{
  public interface IBillReceiveService : IBaseService<BillReceive>
  {
    Task<List<BillReceive>> GetBillReceivesByClient(int ClientId);
    Task<List<BillReceive>> GetPaidBillReceivesByClient(int ClientId);
    Task<List<BillReceive>> GetNoPaidBillReceivesByClient(int ClientId);
    Task<int> NextCode();
  }


}
