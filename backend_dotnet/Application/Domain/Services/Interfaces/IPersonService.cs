using Application.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Services.Interfaces
{
    public interface IPersonService : IServiceBase<Person>
    {
        bool AnyChek();        
    }
}
