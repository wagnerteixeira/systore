using System;
using System.Collections.Generic;
using System.Text;

namespace Systore.Worker.Abstractions.Providers
{
    public interface IWorkProvider
    {
        IWork GetWork(string Id);

    }
}
