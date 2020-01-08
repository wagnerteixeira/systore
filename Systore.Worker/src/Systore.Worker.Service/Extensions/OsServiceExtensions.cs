using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Text;
using Systore.Worker.Service.Configurations;
using Microsoft.Extensions.Hosting;

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
