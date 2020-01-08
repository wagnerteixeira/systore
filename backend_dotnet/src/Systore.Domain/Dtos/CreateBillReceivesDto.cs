using System;
using Systore.Domain.Entities;
using System.Collections.Generic;

namespace Systore.Domain.Dtos
{
  public class CreateBillReceivesDto
  {
    public int ClientId { get; set; }
    public decimal OriginalValue { get; set; }
    public DateTime PurchaseDate { get; set; }
    public int Quotas { get; set; }
    public string Vendor { get; set; }
    public List<BillReceive> BillReceives { get; set; }
  }
}

