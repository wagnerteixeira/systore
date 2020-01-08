using System;
using System.Collections.Generic;
using System.Text;

namespace Systore.Worker.Works.BackupMysqlToGDrive
{
    public class BackupConfigurations
    {
        public string ConnectionString { get; set; }
        public string AuditConnectionString { get; set; }
        public string ParentFolderInDrive { get; set; }
    }
}
