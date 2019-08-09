using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Abstractions;
using Systore.Infra.Context;

namespace Systore.Data.Repositories
{
    public class ClientRepository : BaseRepository<Client>, IClientRepository
    {   
        public ClientRepository(ISystoreContext context, IHeaderAuditRepository headerAuditRepository) : base(context, headerAuditRepository) {

        } 
    }
}
