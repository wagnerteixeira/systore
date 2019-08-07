using System;
using System.Collections.Generic;
using System.Text;

namespace Systore.Domain
{
    public class AppSettings
    {
        public string Secret { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseType { get; set; }
    }
}
