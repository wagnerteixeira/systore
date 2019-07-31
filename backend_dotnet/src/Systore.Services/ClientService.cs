using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using System.Threading.Tasks;

namespace Systore.Services
{
    public class ClientService : BaseService<Client>, IClientService
    {        

        private readonly IBillReceiveRepository _billReceiveRepository;
        public ClientService(IClientRepository repository, IBillReceiveRepository billReceiveRepository) : base(repository)
        {
          _billReceiveRepository = billReceiveRepository;
        }

        public async Task<bool> ExistBillReceiveForClient(int ClientId){
          return await _billReceiveRepository.CountWhereAsync(c => c.ClientId == ClientId) > 0;
        }
    }
}
