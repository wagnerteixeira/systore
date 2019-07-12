using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Abstractions;

namespace Systore.Data.Repositories
{
  public class UserRepository : BaseRepository<User>, IUserRepository
  {
    public UserRepository(IDbContext context) : base(context)
    {

    }
  }
}
