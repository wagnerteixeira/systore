using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Systore.Worker.Abstractions;
using Systore.Worker.Abstractions.Providers;

namespace Systore.Worker.Service.Providers
{
    public class WorkProvider : IWorkProvider
    {
        private readonly IEnumerable<IWork> _works;
        public WorkProvider(IEnumerable<IWork> works)
        {
            _works = works;
        }

        public IWork GetWork(string id)
        {
            var work = _works.Where(c => c.GetType().ToString() == id).FirstOrDefault();
            if (work == null)
                throw new NotImplementedException($"Work {id} not implemented or not registered");
            return work;
        }
    }
}
