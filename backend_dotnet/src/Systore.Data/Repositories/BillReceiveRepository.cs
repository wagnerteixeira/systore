using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Abstractions;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;
using Systore.Domain.Enums;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;

namespace Systore.Data.Repositories
{
    public class BillReceiveRepository : BaseRepository<BillReceive>, IBillReceiveRepository
    {
        public BillReceiveRepository(IDbContext context) : base(context)
        {

        }

        public Task<int> CountBillReceivesByClient(int clientId) =>
          CountWhereAsync(c => c.ClientId == clientId);

        public Task<List<BillReceive>> GetBillReceivesByClient(int ClientId)
        {
            var queryOpen = this._entities
              .Where(c => c.ClientId == ClientId && c.Situation == BillReceiveSituation.Open)
              .OrderBy(c => c.PurchaseDate)
              .ThenBy(c => c.Quota);

            var queryClose = this._entities
              .Where(c => c.ClientId == ClientId && c.Situation == BillReceiveSituation.Closed)
              .OrderByDescending(c => c.PurchaseDate)
              .ThenBy(c => c.Quota);

            return queryOpen
              .Union(queryClose)
              .ToListAsync();
        }

        public Task<List<BillReceive>> GetPaidBillReceivesByClient(int ClientId) =>
            this._entities
              .Where(c => c.ClientId == ClientId && c.Situation == BillReceiveSituation.Closed)
              .OrderBy(c => c.Code)
              .ThenBy(c => c.Quota)
              .ToListAsync();

        public Task<List<BillReceive>> GetNoPaidBillReceivesByClient(int ClientId) =>
            this._entities
              .Where(c => c.ClientId == ClientId && c.Situation == BillReceiveSituation.Open)
              .OrderBy(c => c.Code)
              .ThenBy(c => c.Quota)
              .ToListAsync();

        public async Task<int> NextCode()
        {
            return (await this._entities.MaxAsync(c => (int?)c.Code) ?? 0) + 1;
        }

        public async Task RemoveBillReceivesByCode(int Code)
        {
            this._entities.RemoveRange(this._entities.Where(c => c.Code == Code));
            await this.SaveChangesAsync();
        }

    }
}
