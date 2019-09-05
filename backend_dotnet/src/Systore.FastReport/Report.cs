using System;
using System.Threading.Tasks;
using Systore.Domain.Abstractions;

namespace Systore.FastReport
{
    public class Report : IReport
    {
        public async Task<byte[]> GenerateReport(string reportFile, params object[] parameters)
        {
            throw new NotImplementedException();
        }
    }
}
