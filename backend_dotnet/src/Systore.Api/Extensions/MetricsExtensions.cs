using App.Metrics.Configuration;
using App.Metrics.Extensions.Reporting.InfluxDB;
using App.Metrics.Extensions.Reporting.InfluxDB.Client;
using App.Metrics.Reporting.Interfaces;
using AutoMapper.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Systore.Domain;

namespace Systore.Api.Extensions
{
    public static class MetricsExtensions
    {
        private static MetricsSettings _metricsSettings;
        public static IServiceCollection UseMetrics(
            this IServiceCollection services,
            Microsoft.Extensions.Configuration.IConfiguration configuration,
            IHostingEnvironment env)
        {
            _metricsSettings = new MetricsSettings();
            configuration.GetSection("MetricsSettings").Bind(_metricsSettings);
            if (_metricsSettings.UseMetrics)
            {

                services.AddMetrics(options =>
                {
                    options.WithGlobalTags((globalTags, info) =>
                    {
                        globalTags.Add("app", info.EntryAssemblyName);
                        globalTags.Add("env", env.EnvironmentName);
                    });
                })
                .AddHealthChecks()
                .AddReporting(
                    factory =>
                    {
                        factory.AddInfluxDb(
                            new InfluxDBReporterSettings
                            {
                                InfluxDbSettings = new InfluxDBSettings(_metricsSettings.InfluxDatabase, new Uri(_metricsSettings.InfluxServer)),
                                ReportInterval = TimeSpan.FromSeconds(5)
                            });
                    })
                .AddMetricsMiddleware(options => options.IgnoredHttpStatusCodes = new[] { 404 });                
            }
            return services;
        }

        public static IApplicationBuilder UseMetrics(this IApplicationBuilder app, IApplicationLifetime lifetime)
        {
            if (_metricsSettings.UseMetrics)
            {
                app.UseMetrics();
                app.UseMetricsReporting(lifetime);
            }
            return app;
        }
    }
}
