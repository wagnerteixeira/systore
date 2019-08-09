using System;
using System.Collections.Generic;
using Systore.Domain.Enums;

namespace Systore.Domain.Entities
{
    public class Sale
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public Client Client { get; set; }
        public decimal FinalValue { get; set; }
        public DateTime SaleDate { get; set; }
        public string Vendor { get; set; }
        public ICollection<SaleProducts> SaleProducts { get; set; }
    }
}


