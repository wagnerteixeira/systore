using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;

namespace Systore.Services
{
    public class BillReceiveService : BaseService<BillReceive>, IBillReceiveService
    {        
        public BillReceiveService(IBillReceiveRepository repository) : base(repository)
        {

        }        
    }
}
