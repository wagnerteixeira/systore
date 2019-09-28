using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Context;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Systore.Data.Repositories
{
    public class ClientRepository : BaseRepository<Client>, IClientRepository
    {
        
        public ClientRepository(ISystoreContext context, IHeaderAuditRepository headerAuditRepository) : base(context, headerAuditRepository)
        {
            
        }

        private async Task<string> Validate(Client entity, bool edit)
        {
            if (IsConversion)
                return "";
            string validations = "";
            var query = _entities.Where(c => c.Cpf == entity.Cpf);
            if (edit)
                query = query.Where(c => c.Id != entity.Id);
            var _client = await query.Select(c => new { c.Name, c.Cpf }).FirstOrDefaultAsync();
            if (_client != null)
                validations += $"Já existe um cliente com o CPF {_client.Cpf}, {_client.Name}|";
            if (entity.DateOfBirth > DateTime.Now)
                validations += $"Data de aniversário {(entity.DateOfBirth.HasValue ? entity.DateOfBirth?.ToString("dd/MM/yyyy") : "")} deve ser menor que a data atual{DateTime.Now.ToString("dd/MM/yyyy")}|";

            return validations;

        }

        public override async Task<string> AddAsync(Client entity)
        {
            string ret = await Validate(entity, false);
            if (!string.IsNullOrWhiteSpace(ret))
                return ret;
            return await base.AddAsync(entity);
        }

        public override async Task<string> UpdateAsync(Client entity)
        {
            string ret = await Validate(entity, true);
            if (!string.IsNullOrWhiteSpace(ret))
                return ret;
            return await base.UpdateAsync(entity);
        }
    }
}
