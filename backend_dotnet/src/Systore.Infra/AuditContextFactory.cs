using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Systore.Infra.Context;
using Microsoft.Extensions.Options;
using Systore.Domain;
using Microsoft.Extensions.Configuration;
using System.IO;
using System;

namespace Systore.Infra
{
    public class AuditContextFactory : IDesignTimeDbContextFactory<AuditContext>
    {

        public static IConfiguration Configuration { get; } = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
            .Build();

       
        public AuditContext CreateDbContext(string[] args)
        {
            var settingsSection = Configuration.GetSection("AppSettings");
            var appSettings = new AppSettings();
            settingsSection.Bind(appSettings);

            var optionsBuilder = new DbContextOptionsBuilder<AuditContext>();
            optionsBuilder.UseMySql(appSettings.AuditConnectionString);            
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