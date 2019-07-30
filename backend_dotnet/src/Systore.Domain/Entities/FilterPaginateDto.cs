using System;
using System.Collections.Generic;
using System.Text;
using Systore.Domain.Enums;

namespace Systore.Domain.Entities
{
    public class FilterPaginateDto 
    {
        public IEnumerable<FilterDto> filters { get; set; }
        public string SortPropertyName { get; set; }
        public int Skip { get; set; }
        public int Limit { get; set; }
        public Order Order { get; set; }
    }
}
