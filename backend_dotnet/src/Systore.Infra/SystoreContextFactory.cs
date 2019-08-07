using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Systore.Infra.Context;

namespace Systore.Infra
{
    public class SystoreContextFactory : IDesignTimeDbContextFactory<SystoreContext>
    {
        public SystoreContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<SystoreContext>();
            optionsBuilder.UseMySql("Server=localhost;User Id=root;Password=12345678;Database=systore");

            return new SystoreContext(optionsBuilder.Options, null);
        }
    }
}