using System;
using System.Reflection;
using Systore.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Systore.Domain;
using Microsoft.Extensions.Options;

namespace Systore.Infra.Context
{

    public partial class SystoreContext : DbContext, ISystoreContext
    {
        public DbContext Instance => this;

        private AppSettings _appSettings { get; set; }

        public SystoreContext(DbContextOptions<SystoreContext> options, IOptions<AppSettings> settings)
            : base(options)
        {
          _appSettings = settings.Value;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            Console.WriteLine($"Configure database with {_appSettings.DatabaseType}");
            if (!optionsBuilder.IsConfigured)
            {
              if (_appSettings.DatabaseType == "Mysql")
                optionsBuilder.UseMySql(_appSettings.ConnectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(SystoreContext).Assembly, c => c.Name.Contains(_appSettings.DatabaseType));
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<BillReceive> BillReceives { get; set; }
        public DbSet<Product> Products { get; set; }
    }
}
