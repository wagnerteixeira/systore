using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Abstractions;

namespace Systore.Data.Repositories
{
    public class ClientRepository : BaseRepository<Client>, IClientRepository
    {   
        public ClientRepository(IDbContext context) : base(context) {

        }        
    }
}
