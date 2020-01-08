using System;
using System.Collections.Generic;
using System.Text;

namespace Systore.Worker.Works.BackupMysqlToGDrive.Exceptions
{
    public class BackupException : Exception
    {
        public BackupException(string message) :
            base(message)
        {

        }
    }
}
