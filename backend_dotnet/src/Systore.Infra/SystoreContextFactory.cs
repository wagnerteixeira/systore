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
    public SystoreContext CreateDbContext(string[] args)
    {
      var optionsBuilder = new DbContextOptionsBuilder<SystoreContext>();
      optionsBuilder.UseMySql("Server=localhost;User Id=root;Password=12345678;Database=systore");
      AppSettings appSettings = new AppSettings()
      {
        ConnectionString = "Server=localhost;User Id=root;Password=12345678;Database=systore",
        DatabaseType = "Mysql",
        Secret = "Secret"
      };
      IOptions<AppSettings> options = Options.Create(appSettings);
      return new SystoreContext(optionsBuilder.Options, options);
    }
  }
}