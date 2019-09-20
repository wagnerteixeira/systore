using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Systore.Domain.Entities
{
    public class SaleProducts
    {
        public int Id { get; set; }

        public int SaleId { get; set; }

        [JsonIgnore]
        public Sale Sale { get; set; }

        public int ProductId { get; set; }

        public Product Product { get; set; }

        public decimal Price { get; set; }

        public decimal Quantity { get; set; }

        public decimal TotalPrice { get; set; }
    }
}
