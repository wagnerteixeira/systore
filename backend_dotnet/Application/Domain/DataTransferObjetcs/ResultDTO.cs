using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.DataTransferObjects
{
    public class ResultDTO
    {
        public bool Success { get; set; }
        public string Message { get; set; }

        public int Id { get; set; }
    }
}
