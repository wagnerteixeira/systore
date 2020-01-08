using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Systore.Data.Abstractions;
using Systore.Domain.Abstractions;
using Systore.Domain.Dtos;
using System.Linq;

namespace Systore.Services
{
    public class AuditService : IAuditService
    {
        private readonly IHeaderAuditRepository _headerAuditRepository;

        public AuditService(IHeaderAuditRepository headerAuditRepository)
        {
            _headerAuditRepository = headerAuditRepository;
        }


        public Task<List<AuditDto>> GetAuditsByDateAsync(DateTime initialDate, DateTime finalDate) => _headerAuditRepository.GetAuditsByDateAsync(initialDate, finalDate);
    }
}
