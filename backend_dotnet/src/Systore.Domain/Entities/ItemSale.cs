using System;
using System.Collections.Generic;
using System.Text;
using Systore.Domain.Enums;

namespace Systore.Domain.Entities
{
    public class ItemSale
    {
        public int Id { get; set; }

        public int SaleId { get; set; }

        public Sale Sale { get; set; }

        public int ProductId { get; set; }

        public Product Product { get; set; }

        public decimal Price { get; set; }

        public decimal Quantity { get; set; }

        public decimal TotalPrice { get; set; }

        public virtual ActionItem Action { get; set; } = ActionItem.NoChanges;
    }
}
