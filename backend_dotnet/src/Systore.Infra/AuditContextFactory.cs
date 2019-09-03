using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Systore.Infra.Context;
using Microsoft.Extensions.Options;
using Systore.Domain;

namespace Systore.Infra
{
    public class AuditContextFactory : IDesignTimeDbContextFactory<AuditContext>
    {
        private string _connectionString = "Server=systorehomolog.eastus.cloudapp.azure.com;User Id=systore;Password=12345678;Database=systoreAudit";

        public AuditContext CreateDbContext(string[] args)
        {

            var optionsBuilder = new DbContextOptionsBuilder<AuditContext>();
            optionsBuilder.UseMySql(_connectionString);
            AppSettings appSettings = new AppSettings()
            {
                ConnectionString = _connectionString,
                DatabaseType = "MySql",
                Secret = "Secret"
            };
            IOptions<AppSettings> options = Options.Create(appSettings);
            return new AuditContext(optionsBuilder.Options, options);
        }

        public AuditContext CreateDbContext(IOptions<AppSettings> options)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AuditContext>();
            optionsBuilder.UseMySql(options.Value.AuditConnectionString);           
            return new AuditContext(optionsBuilder.Options, options);
        }
    }
}