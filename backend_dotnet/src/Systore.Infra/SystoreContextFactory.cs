using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Systore.Infra.Context;
using Microsoft.Extensions.Options;
using Systore.Domain;

namespace Systore.Infra
{
    public class SystoreContextFactory : IDesignTimeDbContextFactory<SystoreContext>
    {
        private string _connectionString = "Server=systorehomolog.eastus.cloudapp.azure.com;User Id=systore;Password=12345678;Database=systore";
        public SystoreContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<SystoreContext>();
            optionsBuilder.UseMySql(_connectionString);
            AppSettings appSettings = new AppSettings()
            {
                ConnectionString = _connectionString,
                DatabaseType = "MySql",
                Secret = "Secret"
            };
            IOptions<AppSettings> options = Options.Create(appSettings);
            return new SystoreContext(optionsBuilder.Options, options);
        }
    }
}