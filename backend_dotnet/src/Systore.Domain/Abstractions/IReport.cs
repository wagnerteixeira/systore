using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Systore.Domain.Abstractions
{
    public interface IReport
    {
        Task<byte[]> GenerateReport(string reportFile, params object[] parameters);
    }
}
