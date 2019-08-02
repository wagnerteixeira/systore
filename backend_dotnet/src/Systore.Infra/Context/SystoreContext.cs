using System;
using System.Reflection;
using Systore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Systore.Context.Infra
{

    public partial class SystoreContext : DbContext, ISystoreContext
    {
        public DbContext Instance => this;
        
        public SystoreContext()
        {
        }

        public SystoreContext(DbContextOptions<SystoreContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseMySql("Server=localhost;User Id=root;Password=12345678;Database=systore");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(SystoreContext).Assembly, c => c.Name.Contains("MySql"));
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<BillReceive> BillReceives { get; set; }
        public DbSet<Product> Products { get; set; }
    }
}
