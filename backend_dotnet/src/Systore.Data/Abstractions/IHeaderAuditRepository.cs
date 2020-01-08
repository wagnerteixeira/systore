using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Systore.Domain.Dtos;
using Systore.Domain.Entities;

namespace Systore.Data.Abstractions
{
    public interface IHeaderAuditRepository 
    {
        Task<string> AddAsync(HeaderAudit entity);
        Task<List<AuditDto>> GetAuditsByDateAsync(DateTime initialDate, DateTime finalDate);
    }
}
