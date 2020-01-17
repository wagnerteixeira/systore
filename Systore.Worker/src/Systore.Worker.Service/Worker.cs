using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Cronos;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Systore.Worker.Service.Configurations;
using Systore.Worker.Service.Providers;
using Systore.Worker.Works.BackupMysqlToGDrive;

namespace Systore.Worker.Service
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly ILogger<Work> _workLogger;
        //private readonly WorkProvider _workProvider;
        private readonly IConfiguration _configuration;
        private readonly WorkerConfigurations _workerConfigurations;

        public Worker(
            ILogger<Worker> logger,
            ILogger<Work> workLogger,
            IConfiguration configuration)
        //  WorkProvider workProvider)
        {
            _logger = logger;
            _workLogger = workLogger;
            //_workProvider = workProvider;

            _workerConfigurations = new WorkerConfigurations();

            new ConfigureFromConfigurationOptions<WorkerConfigurations>(configuration.GetSection("WorkerConfigurations"))
                .Configure(_workerConfigurations);


            foreach (var worker in _workerConfigurations.Workers)
            {
                worker.NextLocalTime = GetNextLocalTime(worker);
            }
            _configuration = configuration;

        }

        private DateTime? GetNextLocalTime(Configurations.Worker worker)
        {
            CronExpression expression = CronExpression.Parse(worker.CronExpression);

            DateTimeOffset? next = expression.GetNextOccurrence(DateTimeOffset.Now, TimeZoneInfo.Local);

            var nextLocalTime = next?.DateTime;

            return nextLocalTime?.AddTicks(-((nextLocalTime?.Ticks ?? 0) % (60 * 10_000_000)));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {

            while (!stoppingToken.IsCancellationRequested)
            {
                foreach (var worker in _workerConfigurations.Workers)
                {
                    var nowDate = DateTimeOffset.Now;
                    if (nowDate.AddTicks(-(nowDate.Ticks % (60 * 10_000_000))) == worker.NextLocalTime)
                    {

                        _logger.LogInformation($"Worker init running at: {DateTimeOffset.Now}");
                        //var work = _workProvider.GetWork("Systore.Worker.Works.BackupMysqlToGDrive");
                        var work = new Work(_workLogger, _configuration);
                        var task = work.ExecuteAsync(stoppingToken);

                        task.ContinueWith((res) =>
                        {
                            if (res.Status == TaskStatus.RanToCompletion)
                                _logger.LogInformation($"Worker finally running at: {DateTimeOffset.Now} res: {res.Result}");
                            else
                                _logger.LogError("Error when executing worker", res.Exception);

                        });


                        worker.NextLocalTime = GetNextLocalTime(worker);
                    }
                }

                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}
