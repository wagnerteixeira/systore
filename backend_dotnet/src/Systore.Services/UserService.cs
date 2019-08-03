using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;

namespace Systore.Services
{
    public class UserService : BaseService<User>, IUserService
    {        
        public UserService(IUserRepository repository) : base(repository)
        {

        }        
    }
}
