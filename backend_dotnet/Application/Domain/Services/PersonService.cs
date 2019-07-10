using Application.Domain.Entities;
using Application.Domain.Services.Interfaces;
using Application.Infra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Services
{
    public class PersonService : ServiceBase<Person>, IPersonService
    {
        public PersonService(Context context) : base(context)
        {

        }

        public bool AnyChek()
        {
            return true;
        }
    }
}
