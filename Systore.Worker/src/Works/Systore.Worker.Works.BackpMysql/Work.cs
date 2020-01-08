using System;
using System.Threading;
using System.Threading.Tasks;
using Systore.Worker.Abstractions;
using System.Composition;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System.IO;
using Systore.Worker.Works.BackupMysqlToGDrive.Exceptions;
using System.IO.Compression;
using Systore.Worker.Works.BackupMysqlToGDrive.GDrive;

namespace Systore.Worker.Works.BackupMysqlToGDrive
{

    [Export(typeof(IWork))]
    public class Work : IWork
    {
        private readonly ILogger<Backup> _logger;
        private readonly IConfiguration _configuration;
        private readonly BackupConfigurations _backupConfigurations;

        public Work(ILogger<Backup> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
            _backupConfigurations = new BackupConfigurations();

            new ConfigureFromConfigurationOptions<BackupConfigurations>(
               configuration.GetSection("BackupConfigurations"))
                   .Configure(_backupConfigurations);

            if (string.IsNullOrWhiteSpace(_backupConfigurations.ConnectionString))
                throw new ArgumentNullException("Backup configuration not set");
        }

        private async Task ExecuteBackup()
        {
            var backup = new BackupMysql(_backupConfigurations.ConnectionString);
            var folderPath = $"{Path.GetTempPath()}{DateTime.Now.ToString("yyyy_MM_dd_HH_mm_ss")}";
            var backupFile = $"{folderPath}\\backup.sql";
            string ret = backup.BackupDatabase(backupFile);

            if (!string.IsNullOrWhiteSpace(ret))
                _logger.LogError(new BackupException(ret), ret);

            var zipPath = folderPath + ".zip";

            ZipFile.CreateFromDirectory(folderPath, zipPath);

            var googleDrive = new GoogleDrive(_logger, _configuration);

            await Task.Delay(1000);

            googleDrive.UploadZipedFile(zipPath);

        }


        public async Task<string> ExecuteAsync(CancellationToken stoppingToken)
        {
            await ExecuteBackup();
            return "";
        }
    }
}