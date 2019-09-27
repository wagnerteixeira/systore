using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Systore.Domain.Dtos;

namespace Systore.Domain.Abstractions
{
    public interface IAuditService
    {
        Task<List<AuditDto>> GetAuditsByDateAsync(DateTime initialDate, DateTime finalDate);
    }
}
