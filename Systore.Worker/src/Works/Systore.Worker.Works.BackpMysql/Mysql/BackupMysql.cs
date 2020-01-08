using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace Systore.Worker.Works.BackupMysqlToGDrive
{
    public class BackupMysql
    {
        private readonly string _connectionString;

        public BackupMysql(string connectionString)
        {
            _connectionString = connectionString;
        }

        public string BackupDatabase(string backupFile)
        {
            try
            {
                using (MySqlConnection conn = new MySqlConnection(_connectionString))
                {
                    using (MySqlCommand cmd = new MySqlCommand())
                    {
                        using (MySqlBackup mb = new MySqlBackup(cmd))
                        {
                            cmd.Connection = conn;
                            conn.Open();
                            mb.ExportToFile(backupFile);
                            conn.Close();
                        }
                    }
                }
            }
            catch(Exception e)
            {
                return e.Message;
            }

            return "";
        }
    }
}
