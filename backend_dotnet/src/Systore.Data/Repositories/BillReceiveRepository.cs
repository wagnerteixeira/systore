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
using Systore.Infra.Context;

namespace Systore.Data.Repositories
{
    public class BillReceiveRepository : BaseRepository<BillReceive>, IBillReceiveRepository
    {
        private decimal _interestTax = 0.0023333333333333333333333333M; //(0.07M / 30.0M)


        public BillReceiveRepository(ISystoreContext context, IHeaderAuditRepository headerAuditRepository) : base(context, headerAuditRepository)
        {

        }

        public Task<int> CountBillReceivesByClient(int clientId) =>
          CountWhereAsync(c => c.ClientId == clientId);

        public async Task<List<BillReceive>> GetBillReceivesByClient(int ClientId)
        {
            var queryOpen = this._entities
              .Where(c => c.ClientId == ClientId && c.Situation == BillReceiveSituation.Open)
              .OrderBy(c => c.PurchaseDate)
              .ThenBy(c => c.Quota);

            var queryClose = this._entities
              .Where(c => c.ClientId == ClientId && c.Situation == BillReceiveSituation.Closed)
              .OrderByDescending(c => c.PurchaseDate)
              .ThenBy(c => c.Quota);

            var _billReceives = await queryOpen
              .Union(queryClose)
              .ToListAsync();

            return _billReceives.Select(c =>
            {
                var days = DateTime.Today - c.DueDate;
                if ((c.Situation == BillReceiveSituation.Open) && (days.Days > 5))
                {
                    c.DaysDelay = days.Days;
                    var interestPerDay = _interestTax * c.DaysDelay;
                    c.Interest = Decimal.Round(c.OriginalValue * interestPerDay, 2);
                    c.FinalValue = c.OriginalValue + c.Interest;
                }
                else
                    c.FinalValue = c.OriginalValue;
                return c;
            }).ToList();
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
