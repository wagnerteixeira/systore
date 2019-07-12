using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;

namespace Systore.Services
{
    public class ClientService : BaseService<Client>, IClientService
    {        
        public ClientService(IClientRepository repository) : base(repository)
        {

        }
    }
}
