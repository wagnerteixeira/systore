using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog.AspNetCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Systore.Api.Extensions
{
    public static class SerilogExtensions
    {
        public static IServiceCollection UseSerilog(this IServiceCollection services,
            Serilog.ILogger logger = null, bool dispose = false)
        {
            services.AddSingleton<ILoggerFactory>(new SerilogLoggerFactory());
            return services;
        }
    }
}
