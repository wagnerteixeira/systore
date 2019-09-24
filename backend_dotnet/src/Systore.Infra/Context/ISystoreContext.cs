using System;
using System.Collections.Generic;
using System.Text;
using Systore.Infra.Abstractions;
using Microsoft.EntityFrameworkCore;
using Systore.Domain.Entities;

namespace Systore.Infra.Context
{
    public interface ISystoreContext : IDbContext
    {
        DbSet<User> Users { get; set; }
        DbSet<Client> Clients { get; set; }
        DbSet<BillReceive> BillReceives { get; set; }
        DbSet<Product> Products { get; set; }
        DbSet<Sale> Sales { get; set; }
        DbSet<ItemSale> ItemSales { get; set; }

    }
}
