using System;
using System.Collections.Generic;
using System.Text;
using Systore.Domain.Enums;

namespace Systore.Domain.Dtos
{
    public class FilterDto
    {
        public string PropertyName { get; set; }
        public Operation Operation { get; set; }
        public object Value { get; set; }
    }
}
