using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;
using Google.Apis.Upload;
using Systore.Worker.Works.BackupMysqlToGDrive;

namespace Systore.Worker.Works.BackupMysqlToGDrive.GDrive
{
    public class GoogleDrive
    {
        private readonly ILogger<Work> _logger;
        private readonly BackupConfigurations _backupConfigurations;

        public GoogleDrive(ILogger<Work> logger, IConfiguration configuration)
        {
            _logger = logger;
            _backupConfigurations = new BackupConfigurations();           

            new ConfigureFromConfigurationOptions<BackupConfigurations>(
                configuration.GetSection("BackupConfigurations"))
                    .Configure(_backupConfigurations);        }

        private DriveService GetDriveService()
        {
            var credential = GoogleCredential.FromFile(_backupConfigurations.CredentialsPath)
                .CreateScoped(DriveService.ScopeConstants.Drive);

            // Create Drive API service.
            var service = new DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential
            });

            return service;
        }

        public bool UploadZipedFile(string zipedFile)
        {
            var service = GetDriveService();
            var name = Path.GetFileName(zipedFile);
            var fileMetadata = new Google.Apis.Drive.v3.Data.File()
            {
                Name = name,
                Parents = new List<string> { _backupConfigurations.ParentFolderInDrive }
            };
            
            using var fsSource = new FileStream(zipedFile, FileMode.Open, FileAccess.Read);
            
            var request = service.Files.Create(fileMetadata, fsSource, "application/zip");
            var results = request.Upload();
            if (results.Status == UploadStatus.Failed)
            {
                _logger.LogError("Error when uploading file with message: {message}", results.Exception.Message);
                throw results.Exception;
            }
            _logger.LogInformation("File {name} uploaded to google drive", name);
            return true;
        }

        public void InitializeGoogleDrive()
        {
            var service = GetDriveService();

            // Define parameters of request.
            FilesResource.ListRequest listRequest = service.Files.List();
            listRequest.PageSize = 10;
            listRequest.Fields = "nextPageToken, files(id, name)";

            // List files.
            IList<Google.Apis.Drive.v3.Data.File> files = 
                listRequest
                .Execute()
                .Files;

            _logger.LogInformation("Files:");

            if (files != null && files.Count > 0)
            {
                foreach (var file in files)
                {
                    _logger.LogInformation("{0} ({1})", file.Name, file.Id);
                }
            }
            else
            {
                _logger.LogInformation("No files found.");
            }
        }
    }
}
