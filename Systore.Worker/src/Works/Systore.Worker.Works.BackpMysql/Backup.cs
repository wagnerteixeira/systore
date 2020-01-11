using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Text;
using System.Threading.Tasks;
using Systore.Worker.Works.BackupMysqlToGDrive.Exceptions;
using Systore.Worker.Works.BackupMysqlToGDrive.GDrive;

namespace Systore.Worker.Works.BackupMysqlToGDrive
{
    public class Backup
    {
        private readonly ILogger<Work> _logger;
        private readonly IConfiguration _configuration;
        private readonly BackupConfigurations _backupConfigurations;
        public Backup(ILogger<Work> logger, IConfiguration configuration)
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

        public void ExecuteBackup()
        {
            var backup = new BackupMysql(_backupConfigurations.ConnectionString);
            var folderPath = $"{Path.GetTempPath()}{DateTime.Now.ToString("yyyy_MM_dd_HH_mm_ss")}";
            var backupFile = $"{folderPath}\\backup.sql";
           
            Directory.CreateDirectory(folderPath);
            string ret = backup.BackupDatabase(backupFile); 

            if (!string.IsNullOrWhiteSpace(ret))
                _logger.LogError(new BackupException(ret), ret);

            var zipPath = folderPath + ".zip";

            ZipFile.CreateFromDirectory(folderPath, zipPath);

            var googleDrive = new GoogleDrive(_logger, _configuration);
            Task.Delay(1000).Wait();

            googleDrive.UploadZipedFile(zipPath);

        }
    }
}
