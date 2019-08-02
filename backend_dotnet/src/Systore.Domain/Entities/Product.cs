using System;
using System.Collections.Generic;
using System.Text;
using Systore.Domain.Enums;

namespace Systore.Domain.Entities
{
   public class Product
    {
        public int Id { get; set; }            

        public SaleType SaleType { get; set; }

        public decimal Price { get; set; }

        public int ExpirationDays { get; set; }

        public string FirstDescription { get; set; }

        public string SecondDescription { get; set; }

        public string ThirdDescription { get; set; }

        public bool PrintExpirationDate { get; set; }

        public bool PrintDateOfPackaging { get; set; }

    }
}
