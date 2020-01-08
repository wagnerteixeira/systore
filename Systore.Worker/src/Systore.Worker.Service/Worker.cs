using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Systore.Worker.Service.Providers;

namespace Systore.Worker.Service
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly WorkProvider _workProvider;

        public Worker(ILogger<Worker> logger, WorkProvider workProvider)
        {
            _logger = logger;
            _workProvider = workProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var work = _workProvider.GetWork("Systore.Worker.Works.BackupMysqlToGDrive");
                var res = await work.ExecuteAsync(stoppingToken);
                _logger.LogInformation($"Worker running at: {DateTimeOffset.Now} res: {res}");
                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}
