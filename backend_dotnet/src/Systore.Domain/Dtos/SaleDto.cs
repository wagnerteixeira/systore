using System;
using System.Collections.Generic;
using Systore.Domain.Entities;
using Systore.Domain.Enums;

namespace Systore.Domain.Dtos
{
    public class SaleDto
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public Client Client { get; set; }
        public decimal FinalValue { get; set; }
        public DateTime SaleDate { get; set; }
        public string Vendor { get; set; }
        public ICollection<ItemSaleDto> ItemSale { get; set; }
    }
}


