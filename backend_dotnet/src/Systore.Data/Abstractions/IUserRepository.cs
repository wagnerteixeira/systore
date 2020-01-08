using System.Threading.Tasks;
using Systore.Domain.Entities;

namespace Systore.Data.Abstractions
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<User> GetUserByUsernameAndPassword(string userName, string password);
    }
}
