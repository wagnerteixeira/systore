using System;
using System.Collections.Generic;
using System.Text;

namespace Systore.Worker.Service.Configurations
{
    public class WorkerConfigurations
    {
        public Worker[] Workers { get; set; }
    }

    public class Worker
    {
        public string CronExpression { get; set; }
        public string WorkerName { get; set; }
        public DateTime? NextLocalTime { get; set; }
    }
}
