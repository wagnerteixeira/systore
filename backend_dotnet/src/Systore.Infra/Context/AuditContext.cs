using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using Systore.Domain;

namespace Systore.Infra.Context
{
   

    public partial class AuditContext : DbContext, IAuditContext
    {
        public DbContext Instance => this;

        private AppSettings _appSettings { get; set; }

        public AuditContext(DbContextOptions<AuditContext> options, IOptions<AppSettings> settings)
            : base(options)
        {
            _appSettings = settings.Value;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            Console.WriteLine($"Configure audit database with {_appSettings.DatabaseType}");
            if (!optionsBuilder.IsConfigured)
            {
                if (_appSettings.DatabaseType == "MySql")
                    optionsBuilder.UseMySql(_appSettings.AuditConnectionString);                
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AuditContext).Assembly, c => c.Name.Contains(_appSettings.DatabaseType) && c.Name.Contains("Audit"));
        }        
    }
}
