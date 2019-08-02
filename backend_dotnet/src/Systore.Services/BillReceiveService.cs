using System;
using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using System.Threading.Tasks;
using System.Collections.Generic;
using Systore.Domain.Enums;
using Systore.Domain.Dtos;


namespace Systore.Services
{
    public class BillReceiveService : BaseService<BillReceive>, IBillReceiveService
    {
        public BillReceiveService(IBillReceiveRepository repository) : base(repository)
        {

        }

        public Task<List<BillReceive>> GetBillReceivesByClient(int ClientId) =>
          (_repository as IBillReceiveRepository)
            .GetBillReceivesByClient(ClientId);
        public Task<List<BillReceive>> GetPaidBillReceivesByClient(int ClientId) =>
          (_repository as IBillReceiveRepository)
            .GetPaidBillReceivesByClient(ClientId);
        public Task<List<BillReceive>> GetNoPaidBillReceivesByClient(int ClientId) =>
          (_repository as IBillReceiveRepository)
            .GetNoPaidBillReceivesByClient(ClientId);
        public Task<int> NextCode() =>
          (_repository as IBillReceiveRepository)
          .NextCode();

        public async Task<List<BillReceive>> CreateBillReceives(CreateBillReceivesDto createBillReceivesDto)
        {
            decimal sumOriginalValue = 0;
            string errors = "";
            foreach (var billReceive in createBillReceivesDto.BillReceives)
            {
                sumOriginalValue += billReceive.OriginalValue;
                if (billReceive.DueDate < createBillReceivesDto.PurchaseDate)
                {
                    if (errors != "")
                        errors += $"|A data do vencimento {billReceive.DueDate.ToString("dd/MM/yyyy")} da parcela {billReceive.Quota} é menor que a data da compra {createBillReceivesDto.PurchaseDate.ToString("dd/MM/yyyy")}";
                    else
                        errors = $"A data do vencimento {billReceive.DueDate.ToString("dd/MM/yyyy")} da parcela {billReceive.Quota} é menor que a data da compra {createBillReceivesDto.PurchaseDate.ToString("dd/MM/yyyy")}";
                }
            }

            if (sumOriginalValue != createBillReceivesDto.OriginalValue)
            {
                if (errors != "")
                    errors += $"|A soma das parcelas (R$ {sumOriginalValue}) difere do valor do título (R$ {createBillReceivesDto.OriginalValue})";
                else
                    errors = $"A soma das parcelas (R$ {sumOriginalValue}) difere do valor do título (R$ {createBillReceivesDto.OriginalValue})";
            }

            if (errors != "")
                throw new NotSupportedException(errors);

            int nextCode = await (_repository as IBillReceiveRepository).NextCode();

            foreach (var billReceive in createBillReceivesDto.BillReceives)
            {
                billReceive.ClientId = createBillReceivesDto.ClientId;
                billReceive.PurchaseDate = createBillReceivesDto.PurchaseDate;
                billReceive.Code = nextCode;
                billReceive.Vendor = createBillReceivesDto.Vendor;
                var ret = await (_repository as IBillReceiveRepository).AddAsync(billReceive);
                if (!string.IsNullOrWhiteSpace(ret))
                    throw new NotSupportedException(ret);
            }

            return createBillReceivesDto.BillReceives;
        }

        public Task RemoveBillReceivesByCode(int Code) => (_repository as IBillReceiveRepository).RemoveBillReceivesByCode(Code);



    }
}
