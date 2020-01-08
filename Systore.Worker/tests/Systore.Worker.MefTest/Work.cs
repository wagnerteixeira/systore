using System;
using System.Composition;
using System.Threading;
using System.Threading.Tasks;
using Systore.Worker.Abstractions;

namespace Systore.Worker.MefTest
{
    [Export(typeof(IWork))]
    public class Work : IWork
    {
        public async Task<string> ExecuteAsync(CancellationToken stoppingToken)
        {
            //await Task.Delay(1000);
            return "Executed";
        }
    }
}
