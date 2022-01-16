using Microsoft.Extensions.Hosting;
using System;
using Systore.Worker.Service.Configurations;


namespace Systore.Worker.Service.Extensions
{
    public static class OSServiceExtensions
    {
        public static IHostBuilder UseService(this IHostBuilder hostBuilder)
        {
            if (OS.IsWindows())
                hostBuilder.UseWindowsService();
            else if (OS.IsLinux())
                hostBuilder.UseSystemd();
            else if (OS.IsMacOS())
                throw new NotSupportedException("Operating system not suported");

            return hostBuilder;
        }
    }
}
