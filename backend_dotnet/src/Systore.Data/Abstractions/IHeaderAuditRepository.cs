using System.Threading.Tasks;
using Systore.Domain.Entities;

namespace Systore.Data.Abstractions
{
    public interface IHeaderAuditRepository 
    {
        Task<string> AddAsync(HeaderAudit entity);
    }
}
