using System;
using Systore.Domain.Enums;

namespace Systore.Domain.Entities
{
  public class BillReceive
  {
    public int Id { get; set; }
    public int ClientId { get; set; }
    public Client Client { get; set; }
    public int Code { get; set; }
    public int Quota { get; set; }
    public decimal OriginalValue { get; set; }
    public decimal Interest { get; set; }
    public decimal FinalValue { get; set; }
    public DateTime PurchaseDate { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? PayDate { get; set; }
    public int DaysDelay { get; set; }
    public BillReceiveSituation Situation { get; set; }
    public string Vendor { get; set; }
  }
}


