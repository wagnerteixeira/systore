using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using System.Threading.Tasks;
using System.Collections.Generic;
using Systore.Domain.Enums;

namespace Systore.Services
{
  public class BillReceiveService : BaseService<BillReceive>, IBillReceiveService
  {
    public BillReceiveService(IBillReceiveRepository repository) : base(repository)
    {

    }

    public Task<List<BillReceive>> GetBillReceivesByClient(int ClientId) =>
      (_repository as IBillReceiveRepository)
        .GetBillReceivesByClient(ClientId);
    public Task<List<BillReceive>> GetPaidBillReceivesByClient(int ClientId) =>
      (_repository as IBillReceiveRepository)
        .GetPaidBillReceivesByClient(ClientId);
    public Task<List<BillReceive>> GetNoPaidBillReceivesByClient(int ClientId) =>
      (_repository as IBillReceiveRepository)
        .GetNoPaidBillReceivesByClient(ClientId);
    public Task<int> NextCode() =>
      (_repository as IBillReceiveRepository)
      .NextCode();

  }
}
