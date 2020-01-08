using Systore.Domain.Entities;
using System.Threading.Tasks;

namespace Systore.Domain.Abstractions
{
  public interface IClientService : IBaseService<Client>
  {
    Task<bool> ExistBillReceiveForClient(int ClientId);
  }
}
