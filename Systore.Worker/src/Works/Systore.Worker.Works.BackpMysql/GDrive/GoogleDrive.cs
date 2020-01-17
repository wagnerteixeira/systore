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
using Systore.Worker.Works.BackupMysqlToGDrive;

namespace Systore.Worker.Works.BackupMysqlToGDrive.GDrive
{
    public class GoogleDrive
    {
        private static string[] _scopes = { DriveService.Scope.Drive };
        private static string _applicationName = "Systore.Worker.Works.BackupMysqlToGDrive";
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
            UserCredential credential;

            using (var stream =
                new FileStream("credentials.json", FileMode.Open, FileAccess.Read))
            {
                // The file token.json stores the user's access and refresh tokens, and is created
                // automatically when the authorization flow completes for the first time.
                string credPath = "token.json";

                credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    _scopes,
                    "user",
                    CancellationToken.None,
                    new FileDataStore(credPath, true)).Result;

                _logger.LogInformation("Credential file saved to: " + credPath);


            }

            // Create Drive API service.
            var service = new DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = _applicationName,
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

            FilesResource.CreateMediaUpload request;

            using (var stream = new System.IO.FileStream(zipedFile,
                                    System.IO.FileMode.Open))
            {
                request = service.Files.Create(
                    fileMetadata, stream, "application/zip");

                request.Fields = "id";
             //   request.ProgressChanged += Request_ProgressChanged;
             //   request.ResponseReceived += Request_ResponseReceived;
                request.Upload();
                _logger.LogInformation($"File {name} uploaded to google drive");
            }

            var file = request.ResponseBody;

            return !string.IsNullOrWhiteSpace(file?.Id);
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
