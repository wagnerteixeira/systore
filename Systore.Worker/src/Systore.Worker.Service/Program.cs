using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Systore.Worker.Service.Extensions;

namespace Systore.Worker.Service
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseService()
                .ConfigureServices((hostContext, services) =>
                {
                    services.UseWorks();
                    services.AddHostedService<Worker>();
                });
    }
}
