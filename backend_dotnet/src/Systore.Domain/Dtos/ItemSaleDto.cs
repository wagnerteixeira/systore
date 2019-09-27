using System;
using System.Collections.Generic;
using System.Text;
using Systore.Domain.Enums;

namespace Systore.Domain.Dtos
{
    public class ItemSaleDto 
    {
        public int Id { get; set; }

        public int SaleId { get; set; }

        public int ProductId { get; set; }        
        public string ProductDescription { get; set; }
        public decimal Price { get; set; }

        public decimal Quantity { get; set; }

        public decimal TotalPrice { get; set; }

        public ActionItem Action { get; set; } = ActionItem.NoChanges;
    }
}
