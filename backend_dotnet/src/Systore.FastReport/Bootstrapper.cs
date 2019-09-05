using FastReport.Data;
using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.Text;
using FastReport.Utils;

namespace Systore.FastReport
{
    public static class Bootstrapper
    {
        public static IApplicationBuilder UseReport(this IApplicationBuilder app)
        {
            RegisteredObjects.AddConnection(typeof(MySqlDataConnection));
            app.UseFastReport();
            return app;
        }
    }
}
