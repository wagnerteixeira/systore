using System;
using System.Threading;
using System.Threading.Tasks;

namespace Systore.Worker.Abstractions
{
    public interface IWork
    {
        Task<string> ExecuteAsync(CancellationToken stoppingToken);
    }
}
